'use client'

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
// If your styles are global, import them in app/globals.css. Otherwise, convert to a CSS module and import here.
import './style.css'
import Delete from '@/components/chatbot/Delete'
import RightArrow from '@/components/chatbot/RightArrow'
import { Dot } from 'lucide-react'

// ---------- Types ----------

type Sender = 'user' | 'bot'

type Message = {
  id: number
  liked: 'like' | 'dislike' | null
  timestamp: Date
  text: string
  sender: Sender
  serverId?: string | number
  promptText?: string
  error?: boolean
}

type UserData = {
  company_name?: string
  [key: string]: unknown
} | null

type DislikeTarget = Message | null

type ParsedDetail = { label: string; value: string }

type ParsedWeek = { week: string; actions: string[] }

type ParsedAI = { title: string; details: ParsedDetail[]; weeks: ParsedWeek[]; period?: string }

// ---------- Constants / helpers ----------

const HISTORY_KEY = 'chatbot:history'
const CHAT_CLEARED_FLAG = 'chatbot:manually-cleared'

const reviveMessages = (arr: Partial<Message>[] = []): Message[] =>
  arr.map((m) => ({
    id: Number(m.id) || Date.now() + Math.random(),
    liked: (m.liked as Message['liked']) ?? null,
    timestamp: m.timestamp ? new Date(m.timestamp as unknown as string) : new Date(),
    text: String(m.text ?? ''),
    sender: (m.sender as Sender) ?? 'bot',
    serverId: m.serverId,
    promptText: m.promptText,
    error: Boolean(m.error),
  }))

const loadCache = (): Message[] => {
  try {
    return reviveMessages(JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'))
  } catch {
    return []
  }
}

const saveCache = (msgs: Message[]) => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(msgs))
    localStorage.removeItem(CHAT_CLEARED_FLAG)
  } catch {}
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'
const getAuthToken = () => (typeof window !== 'undefined' ? localStorage.getItem('jwtToken') : null)

// Strip common Markdown artifacts (bullets, bold/italics/code/strikethrough)
const cleanMarkdown = (s = '') =>
  s
    .replace(/(^|\n)\s*[-*•]\s+/g, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/\*{1,3}/g, '')
    .trim()

