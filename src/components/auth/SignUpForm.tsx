// // "use client";

// // import Checkbox from "@/components/form/input/Checkbox";
// // import Input from "@/components/form/input/InputField";
// // import Label from "@/components/form/Label";
// // import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
// // import Link from "next/link";
// // import React, { useMemo, useState } from "react";
// // import "react-phone-input-2/lib/style.css";
// // import PhoneInput from "react-phone-input-2";

// // import { useRegisterMutation } from "@/lib/api/authApi";
// // import { formatPhoneNumber } from "@/lib/utils/phone";
// // import Button from "../ui/button/Button";

// // export default function SignUpForm() {
// //   const [registerUser, { isLoading, isSuccess, error: regError }] = useRegisterMutation();

// //   const [showPassword, setShowPassword] = useState(false);
// //   const [showConfirm, setShowConfirm] = useState(false);
// //   const [isChecked, setIsChecked] = useState(false);

// //   // form fields
// //   const [email, setEmail] = useState("");
// //   const [phoneRaw, setPhoneRaw] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [confirm, setConfirm] = useState("");

// //   // validations (unchanged)
// //   const passwordErrors = useMemo(() => {
// //     const errs: string[] = [];
// //     if (password.length < 6) errs.push("At least 6 characters");
// //     if (!/\d.*\d/.test(password)) errs.push("At least 2 numbers");
// //     if (!/[a-zA-Z].*[a-zA-Z]/.test(password)) errs.push("At least 2 alphabets");
// //     if (confirm && confirm !== password) errs.push("Passwords do not match");
// //     return errs;
// //   }, [password, confirm]);

// //   const canSubmit =
// //     email.trim() &&
// //     phoneRaw.trim() &&
// //     password &&
// //     confirm &&
// //     isChecked &&
// //     passwordErrors.filter((e) => e !== "Passwords do not match").length === 0 &&
// //     confirm === password;

// //   const onSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (isLoading || !canSubmit) return;

// //     try {
// //       await registerUser({
// //         email: email.trim(),
// //         password,
// //         phone_number: formatPhoneNumber(phoneRaw.trim()),
// //         phone_number_raw: phoneRaw.trim(),
// //       }).unwrap();
// //       // success page is shown by `isSuccess` below
// //     } catch {
// //       // error is surfaced via regError; nothing else required here
// //     }
// //   };

// //   // Success card (same look/wording you used)
// //   if (isSuccess) {
// //     return (
// //       <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">

// //         <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
// //           <div className="rounded-xl border border-charcoal-500 dark:border-gray-800 p-6 text-center">
// //             <div className="text-4xl mb-3" style={{ color: "#5EA49B" }}>✓</div>
// //             <h2 className="text-xl font-semibold mb-2 text-charcoal-500 dark:text-white/90">
// //               Registration Successful!
// //             </h2>
// //             <p className="text-charcoal-500 dark:text-gray-400">
// //               You need to verify your email first. Please check your inbox for the verification email.
// //             </p>
// //             <div className="mt-6">
// //               <Link
// //                 href="/signin"
// //                 className="inline-flex items-center justify-center rounded-lg bg-gray-900 text-white px-4 py-2 text-sm hover:bg-gray-800"
// //               >
// //                 Go to Login
// //               </Link>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // Pull readable server error (if any)
// //   const serverErrorMessage =
// //     (regError as any)?.data?.message ||
// //     (regError as any)?.error ||
// //     (typeof regError === "string" ? regError : "") ||
// //     "";

// //   return (
// //     <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
// //       <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
// //         <div>
// //           <div className="mb-5 sm:mb-8">
// //             <h1 className="mb-2 font-semibold text-green-500 text-title-sm dark:text-white/90 sm:text-title-md">
// //               Sign Up!
// //             </h1>
// //             <p className="text-sm text-charcoal-500 dark:text-gray-400">
// //               Enter your details to create an account.
// //             </p>
// //           </div>

// //           <div>


// //             <form onSubmit={onSubmit} noValidate>
// //               <div className="space-y-5">
// //                 {/* Email */}
// //                 <div>
// //                   <Label>
// //                     Email<span className="text-error-500">*</span>
// //                   </Label>
// //                   <Input
// //                     type="email"
// //                     id="email"
// //                     name="email"
// //                     placeholder="Enter your email"
// //                     value={email}
// //                     onChange={(e) => setEmail(e.target.value)}
// //                     autoComplete="email"
// //                     required
// //                   />
// //                 </div>

