"use client";
import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "../components/ui/card";
import { ArrowLeft, Mail } from "lucide-react";
import PageAnimation from "../components/PageAnimation";
import { Input } from "../components/ui/front/input";
import toast, { Toaster } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Client-side validation
    const newErrors: { email?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        toast.success(data.message);
      } else {
        toast.error(data.error || "Failed to send reset email. Please try again.");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#FDFCFA]">
        <Toaster position="top-right" />
        <PageAnimation>
          <div className="flex min-h-screen">
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
              <div className="w-full max-w-md">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8 text-green-600" />
                  </div>
                  
                  <h1 
                    className="text-3xl font-bold mb-4"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Check your email
                  </h1>
                  
                  <p 
                    className="text-lg mb-8"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    We've sent a password reset link to <strong>{email}</strong>
                  </p>

                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Didn't receive the email? Check your spam folder or try again.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => {
                          setIsSubmitted(false);
                          setEmail("");
                        }}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Try different email
                      </button>
                      
                      <Link
                        href="/signin"
                        className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center"
                      >
                        Back to sign in
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PageAnimation>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <Toaster position="top-right" />
      <PageAnimation>
        <div className="flex min-h-screen">
          <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
              <div className="mb-8">
                <div className="text-center flex items-center space-x-2 mb-8">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-sm"></div>
                  </div>
                  <span 
                    className="text-2xl font-bold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Dissertation Scaffold
                  </span>
                </div>

                <div className="mb-8">
                  <h1 
                    className="text-3xl sm:text-4xl font-bold mb-2"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Forgot your password?
                  </h1>
                  <p 
                    className="text-lg"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    No worries! Enter your email and we'll send you a reset link.
                  </p>
                </div>

                <Card className="border border-gray-200 shadow-sm bg-white">
                  <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <Input
                        label="Email address"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={errors.email}
                        required
                      />

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 hover:opacity-90"
                        style={{ 
                          backgroundColor: 'var(--primary-button)',
                        }}
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <span>Send reset link</span>
                        )}
                      </button>
                    </form>
                  </CardContent>
                </Card>

                {/* Back to Sign In Link */}
                <div className="mt-6 text-center">
                  <Link
                    href="/signin"
                    className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-800 font-medium transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to sign in</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageAnimation>
    </div>
  );
}
