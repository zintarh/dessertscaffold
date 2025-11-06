"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { z } from "zod";
import { Card, CardContent } from "../components/ui/card";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import PageAnimation from "../components/PageAnimation";

import { Input } from "../components/ui/front/input";
import toast, { Toaster } from "react-hot-toast";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});


  const updateFormData = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const validationResult = loginSchema.safeParse(formData);
    if (!validationResult.success) {
      const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
      validationResult.error.errors.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as keyof LoginFormData] = error.message;
        }
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });


      console.log(result)

      if (result?.status === 401) {
        toast.error("Invalid signin credentials");
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        toast.success("Login successful! Redirecting...");
        const session = await getSession();
        if (session?.user) {
          const redirectTo = searchParams.get("callbackUrl") || "/dashboard";
          router.push(redirectTo);
        } else {
          toast.error("Session error. Please try again.");
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-bg">
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
                    Welcome back!
                  </h1>
                  <p 
                    className="text-lg"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Log in to your account
                  </p>
                </div>

                <Card className="border border-default shadow-sm bg-surface">
                  <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <Input
                        label="Email address"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                        error={errors.email}
                        required
                      />

                      <div className="relative">
                        <Input
                          label="Password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={(e) => updateFormData("password", e.target.value)}
                          error={errors.password}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-9 text-tertiary hover:text-primary transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-[var(--accent)] border-default rounded focus:ring-[var(--accent)] bg-transparent"
                          />
                          <span className="ml-2 text-sm text-secondary">
                            Remember me
                          </span>
                        </label>
                        <Link
                          href="/forgot-password"
                          className="text-sm text-accent hover:opacity-80 font-medium transition-colors"
                        >
                          Forgot password?
                        </Link>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full disabled:opacity-50 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 hover:opacity-90"
                        style={{ 
                          backgroundColor: 'var(--primary-button)',
                        }}
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <span>Continue</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  </CardContent>
                </Card>


                {/* Sign Up Link */}
                <div className="mt-6 text-center">
                  <p className="text-secondary">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/signup"
                      className="text-accent hover:opacity-80 font-medium transition-colors"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
                <div className="mt-4 text-center">
                  <Link href="/" className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-default text-sm font-medium text-secondary hover:text-primary hover:bg-surface-muted transition-colors">
                    Back to Home
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