// //                 {/* Phone */}
// //                 <div>
// //                   <Label>
// //                     Phone Number<span className="text-error-500">*</span>
// //                   </Label>
// //                   <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-1 dark:bg-gray-900">
// //                     <PhoneInput
// //                       country={"us"}
// //                       onlyCountries={["in", "us", "ca", "gb"]}
// //                       value={phoneRaw}
// //                       onChange={(value) => setPhoneRaw(value)}
// //                       inputProps={{ name: "phone", required: true, autoFocus: false }}
// //                       inputClass="!w-full !border-0 !bg-transparent !text-gray-800 dark:!text-white/90 focus:!ring-0 focus:!outline-none"
// //                       buttonClass="!bg-transparent !border-0"
// //                       containerClass="!w-full"
// //                       dropdownStyle={{ zIndex: 1000 }}
// //                     />
// //                   </div>
// //                 </div>

// //                 {/* Password */}
// //                 <div>
// //                   <Label>
// //                     Password<span className="text-error-500">*</span>
// //                   </Label>
// //                   <div className="relative">
// //                     <Input
// //                       placeholder="Enter your password"
// //                       type={showPassword ? "text" : "password"}
// //                       value={password}
// //                       onChange={(e) => setPassword(e.target.value)}
// //                       autoComplete="new-password"
// //                       required
// //                     />
// //                     <button
// //                       type="button"
// //                       onClick={() => setShowPassword((v) => !v)}
// //                       className="absolute z-30 -translate-y-1/2 right-4 top-1/2"
// //                       aria-label={showPassword ? "Hide password" : "Show password"}
// //                     >
// //                       {showPassword ? (
// //                         <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
// //                       ) : (
// //                         <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
// //                       )}
// //                     </button>
// //                   </div>

// //                   {password && passwordErrors.length > 0 && (
// //                     <p className="mt-1.5 text-xs text-red-500" aria-live="polite">
// //                       Password must contain: {passwordErrors.join(", ")}
// //                     </p>
// //                   )}
// //                 </div>

// //                 {/* Confirm Password */}
// //                 <div>
// //                   <Label>
// //                     Confirm Password<span className="text-error-500">*</span>
// //                   </Label>
// //                   <div className="relative">
// //                     <Input
// //                       placeholder="Confirm your password"
// //                       type={showConfirm ? "text" : "password"}
// //                       value={confirm}
// //                       onChange={(e) => setConfirm(e.target.value)}
// //                       autoComplete="new-password"
// //                       required
// //                     />
// //                     <button
// //                       type="button"
// //                       onClick={() => setShowConfirm((v) => !v)}
// //                       className="absolute z-30 -translate-y-1/2 right-4 top-1/2"
// //                       aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
// //                     >
// //                       {showConfirm ? (
// //                         <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
// //                       ) : (
// //                         <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
// //                       )}
// //                     </button>
// //                   </div>
// //                 </div>

// //                 {/* Terms */}
// //                 <div className="flex items-center gap-3">
// //                   <Checkbox className="w-5 h-5" checked={isChecked} onChange={setIsChecked} />
// //                   <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
// //                     By creating an account you agree to the{" "}
// //                     <span className="text-gray-800 dark:text-white/90">Terms and Conditions</span>, and our{" "}
// //                     <span className="text-gray-800 dark:text-white">Privacy Policy</span>.
// //                   </p>
// //                 </div>

// //                 {/* Server error (if any) */}
// //                 {serverErrorMessage && (
// //                   <p className="text-sm text-red-500 -mt-1" aria-live="polite">
// //                     {serverErrorMessage}
// //                   </p>
// //                 )}

// //                 {/* Submit */}
// //                 <div>
// //                   <Button
// //                     type="submit"
// //                     disabled={isLoading || !canSubmit}
// //                     className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium transition rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
// //                   >
// //                     {isLoading ? "Please wait…" : "Sign Up"}
// //                   </Button>
// //                 </div>
// //               </div>
// //             </form>

// //             <div className="relative py-3 sm:py-5">
// //               <div className="absolute inset-0 flex items-center">
// //                 <div className="w-full border-t border-charcoal-500 "></div>
// //               </div>
// //               <div className="relative flex justify-center text-sm">
// //                 <span className="p-2 text-charcoal-500 bg-white sm:px-5 sm:py-2">
// //                   or
// //                 </span>
// //               </div>
// //             </div>

