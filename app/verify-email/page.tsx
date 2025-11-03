"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSetAtom } from "jotai";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, XCircle, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "../contexts/ThemeContext";
import Button from "../(user)/components/ui/Button";

function VerifyEmailContent() {
  const { isDarkMode, isHydrated } = useTheme();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "success" | "error"
  >("pending");
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      handleVerification();
    }
  }, [token]);

  const handleVerification = async () => {
    if (!token) return;

    setIsVerifying(true);
    try {
    } catch (error: any) {
      setVerificationStatus("error");
      setErrorMessage(error.message || "Verification failed");
    } finally {
      setIsVerifying(false);
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
      className={`min-h-screen flex items-center justify-center ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-gray-50 via-blue-50 to-emerald-50 text-gray-900"
      }`}
    >
      <div className="max-w-md w-full mx-4">
        <motion.div
          className={`p-8 rounded-2xl shadow-xl backdrop-blur-sm ${
            isDarkMode
              ? "bg-gray-800/90 border border-gray-700"
              : "bg-white/90 border border-gray-200"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {verificationStatus === "pending" && (
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Verifying Email</h1>
              <p className="text-gray-600 mb-6">
                Please wait while we verify your email address...
              </p>
              {isVerifying && (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              )}
            </div>
          )}

          {verificationStatus === "success" && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold mb-2 text-green-600">
                Email Verified!
              </h1>
              <p className="text-gray-600 mb-6">
                Your email has been successfully verified. You'll be redirected
                to the dashboard shortly.
              </p>
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span>Account activated successfully</span>
              </div>
            </div>
          )}

          {verificationStatus === "error" && (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold mb-2 text-red-600">
                Verification Failed
              </h1>
              <p className="text-gray-600 mb-6">
                {errorMessage ||
                  "We encountered an issue verifying your email address."}
              </p>
              <Button
                onClick={() => router.push("/signin")}
                variant="primary"
                size="lg"
                className="flex items-center space-x-2 mx-auto"
              >
                <span>Go to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