function parseAIResponse(rawText: string): ParsedAI {
  const result: ParsedAI = { title: '', details: [], weeks: [] }
  if (!rawText) return result

  const text = cleanMarkdown(rawText)
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)

  // Find an explicit markdown title if present: "### Title: ..."
  let explicitTitle = ''
  for (const line of lines) {
    const m = line.match(/^#{1,6}\s*Title:\s*(.+)$/i)
    if (m) {
      explicitTitle = m[1].trim()
      break
    }
  }

  // Fallback title: the first non "Key: Value" line
  let fallbackTitle = ''
  for (const line of lines) {
    if (!/^([^:]+):\s*(.+)$/.test(line) && !/^#{1,6}\s*Title:/i.test(line)) {
      fallbackTitle = line
      break
    }
  }

  result.title = explicitTitle || fallbackTitle || ''

  // Parse Key: Value pairs
  for (const line of lines) {
    if (/^#{1,6}\s*Title:/i.test(line)) continue
    const kv = line.match(/^\s*(?:[-*•]\s*)?([^:]+):\s*(.+)\s*$/)
    if (kv) {
      const label = kv[1].trim()
      const value = kv[2].trim()

      if (
        result.title &&
        (line === result.title || line.replace(/^Title:\s*/i, '').trim() === result.title)
      ) {
        continue
      }
      result.details.push({ label, value })
    }
  }

  // Optional: parse "Week N ..." sections
  const weekRegex = /(Week\s+\d+[^\n]*)([\s\S]*?)(?=Week\s+\d+|$)/gi
  let wk: RegExpExecArray | null
  while ((wk = weekRegex.exec(text)) !== null) {
    const weekTitle = wk[1].trim()
    const actions = wk[2]
      .split(/\r?\n/)
      .map((l) => cleanMarkdown(l).trim())
      .filter(Boolean)
    if (actions.length) result.weeks.push({ week: weekTitle, actions })
  }

  return result
}

// ---------- Page component ----------

export default function ChatbotPage() {
  // Read dynamic segments from the URL: /Chatbot/[ranged]/[countryName]/[month]/[year]
  const params = useParams<{
    ranged: string
    countryName: string
    month: string
    year: string
  }>()

  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [systemHealth] = useState<unknown>(null)
  const [availableData] = useState<unknown>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [actionMessage, setActionMessage] = useState<{ id: number; text: string } | null>(null)
  const [dislikeInputFor, setDislikeInputFor] = useState<DislikeTarget>(null)
  const [aliasOfInput, setAliasOfInput] = useState('')
  const [userData, setUserData] = useState<UserData>(null)

  const inputRef = useRef<HTMLTextAreaElement | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const scrollToBottom = (instant = false) => {
    const el = scrollRef.current
    if (!el) return
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: instant ? 'auto' : 'smooth' })
    })
  }

  useLayoutEffect(() => {
    scrollToBottom(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length, isTyping])

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isLoading])

  useEffect(() => {
    const initializeApp = async () => {
      const wasManuallyCleared = localStorage.getItem(CHAT_CLEARED_FLAG) === 'true'
      if (wasManuallyCleared) {
        setMessages([])
        return
      }

      const cached = loadCache()
      if (cached.length > 0) {
        setMessages(cached)
        return
      }

      setMessages([])
    }
    initializeApp()
  }, [])

  const clearChatLocally = () => {
    localStorage.setItem(CHAT_CLEARED_FLAG, 'true')
    setMessages([])
    setDislikeInputFor(null)
    setAliasOfInput('')
    setActionMessage(null)
  }

  useEffect(() => {
    const handleLogoutEvent = () => {
      setMessages([])
      setDislikeInputFor(null)
      setAliasOfInput('')
      setActionMessage(null)
      localStorage.removeItem(HISTORY_KEY)
      localStorage.removeItem(CHAT_CLEARED_FLAG)
    }

    window.addEventListener('chat:clear', handleLogoutEvent)
    return () => window.removeEventListener('chat:clear', handleLogoutEvent)
  }, [])

  const addMessage = (msg: Omit<Message, 'id' | 'liked' | 'timestamp'> & Partial<Message>) => {
    const m: Message = {
      id: Date.now() + Math.random(),
      liked: null,
      timestamp: new Date(),
      text: msg.text ?? '',
      sender: msg.sender ?? 'bot',
      serverId: msg.serverId,
      promptText: msg.promptText,
      error: msg.error,
    }
    setMessages((prev) => {
      const next = [...prev, m]
      saveCache(next)
      return next
    })
    return m
  }

  const userMsg = (text: string): Message => ({ id: Date.now(), liked: null, timestamp: new Date(), text, sender: 'user' })
  const botMsg = (text: string, extra: Partial<Message> = {}): Message => ({ id: Date.now() + 1, liked: null, timestamp: new Date(), text, sender: 'bot', ...extra })

  const sendMessage = async (text = inputValue) => {
    const content = text.trim()
    if (!content || isLoading) return

    addMessage(userMsg(content))
    setInputValue('')
    setIsLoading(true)
    setIsTyping(true)
    scrollToBottom(true)

    try {
      const resp = await fetch(`${API_BASE_URL}/chatbot`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'chat', query: content, params }),
      })
      const data = await resp.json()
      if (resp.ok && (data?.success as boolean)) {
        addMessage(
          botMsg(String(data.response ?? ''), {
            serverId: data.message_id,
            promptText: content,
          })
        )
      } else {
        addMessage(botMsg('Error processing request', { error: true }))
      }
    } catch {
      addMessage(botMsg('Network error', { error: true }))
    } finally {
      setIsLoading(false)
      setIsTyping(false)
      scrollToBottom()
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('jwtToken')
      if (!token) return
      try {
        const res = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/get_user_data`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setUserData(data)
      } catch {
        // no-op
      }
    }
    fetchUserData()
  }, [])

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleCopy = async (msg: Message) => {
    if (!msg || !msg.text) return
    try {
      await navigator.clipboard.writeText(msg.text)
      setActionMessage({ id: msg.id, text: 'Copied!' })
      setTimeout(() => setActionMessage(null), 1500)
    } catch {}
  }

  const handleLike = async (msgObj: Message) => {
    if (!msgObj || msgObj.sender !== 'bot') return
    try {
      const payload = {
        kind: 'like',
        message_id: msgObj.serverId || msgObj.id,
        response: msgObj.text,
      }
      const resp = await fetch(`${API_BASE_URL}/chatbot/feedback`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      const data = await resp.json()
      if (resp.ok && (data.success as boolean)) {
        setMessages((prev) => prev.map((m) => (m.id === msgObj.id ? { ...m, liked: 'like' } : m)))
        setActionMessage({ id: msgObj.id, text: 'Liked!' })
        setTimeout(() => setActionMessage(null), 1500)
      }
    } catch {
      setMessages((prev) => prev.map((m) => (m.id === msgObj.id ? { ...m, liked: 'like' } : m)))
      setActionMessage({ id: msgObj.id, text: 'Liked!' })
      setTimeout(() => setActionMessage(null), 1500)
    }
  }

  const handleDislikeClick = (msgObj: Message) => {
    if (!msgObj || msgObj.sender !== 'bot') return
    setDislikeInputFor(msgObj)
    setAliasOfInput('')
  }

  const handleSaveDislike = async (feedbackText: string | null = null) => {
    const msgObj = dislikeInputFor
    if (!msgObj) return
    try {
      const payload = {
        kind: 'dislike',
        message_id: msgObj.serverId || msgObj.id,
        response: feedbackText || aliasOfInput.trim() || 'User provided negative feedback without additional comments',
      }
      const resp = await fetch(`${API_BASE_URL}/chatbot/feedback`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      const data = await resp.json()
      if (resp.ok && (data.success as boolean)) {
        setMessages((prev) => prev.map((m) => (m.id === msgObj.id ? { ...m, liked: 'dislike' } : m)))
        setActionMessage({ id: msgObj.id, text: 'Disliked!' })
        setTimeout(() => setActionMessage(null), 1500)
        setDislikeInputFor(null)
        setAliasOfInput('')
      }
    } catch {
      setMessages((prev) => prev.map((m) => (m.id === msgObj.id ? { ...m, liked: 'dislike' } : m)))
      setActionMessage({ id: msgObj.id, text: 'Disliked!' })
      setTimeout(() => setActionMessage(null), 1500)
      setDislikeInputFor(null)
      setAliasOfInput('')
    }
  }

  const handleCancelDislike = () => {
    handleSaveDislike('User provided negative feedback without additional comments')
  }

  const clearChat = () => {
    clearChatLocally()
  }

  const getValidMessages = () => messages.filter((msg) => msg && typeof msg === 'object' && msg.text && msg.sender)
  const validMessages = getValidMessages()

  if (!userData) {
    return <div className="p-4">Loading...</div>
  }

  return (
    <div className="flex flex-col bg-white font-[Lato] chatbot-container ">
      <div className="text-white bg-gradient-to-r from-[#5ea68e] to-[#37455f] rounded-t-xl message-header py-[2vw] px-[2vw] md:py-[2vw] md:px-[3.5vw] lg:py-[1vw] lg:px-[1.25vw]">
        <h1 className="text-base sm:text-lg md:text-xl lg:text-[1.625rem] font-bold">
          Hi <i>{userData?.company_name?.split(' ')[0] || 'User'}!</i>
        </h1>
        <p className="text-xs sm:text-sm md:text-base lg:text-[1rem] mt-1">
        I'm your Analytics Assistant, here to help you understand your business data, generate insights, and make informed decisions. What would you like to explore today?
        </p>
      </div>

      <div className="flex-1 border border-black/25 rounded-b-xl chat-container flex flex-col">
        {/* Chat messages container */}
        <div ref={scrollRef} className="w-full mx-auto h-[63vh] sm:h-[65vh] lg:h-[60vh] 2xl:h-[70vh] overflow-y-auto p-3">
          {/* Bottom-anchoring wrapper: keeps content at the bottom until it overflows */}
          <div className="min-h-full flex flex-col justify-end space-y-3">
            {validMessages.length > 0 ? (
              <>
                {/* Render messages in natural order */}
                {validMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className="flex flex-col mx-4">
                      <div
                        className={`px-4 py-2 rounded-2xl text-xs sm:text-sm md:text-[0.75] lg:text-[0.875rem] break-words max-w-full sm:max-w-[50vw] md:max-w-[50vw] lg:max-w-full ${msg.sender === 'user' ? 'bg-[#5EA68E] text-[#F8EDCE] mb-2' : 'bg-[#D9D9D9] text-gray-800 mb-1'}`}
                      >
                        {msg.sender !== 'user' && msg.text ? (
                          (() => {
                            const parsed = parseAIResponse(msg.text)
                            if (parsed.title || parsed.details.length > 0) {
                              return (
                                <div className="space-y-1">
                                  {parsed.title && <h3 className="font-semibold text-gray-800">{parsed.title}</h3>}
                                  {parsed.period && <p className="text-sm text-gray-500">{parsed.period}</p>}
                                  <ul className="space-y-2">
                                    {parsed.details.map((d, i) => (
                                      <li key={i} className="flex items-start gap-2 leading-relaxed">
                                        <Dot className="mt-1 shrink-0" size={18} />
                                        <div className="text-xs sm:text-sm">
                                          <span className="font-bold text-gray-900">{d.label}:</span>{' '}
                                          {d.value.split('\n').map((line, idx) => (
                                            <span key={idx}>
                                              {idx > 0 && <br />}
                                              <span className="text-gray-700">{line}</span>
                                            </span>
                                          ))}
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )
                            } else {
                              return cleanMarkdown(msg.text)
                            }
                          })()
                        ) : (
                          msg.text
                        )}
                      </div>

                      {msg.sender !== 'user' && (
                        <div className="flex flex-col ml-2 mb-2">{/* action buttons placeholder */}</div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-center px-4 py-2 rounded-2xl text-[#D9D9D9] rounded-bl-none">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <span key={i} className="inline-block w-3 h-3 md:w-2 md:h-2 rounded-full mr-2 last:mr-0 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-1 justify-center items-center text-gray-400 text-sm sm:text-base md:text-lg lg:text-xl px-2 sm:px-4 md:px-6 lg:px-8">
                Start a new conversation 💬
              </div>
            )}
          </div>
        </div>

        {/* Bottom input */}
        <div className="bottom">
          <div className="line bg-gray-300 h-[2px]"></div>
          <div className="px-1 py-1 lg:px-5 lg:py-1.5">
            <div className="bottom-bar flex justify-between items-center">
              <div
                className="flex items-center bg-[#ECECEC] rounded-[30px] m-[10px] w-[88%] sm:w-[77vw] md:w-[73vw] lg:w-[95%] py-1 px-3 md:py-2 cursor-text"
                onClick={() => inputRef.current?.focus()}
              >
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about your sales data…"
                  rows={1}
                  disabled={isLoading}
                  autoFocus
                  className="flex-1 bg-transparent text-black caret-black outline-none resize-none placeholder:text-xs sm:placeholder:text-sm md:placeholder:text-base lg:placeholder:text-[1rem] text-xs sm:text-sm md:text-[0.75] lg:text-[0.875rem] h-full cursor-text"
                />
                <RightArrow onClick={() => sendMessage()} disabled={isLoading || !inputValue.trim()} className="cursor-pointer ml-2" />
              </div>
              <Delete className="cursor-pointer mr-2 mt-1" onClick={clearChat} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