// //             {/* Google Sign-in (full width) */}
// //             <div className="mt-2 w-full border border-charcoal-500 rounded-lg">
// //               <button
// //                 type="button"
// //                 disabled
// //                 className="w-full inline-flex items-center justify-center gap-3 px-4 py-3
// //                text-charcoal-500  rounded-lg transition-colors
// //                 text-md font-bold
// //                dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10
// //                disabled:cursor-not-allowed"
// //                 title="Temporarily disabled"
// //               >
// //                 {/* Icon left */}
// //                 <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
// //                   <path d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z" fill="#4285F4" />
// //                   <path d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z" fill="#34A853" />
// //                   <path d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z" fill="#FBBC05" />
// //                   <path d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z" fill="#EB4335" />
// //                 </svg>
// //                 Continue with Google
// //               </button>
// //             </div>




// //             <div className="mt-5 max-w-fit mx-auto">
// //               <p className="text-sm font-normal text-center text-blue-700 sm:text-start">
// //                 Already a user ? {" "}
// //                 <Link href="/signin" className="text-blue-700 ">
// //                   Sign In
// //                 </Link>
// //               </p>
// //             </div>
// //           </div>

// //         </div>
// //       </div>
// //     </div>
// //   );
// // }









































// "use client";

// import Checkbox from "@/components/form/input/Checkbox";
// import Input from "@/components/form/input/InputField";
// import Label from "@/components/form/Label";
// import { EyeCloseIcon, EyeIcon } from "@/icons";
// import Link from "next/link";
// import React, { useMemo, useState } from "react";
// import "react-phone-input-2/lib/style.css";
// import PhoneInput from "react-phone-input-2";

// import { useRegisterMutation } from "@/lib/api/authApi";
// import { formatPhoneNumber } from "@/lib/utils/phone";
// import Button from "../ui/button/Button";
// import { Modal } from "../ui/modal";

// export default function SignUpForm() {
//   const [registerUser, { isLoading, isSuccess, error: regError }] = useRegisterMutation();

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [isChecked, setIsChecked] = useState(false);

//   // form fields
//   const [email, setEmail] = useState("");
//   const [phoneRaw, setPhoneRaw] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");

//   // validations (unchanged)
//   const passwordErrors = useMemo(() => {
//     const errs: string[] = [];
//     if (password.length < 6) errs.push("At least 6 characters");
//     if (!/\d.*\d/.test(password)) errs.push("At least 2 numbers");
//     if (!/[a-zA-Z].*[a-zA-Z]/.test(password)) errs.push("At least 2 alphabets");
//     if (confirm && confirm !== password) errs.push("Passwords do not match");
//     return errs;
//   }, [password, confirm]);

//   const canSubmit =
//     email.trim() &&
//     phoneRaw.trim() &&
//     password &&
//     confirm &&
//     isChecked &&
//     passwordErrors.filter((e) => e !== "Passwords do not match").length === 0 &&
//     confirm === password;

//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (isLoading || !canSubmit) return;

//     try {
//       await registerUser({
//         email: email.trim(),
//         password,
//         phone_number: formatPhoneNumber(phoneRaw.trim()),
//         phone_number_raw: phoneRaw.trim(),
//       }).unwrap();
//     } catch {
//       // error is surfaced via regError; nothing else required here
//     }
//   };

//   // Pull readable server error (if any)
//   const serverErrorMessage =
//     (regError as any)?.data?.message ||
//     (regError as any)?.error ||
//     (typeof regError === "string" ? regError : "") ||
//     "";

//   return (
//     <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar relative">
//       <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
//         <div>
//           <div className="mb-5 sm:mb-8">
//             <h1 className="mb-2 font-semibold text-green-500 text-title-sm dark:text-white/90 sm:text-title-md">
//               Sign Up!
//             </h1>
//             <p className="text-sm text-charcoal-500 dark:text-gray-400">
//               Enter your details to create an account.
//             </p>
//           </div>

