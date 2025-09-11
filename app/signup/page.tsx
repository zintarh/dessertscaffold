"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import toast from "react-hot-toast";

import {
  GraduationCap,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Users,
  Target,
  Shield,
  Brain,
  Award,
  Building,
} from "../components/Icons";
import { registerUserAtom } from "../../lib/stores/authStore";
import {
  SIGNUP_CONSTANTS,
  UserType,
  AcademicLevel,
} from "../../lib/constants/signup";

import { useTheme } from "../contexts/ThemeContext";
import Navbar from "../components/Navbar";
import {
  signupStepAtom,
  signupFormDataAtom,
  isStepValidAtom,
  canProceedAtom,
  canGoBackAtom,
  nextStepAtom,
  prevStepAtom,
  updateFormDataAtom,
  resetSignupAtom,
  goToStepAtom,
  type SignupFormData,
} from "../../lib/stores/signupStore";

// Disable static generation for this page
export const dynamic = "force-dynamic";

export default function SignupPage() {
  const { isDarkMode, toggleTheme, isHydrated } = useTheme();

  // Jotai atoms for persistent state
  const [currentStep, setCurrentStep] = useAtom(signupStepAtom);
  const [formData, setFormData] = useAtom(signupFormDataAtom);
  const canProceed = useAtomValue(canProceedAtom);
  const canGoBack = useAtomValue(canGoBackAtom);
  const setNextStep = useSetAtom(nextStepAtom);
  const setPrevStep = useSetAtom(prevStepAtom);
  const updateFormData = useSetAtom(updateFormDataAtom);
  const resetSignup = useSetAtom(resetSignupAtom);
  const goToStep = useSetAtom(goToStepAtom);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  // Password matching validation
  const passwordsMatch = formData.password === formData.confirmPassword;
  const showPasswordMismatch = formData.confirmPassword.length > 0 && !passwordsMatch;

  // Jotai atoms for authentication
  const registerUser = useSetAtom(registerUserAtom);

  // Cleanup effect - reset signup state when component unmounts
  useEffect(() => {
    return () => {
      // Only reset if user hasn't completed registration
      if (currentStep < 4) {
        // Don't reset here - let user continue where they left off
        // resetSignup();
      }
    };
  }, [currentStep]);

  const handleNext = () => {
    if (canProceed) {
      // Additional validation for step 2 (student academic level)
      if (
        currentStep === 2 &&
        formData.userType === "STUDENT" &&
        !formData.academicLevel?.trim()
      ) {
        toast.error("Please select your academic level before proceeding.");
        return;
      }
      setNextStep();
    }
  };

  const handlePrevious = () => {
    if (canGoBack) {
      setPrevStep();
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    updateFormData({ [field]: value });
  };

  const isStepValid = useAtomValue(isStepValidAtom);

  const userTypes = SIGNUP_CONSTANTS.USER_TYPES;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep < 4) {
      handleNext();
      return;
    }

    const {
      password,
      confirmPassword,
      userType,
      email,
      firstName,
      lastName,
      institutionName,
      researchArea,
    } = formData as SignupFormData;

    if (password !== confirmPassword) {
      toast.error(SIGNUP_CONSTANTS.VALIDATION_MESSAGES.PASSWORDS_MISMATCH);
      return;
    }
    if (!userType) {
      toast.error(SIGNUP_CONSTANTS.VALIDATION_MESSAGES.USER_TYPE_REQUIRED);
      return;
    }

    setIsSubmitting(true);

    try {
      const userData: any = {
        email: email.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        userType: userType as "STUDENT" | "MENTOR" | "INSTITUTION",
        institutionName: institutionName.trim(),
        researchArea: researchArea.trim(),
      };

      if (formData.academicLevel && formData.academicLevel.trim() !== "") {
        userData.academicLevel = formData.academicLevel.trim();
      }

      const registeredUser = await registerUser(userData);

      if (registeredUser) {
        const signInResult = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (signInResult?.error) {
          console.error(
            "❌ Sign-in failed after registration:",
            signInResult.error
          );
          toast.error(
            `Registration successful but sign-in failed: ${signInResult.error}`
          );
          return;
        }
      }

      toast.success("Welcome! Redirecting to your dashboard...");
      resetSignup();
      router.push("/user/dashboard");
    } catch (err: any) {
      console.error("Signup error:", err);

      const msg = err?.message || "";

      if (msg.includes("Validation failed") && Array.isArray(err.details)) {
        const errorMessages = err.details
          .map((d: any) => `${d.field}: ${d.message}`)
          .join(", ");
        toast.error(`Please fix the following: ${errorMessages}`);
      } else if (msg.includes("already exists")) {
        toast.error(
          "This email is already registered. Try signing in instead or use a different email."
        );
      } else {
        toast.error(msg || "Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen overflow-hidden relative transition-all duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-gray-50 via-blue-50 to-emerald-50 text-gray-900"
      }`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute w-96 h-96 rounded-full blur-3xl animate-pulse ${
            isDarkMode ? "bg-blue-600/20" : "bg-blue-600/10"
          }`}
          style={{ left: "20%", top: "20%" }}
        />
        <div
          className={`absolute top-1/4 right-1/4 w-64 h-64 rounded-full blur-2xl animate-bounce ${
            isDarkMode ? "bg-emerald-500/10" : "bg-emerald-500/5"
          }`}
        />
        <div
          className={`absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full blur-xl animate-pulse ${
            isDarkMode ? "bg-amber-500/10" : "bg-amber-500/5"
          }`}
        />
      </div>

      <Navbar />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <div
                  className="w-full h-[600px] bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url('/images/auth.jpg')`,
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-8 opacity-20">
                      {[
                        GraduationCap,
                        Brain,
                        Award,
                        Target,
                        Building,
                        Users,
                      ].map((Icon, i) => (
                        <motion.div
                          key={i}
                          className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                            isDarkMode ? "bg-white/10" : "bg-white/30"
                          }`}
                          animate={{
                            y: [0, -10, 0],
                            rotate: [0, 5, 0],
                          }}
                          transition={{
                            duration: 3 + i,
                            repeat: Infinity,
                            delay: i * 0.5,
                          }}
                        >
                          <Icon
                            className={`w-8 h-8 ${
                              isDarkMode ? "text-white" : "text-gray-600"
                            }`}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <motion.div
                      className="text-white space-y-6"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold">
                          Join <span className="text-blue-300">10,000+</span>{" "}
                          Researchers
                        </h2>
                        <p className="text-blue-100 text-lg leading-relaxed max-w-md mx-auto">
                          Transform your academic journey with expert insights
                          and a supportive research community.
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Floating Stats */}
              <motion.div
                className={`absolute -top-6 -right-6 p-4 rounded-2xl shadow-xl ${
                  isDarkMode
                    ? "bg-gray-800 border border-gray-700"
                    : "bg-white border border-gray-100"
                }`}
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">
                    10K+
                  </div>
                  <div
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Active Researchers
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Multi-Step Form */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div
              className={`rounded-3xl p-8 shadow-2xl border backdrop-blur-sm ${
                isDarkMode
                  ? "bg-gray-800/90 border-gray-700"
                  : "bg-white/90 border-gray-200"
              }`}
            >
              {/* Step Indicator */}
              <div className="mb-6">
                {currentStep > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-center p-3 rounded-lg mb-4 ${
                      isDarkMode
                        ? "bg-blue-500/10 border border-blue-500/20 text-blue-300"
                        : "bg-blue-50 border border-blue-200 text-blue-700"
                    }`}
                  >
                    <span className="text-sm">
                      ✨ Welcome back! You can continue from where you left off.
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  className="w-20 h-20 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <GraduationCap className="w-10 h-10 text-white" />
                </motion.div>
                <h1
                  className={`text-4xl font-bold mb-3 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Join the Future
                </h1>
                <p
                  className={`text-lg ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {SIGNUP_CONSTANTS.STEPS[currentStep - 1]?.title ||
                    "Complete your registration"}
                </p>
              </div>

              {/* Error Display - REMOVED: Now using toast notifications */}
              {/* {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl border-l-4 ${
                    isDarkMode
                      ? "bg-red-900/20 border-red-500 text-red-300"
                      : "bg-red-50 border-red-500 text-red-700"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <p className="font-medium">{error}</p>
                  </div>
                </motion.div>
              )} */}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: User Type Selection Only */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    {/* User Type Selection */}
                    <div className="space-y-3">
                      <label
                        className={`text-lg font-semibold ${
                          isDarkMode ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        {SIGNUP_CONSTANTS.LABELS.USER_TYPE}
                      </label>
                      <div className="grid grid-cols-1 gap-3">
                        {userTypes.map((type) => {
                          const IconComponent = type.icon;
                          return (
                            <motion.button
                              key={type.id}
                              type="button"
                              onClick={() =>
                                handleInputChange("userType", type.id)
                              }
                              className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                                formData.userType === type.id
                                  ? isDarkMode
                                    ? "border-blue-500 bg-blue-500/10"
                                    : "border-blue-500 bg-blue-50"
                                  : isDarkMode
                                  ? "border-gray-600 hover:border-gray-500 bg-gray-700/50"
                                  : "border-gray-200 hover:border-gray-300 bg-gray-50/50"
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center space-x-3">
                                <div
                                  className={`w-10 h-10 bg-gradient-to-br ${type.color} rounded-xl flex items-center justify-center`}
                                >
                                  <IconComponent className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <div
                                    className={`font-semibold ${
                                      isDarkMode
                                        ? "text-white"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    {type.title}
                                  </div>
                                  <div
                                    className={`text-sm ${
                                      isDarkMode
                                        ? "text-gray-400"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    {type.description}
                                  </div>
                                </div>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Personal Information */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    {formData.userType === "INSTITUTION" ? (
                      /* Institution Name Field */
                      <div className="space-y-2">
                        <label
                          htmlFor="institutionName"
                          className={`text-sm font-semibold ${
                            isDarkMode ? "text-gray-200" : "text-gray-700"
                          }`}
                        >
                          Institution Name
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            id="institutionName"
                            placeholder="Enter institution name"
                            value={formData.institutionName}
                            onChange={(e) =>
                              handleInputChange(
                                "institutionName",
                                e.target.value
                              )
                            }
                            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 ${
                              isDarkMode
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-200 text-gray-900"
                            }`}
                            required
                          />
                        </div>
                      </div>
                    ) : (
                      /* First and Last Name Fields */
                      <>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label
                              htmlFor="firstName"
                              className={`text-sm font-semibold ${
                                isDarkMode ? "text-gray-200" : "text-gray-700"
                              }`}
                            >
                              First Name
                            </label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="text"
                                id="firstName"
                                placeholder="Enter your first name"
                                value={formData.firstName}
                                onChange={(e) =>
                                  handleInputChange("firstName", e.target.value)
                                }
                                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 ${
                                  isDarkMode
                                    ? "bg-gray-700 border-gray-600 text-white"
                                    : "bg-white border-gray-200 text-gray-900"
                                }`}
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label
                              htmlFor="lastName"
                              className={`text-sm font-semibold ${
                                isDarkMode ? "text-gray-200" : "text-gray-700"
                              }`}
                            >
                              Last Name
                            </label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="text"
                                id="lastName"
                                placeholder="Enter your last name"
                                value={formData.lastName}
                                onChange={(e) =>
                                  handleInputChange("lastName", e.target.value)
                                }
                                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 ${
                                  isDarkMode
                                    ? "bg-gray-700 border-gray-600 text-white"
                                    : "bg-white border-gray-200 text-gray-900"
                                }`}
                                required
                              />
                            </div>
                          </div>

                          {/* Academic Level Field for Students */}
                          {formData.userType === "STUDENT" && (
                            <div className="space-y-2">
                              <label
                                htmlFor="academicLevel"
                                className={`text-sm font-semibold ${
                                  isDarkMode ? "text-gray-200" : "text-gray-700"
                                }`}
                              >
                                Academic Level{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select
                                  id="academicLevel"
                                  value={formData.academicLevel || ""}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "academicLevel",
                                      e.target.value
                                    )
                                  }
                                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                    isDarkMode
                                      ? "bg-gray-700 border-gray-600 text-white"
                                      : "bg-white border-gray-200 text-gray-900"
                                  }`}
                                  required
                                >
                                  <option value="">
                                    Select your academic level
                                  </option>
                                  <option value="UNDERGRADUATE">
                                    Undergraduate
                                  </option>
                                  <option value="MASTERS">Masters</option>
                                  <option value="PHD">PhD</option>
                                  <option value="POSTDOC">Postdoc</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                  Required for students to help match you with
                                  appropriate mentors
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </motion.div>
                )}

                {/* Step 3: Contact & Institution */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    {/* Email Field */}
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className={`text-sm font-semibold ${
                          isDarkMode ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        Email Address
                        {formData.userType === "INSTITUTION" && (
                          <span className="text-blue-500 text-xs ml-2">
                            (edu.ng required)
                          </span>
                        )}
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          id="email"
                          placeholder={
                            formData.userType === "INSTITUTION"
                              ? "Enter your edu.ng email"
                              : "Enter your email"
                          }
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-200 text-gray-900"
                          }`}
                          required
                        />
                      </div>
                      {formData.userType === "INSTITUTION" &&
                        formData.email &&
                        !formData.email.toLowerCase().includes("edu.ng") && (
                          <p className="text-red-500 text-sm flex items-center space-x-1">
                            <span>⚠️</span>
                            <span>
                              Institution accounts require an edu.ng email
                              address
                            </span>
                          </p>
                        )}
                    </div>

                    {/* Institution Field */}
                    <div className="space-y-2">
                      <label
                        htmlFor="institution"
                        className={`text-sm font-semibold ${
                          isDarkMode ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        Institution
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          id="institution"
                          placeholder="Your university or organization"
                          value={formData.institutionName}
                          onChange={(e) =>
                            handleInputChange("institutionName", e.target.value)
                          }
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-200 text-gray-900"
                          }`}
                          required={formData.userType === "INSTITUTION"}
                        />
                      </div>
                    </div>

                    {/* Research Area Field */}
                    <div className="space-y-2">
                      <label
                        htmlFor="researchArea"
                        className={`text-sm font-semibold ${
                          isDarkMode ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        Research Area{" "}
                        <span className="text-gray-400">(Optional)</span>
                      </label>
                      <div className="relative">
                        <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          id="researchArea"
                          placeholder="e.g., Machine Learning, Psychology, Biology"
                          value={formData.researchArea}
                          onChange={(e) =>
                            handleInputChange("researchArea", e.target.value)
                          }
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-200 text-gray-900"
                          }`}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Security & Terms */}
                {currentStep === 4 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    {/* Password Field */}
                    <div className="space-y-2">
                      <label
                        htmlFor="password"
                        className={`text-sm font-semibold ${
                          isDarkMode ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-200 text-gray-900"
                          }`}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                      <label
                        htmlFor="confirmPassword"
                        className={`text-sm font-semibold ${
                          isDarkMode ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            handleInputChange("confirmPassword", e.target.value)
                          }
                          className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 placeholder-gray-400 ${
                            showPasswordMismatch
                              ? "border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/20"
                              : passwordsMatch && formData.confirmPassword.length > 0
                              ? "border-green-500 focus:ring-green-500 bg-green-50 dark:bg-green-900/20"
                              : isDarkMode
                              ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                              : "text-gray-900 border-gray-200 focus:ring-blue-500"
                          }`}
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                        
                        {/* Password match indicator */}
                        {formData.confirmPassword.length > 0 && (
                          <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                            {passwordsMatch ? (
                              <div className="w-5 h-5 text-green-500">
                                <svg fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            ) : (
                              <div className="w-5 h-5 text-red-500">
                                <svg fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Password mismatch error message */}
                      {showPasswordMismatch && (
                        <p className="text-sm text-red-500 flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span>Passwords do not match</span>
                        </p>
                      )}
                      
                      {/* Password match success message */}
                      {passwordsMatch && formData.confirmPassword.length > 0 && (
                        <p className="text-sm text-green-500 flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Passwords match</span>
                        </p>
                      )}
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={(e) =>
                          handleInputChange("agreeToTerms", e.target.checked)
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                        required
                      />
                      <label
                        htmlFor="agreeToTerms"
                        className={`text-sm ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        I agree to the{" "}
                        <a
                          href="#"
                          className="text-blue-500 hover:text-blue-600 underline font-medium"
                        >
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          href="#"
                          className="text-blue-500 hover:text-blue-600 underline font-medium"
                        >
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                  </motion.div>
                )}

                {/* Clear Form Button */}
                <div className="flex justify-center mb-4">
                  <motion.button
                    type="button"
                    onClick={resetSignup}
                    className={`px-4 py-2 text-sm rounded-lg transition-all duration-300 ${
                      isDarkMode
                        ? "text-gray-400 hover:text-gray-300 border border-gray-600 hover:border-gray-500"
                        : "text-gray-500 hover:text-gray-600 border border-gray-200 hover:border-gray-300"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Clear Form & Start Over
                  </motion.button>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between space-x-4">
                  {currentStep > 1 && (
                    <motion.button
                      type="button"
                      onClick={handlePrevious}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                        isDarkMode
                          ? "text-gray-300 border border-gray-600 hover:border-gray-500 hover:bg-gray-700"
                          : "text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {SIGNUP_CONSTANTS.BUTTONS.PREVIOUS}
                    </motion.button>
                  )}

                  <motion.button
                    type="submit"
                    disabled={!isStepValid || isSubmitting}
                    className={`flex-1 py-4 bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl flex items-center justify-center space-x-2 text-lg ${
                      currentStep === 1 ? "ml-0" : ""
                    }`}
                    whileHover={{ scale: isStepValid ? 1.02 : 1 }}
                    whileTap={{ scale: isStepValid ? 0.98 : 1 }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>
                          {currentStep === 4
                            ? SIGNUP_CONSTANTS.BUTTONS.SUBMIT
                            : "Continue"}
                        </span>
                        <ArrowRight className="w-6 h-6" />
                      </>
                    )}
                  </motion.button>
                </div>
              </form>

              {/* Login Link */}
              <div className="text-center mt-8">
                <p
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Already have an account?{" "}
                  <Link
                    href="/signin"
                    className="text-blue-500 hover:text-blue-600 font-bold underline transition-colors"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