//           <div>
//             <form onSubmit={onSubmit} noValidate>
//               <div className="space-y-5">
//                 {/* Email */}
//                 <div>
//                   <Label>
//                     Email<span className="text-error-500">*</span>
//                   </Label>
//                   <Input
//                     type="email"
//                     id="email"
//                     name="email"
//                     placeholder="Enter your email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     autoComplete="email"
//                     required
//                   />
//                 </div>

//                 {/* Phone */}
//                 <div>
//                   <Label>
//                     Phone Number<span className="text-error-500">*</span>
//                   </Label>
//                   <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-1 dark:bg-gray-900">
//                     <PhoneInput
//                       country={"us"}
//                       onlyCountries={["in", "us", "ca", "gb"]}
//                       value={phoneRaw}
//                       onChange={(value) => setPhoneRaw(value)}
//                       inputProps={{ name: "phone", required: true, autoFocus: false }}
//                       inputClass="!w-full !border-0 !bg-transparent !text-gray-800 dark:!text-white/90 focus:!ring-0 focus:!outline-none"
//                       buttonClass="!bg-transparent !border-0"
//                       containerClass="!w-full"
//                       dropdownStyle={{ zIndex: 1000 }}
//                     />
//                   </div>
//                 </div>

//                 {/* Password */}
//                 <div>
//                   <Label>
//                     Password<span className="text-error-500">*</span>
//                   </Label>
//                   <div className="relative">
//                     <Input
//                       placeholder="Enter your password"
//                       type={showPassword ? "text" : "password"}
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       autoComplete="new-password"
//                       required
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword((v) => !v)}
//                       className="absolute z-30 -translate-y-1/2 right-4 top-1/2"
//                       aria-label={showPassword ? "Hide password" : "Show password"}
//                     >
//                       {showPassword ? (
//                         <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
//                       ) : (
//                         <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
//                       )}
//                     </button>
//                   </div>

//                   {password && passwordErrors.length > 0 && (
//                     <p className="mt-1.5 text-xs text-red-500" aria-live="polite">
//                       Password must contain: {passwordErrors.join(", ")}
//                     </p>
//                   )}
//                 </div>

//                 {/* Confirm Password */}
//                 <div>
//                   <Label>
//                     Confirm Password<span className="text-error-500">*</span>
//                   </Label>
//                   <div className="relative">
//                     <Input
//                       placeholder="Confirm your password"
//                       type={showConfirm ? "text" : "password"}
//                       value={confirm}
//                       onChange={(e) => setConfirm(e.target.value)}
//                       autoComplete="new-password"
//                       required
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowConfirm((v) => !v)}
//                       className="absolute z-30 -translate-y-1/2 right-4 top-1/2"
//                       aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
//                     >
//                       {showConfirm ? (
//                         <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
//                       ) : (
//                         <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
//                       )}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Terms */}
//                 <div className="flex items-center gap-3">
//                   <Checkbox className="w-5 h-5" checked={isChecked} onChange={setIsChecked} />
//                   <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
//                     By creating an account you agree to the{" "}
//                     <span className="text-gray-800 dark:text-white/90">Terms and Conditions</span>, and our{" "}
//                     <span className="text-gray-800 dark:text-white">Privacy Policy</span>.
//                   </p>
//                 </div>

//                 {/* Server error (if any) */}
//                 {serverErrorMessage && (
//                   <p className="text-sm text-red-500 -mt-1" aria-live="polite">
//                     {serverErrorMessage}
//                   </p>
//                 )}

//                 {/* Submit */}
//                 <div>
//                   <Button
//                     type="submit"
//                     disabled={isLoading || !canSubmit}
//                     className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium transition rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
//                   >
//                     {isLoading ? "Please wait…" : "Sign Up"}
//                   </Button>
//                 </div>
//               </div>
//             </form>

//             <div className="relative py-3 sm:py-5">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-charcoal-500 "></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="p-2 text-charcoal-500 bg-white sm:px-5 sm:py-2">
//                   or
//                 </span>
//               </div>
//             </div>

//             {/* Google Sign-in (full width) */}
//             <div className="mt-2 w-full border border-charcoal-500 rounded-lg">
//               <button
//                 type="button"
//                 disabled
//                 className="w-full inline-flex items-center justify-center gap-3 px-4 py-3
//                text-charcoal-500  rounded-lg transition-colors
//                 text-md font-bold
//                dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10
//                disabled:cursor-not-allowed"
//                 title="Temporarily disabled"
//               >
//                 <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
//                   <path d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z" fill="#4285F4" />
//                   <path d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z" fill="#34A853" />
//                   <path d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z" fill="#FBBC05" />
//                   <path d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z" fill="#EB4335" />
//                 </svg>
//                 Continue with Google
//               </button>
//             </div>

//             <div className="mt-5 max-w-fit mx-auto">
//               <p className="text-sm font-normal text-center text-blue-700 sm:text-start">
//                 Already a user ?{" "}
//                 <Link href="/signin" className="text-blue-700 ">
//                   Sign In
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* SUCCESS POPUP OVERLAY */}
//       {/* {isSuccess && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//           <div className="relative mx-4 w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl">
          
//             <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex h-16 w-16 items-center justify-center rounded-full bg-[#5EA49B] shadow-md">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 24 24"
//                 className="h-8 w-8"
//                 fill="none"
//                 stroke="white"
//                 strokeWidth={2.5}
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <path d="M20 6 9 17l-5-5" />
//               </svg>
//             </div>

//             <div className="px-10 pt-12 pb-8 text-center">
//               <h2 className="text-2xl font-semibold mb-3 text-charcoal-500 dark:text-white/90">
//                 Registration Successful!
//               </h2>
//               <p className="text-sm sm:text-base text-charcoal-500 dark:text-gray-300 mb-8">
//                 You need to verify your email first. Please check your inbox for the verification email.
//               </p>

//               <Link
//                 href="/signin"
//                 className="inline-flex items-center justify-center rounded-lg bg-[#5EA49B] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#519287] transition-colors"
//               >
//                 Go to Login
//               </Link>
//             </div>
//           </div>
//         </div>
//       )} */}

//       <Modal
//         isOpen={isOpen}
//         onClose={onClose}
//         showCloseButton={false}
//         className="m-4 max-w-sm"
//       >
//         <div className="w-full rounded-3xl bg-white px-6 py-8 text-center shadow-lg">
//           {/* ✅ icon lives INSIDE the popup */}
//           <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500">
//             <svg
//               className="h-7 w-7 text-white"
//               viewBox="0 0 24 24"
//               fill="none"
//             >
//               <path
//                 d="M20 6L9 17L4 12"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//           </div>

//           <h2 className="text-xl font-semibold text-gray-800">
//             Registration Successful!
//           </h2>
//           <p className="mt-2 text-sm text-gray-600">
//             You need to verify your email first. Please check your inbox for the
//             verification email.
//           </p>

//           <button
//             onClick={onClose}
//             className="mt-6 inline-flex items-center justify-center rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
//           >
//             Go to Login
//           </button>
//         </div>
//       </Modal>



//     </div>
//   );
// }






"use client";

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";

import { useRegisterMutation } from "@/lib/api/authApi";
import { formatPhoneNumber } from "@/lib/utils/phone";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const router = useRouter();

  const [registerUser, { isLoading, isSuccess, error: regError }] =
    useRegisterMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  // ✅ local state for success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // form fields
  const [email, setEmail] = useState("");
  const [phoneRaw, setPhoneRaw] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // when mutation reports success, open modal
  useEffect(() => {
    if (isSuccess) {
      setShowSuccessModal(true);
    }
  }, [isSuccess]);

  // validations (unchanged)
  const passwordErrors = useMemo(() => {
    const errs: string[] = [];
    if (password.length < 6) errs.push("At least 6 characters");
    if (!/\d.*\d/.test(password)) errs.push("At least 2 numbers");
    if (!/[a-zA-Z].*[a-zA-Z]/.test(password)) errs.push("At least 2 alphabets");
    if (confirm && confirm !== password) errs.push("Passwords do not match");
    return errs;
  }, [password, confirm]);

  const canSubmit =
    email.trim() &&
    phoneRaw.trim() &&
    password &&
    confirm &&
    isChecked &&
    passwordErrors.filter((e) => e !== "Passwords do not match").length === 0 &&
    confirm === password;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !canSubmit) return;

    try {
      await registerUser({
        email: email.trim(),
        password,
        phone_number: formatPhoneNumber(phoneRaw.trim()),
        phone_number_raw: phoneRaw.trim(),
      }).unwrap();
      // isSuccess will turn true, useEffect will open modal
    } catch {
      // error is surfaced via regError
    }
  };

  // Pull readable server error (if any)
  const serverErrorMessage =
    (regError as any)?.data?.message ||
    (regError as any)?.error ||
    (typeof regError === "string" ? regError : "") ||
    "";

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar relative">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-green-500 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up!
            </h1>
            <p className="text-sm text-charcoal-500 dark:text-gray-400">
              Enter your details to create an account.
            </p>
          </div>

          <div>
            <form onSubmit={onSubmit} noValidate>
              <div className="space-y-5">
                {/* Email */}
                <div>
                  <Label>
                    Email<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <Label>
                    Phone Number<span className="text-error-500">*</span>
                  </Label>
                  <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-1 dark:bg-gray-900">
                    <PhoneInput
                      country={"us"}
                      onlyCountries={["in", "us", "ca", "gb"]}
                      value={phoneRaw}
                      onChange={(value) => setPhoneRaw(value)}
                      inputProps={{ name: "phone", required: true, autoFocus: false }}
                      inputClass="!w-full !border-0 !bg-transparent !text-gray-800 dark:!text-white/90 focus:!ring-0 focus:!outline-none"
                      buttonClass="!bg-transparent !border-0"
                      containerClass="!w-full"
                      dropdownStyle={{ zIndex: 1000 }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute z-30 -translate-y-1/2 right-4 top-1/2"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </button>
                  </div>

                  {password && passwordErrors.length > 0 && (
                    <p className="mt-1.5 text-xs text-red-500" aria-live="polite">
                      Password must contain: {passwordErrors.join(", ")}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <Label>
                    Confirm Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Confirm your password"
                      type={showConfirm ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute z-30 -translate-y-1/2 right-4 top-1/2"
                      aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showConfirm ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-center gap-3">
                  <Checkbox
                    className="w-5 h-5"
                    checked={isChecked}
                    onChange={setIsChecked}
                  />
                  <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                    By creating an account you agree to the{" "}
                    <span className="text-gray-800 dark:text-white/90">
                      Terms and Conditions
                    </span>
                    , and our{" "}
                    <span className="text-gray-800 dark:text-white">
                      Privacy Policy
                    </span>
                    .
                  </p>
                </div>

                {/* Server error */}
                {serverErrorMessage && (
                  <p className="text-sm text-red-500 -mt-1" aria-live="polite">
                    {serverErrorMessage}
                  </p>
                )}

                {/* Submit */}
                <div>
                  <Button
                    type="submit"
                    disabled={isLoading || !canSubmit}
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium transition rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Please wait…" : "Sign Up"}
                  </Button>
                </div>
              </div>
            </form>

            {/* Divider */}
            <div className="relative py-3 sm:py-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-charcoal-500 "></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="p-2 text-charcoal-500 bg-white sm:px-5 sm:py-2">
                  or
                </span>
              </div>
            </div>

            {/* Google Sign-in */}
            <div className="mt-2 w-full border border-charcoal-500 rounded-lg">
              <button
                type="button"
                disabled
                className="w-full inline-flex items-center justify-center gap-3 px-4 py-3
               text-charcoal-500  rounded-lg transition-colors
                text-md font-bold
               dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10
               disabled:cursor-not-allowed"
                title="Temporarily disabled"
              >
                {/* Google icon ... */}
                <span>Continue with Google</span>
              </button>
            </div>

            <div className="mt-5 max-w-fit mx-auto">
              <p className="text-sm font-normal text-center text-blue-700 sm:text-start">
                Already a user ?{" "}
                <Link href="/signin" className="text-blue-700 ">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ SUCCESS MODAL USING YOUR Modal COMPONENT */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        showCloseButton={false}
        className="m-4 max-w-sm"
      >
        <div className="w-full rounded-xl bg-white px-6 py-8 text-center shadow-lg">
          {/* icon INSIDE popup */}
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-500">
            <svg
              className="h-7 w-7 text-white"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M20 6L9 17L4 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h2 className="text-xl font-semibold text-gray-800">
            Registration Successful!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You need to verify your email first. Please check your inbox for the
            verification email.
          </p>

          <button
            onClick={() => {
              setShowSuccessModal(false);
              router.push("/signin");
            }}
            className="mt-6 inline-flex items-center justify-center rounded-md bg-green-500 px-4 py-2 text-sm font-semibold text-white "
          >
            Go to Login
          </button>
        </div>
      </Modal>
    </div>
  );
}
