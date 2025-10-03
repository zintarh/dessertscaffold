"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "../components/ui/card";
import { ArrowRight, Eye, EyeOff, ChevronDown } from "lucide-react";
import { Input } from "../components/ui/front/input";
import toast, { Toaster } from "react-hot-toast";
import { z } from "zod";

const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name is too long"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name is too long"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    school: z
      .string()
      .min(1, "School/University is required")
      .min(2, "School name must be at least 2 characters")
      .max(100, "School name is too long"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password is too long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    studentCategory: z.string().min(1, "Please select your student category"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    school: "",
    password: "",
    confirmPassword: "",
    studentCategory: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignupFormData, string>>
  >({});

  const updateFormData = (field: keyof SignupFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const studentCategories = [
    {
      id: "undergraduate",
      name: "Undergraduate",
      description: "Bachelor's degree student",
      icon: "🎓",
    },
    {
      id: "masters",
      name: "Masters",
      description: "Master's degree student",
      icon: "🎓",
    },
    {
      id: "phd",
      name: "PhD Student",
      description: "Doctoral degree student",
      icon: "🎓",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const validationResult = signupSchema.safeParse(formData);

    if (!validationResult.success) {
      const fieldErrors: Partial<Record<keyof SignupFormData, string>> = {};
      validationResult.error.errors.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as keyof SignupFormData] = error.message;
        }
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      const academicLevelMap: { [key: string]: string } = {
        undergraduate: "UNDERGRADUATE",
        masters: "MASTERS",
        phd: "PHD",
      };

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          userType: "STUDENT",
          institutionName: formData.school,
          academicLevel: academicLevelMap[formData.studentCategory],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        router.push(
          "/signin?message=Registration successful! Please sign in with your credentials."
        );
      } else {
        if (data.details && Array.isArray(data.details)) {
          const fieldErrors: { [key: string]: string } = {};
          data.details.forEach((detail: any) => {
            fieldErrors[detail.field] = detail.message;
          });
          setErrors(fieldErrors);
        } else {
          toast.error(data.error || "Registration failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <Toaster position="top-right" />
      <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg">
          <div className="mb-8">
            <div className="text-center flex items-center justify-center space-x-2 mb-8">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <span
                className="text-2xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Dissert Scaffold
              </span>
            </div>

            <div className="mb-8">
              <h1
                className="text-3xl sm:text-4xl font-bold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Create your account
              </h1>
              <p
                className="text-base"
                style={{ color: "var(--text-secondary)" }}
              >
                Join thousands of researchers advancing their academic journey
              </p>
            </div>

            <Card className="border border-gray-200 shadow-sm bg-white">
              <CardContent className="p-8 w-full">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-4">
                    <Input
                      label="First Name"
                      type="text"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={(e) =>
                        updateFormData("firstName", e.target.value)
                      }
                      error={errors.firstName}
                      required
                    />

                    <Input
                      label="Last Name"
                      type="text"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={(e) =>
                        updateFormData("lastName", e.target.value)
                      }
                      error={errors.lastName}
                      required
                    />
                  </div>

                  {/* Email */}
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    error={errors.email}
                    required
                  />

                  {/* School */}
                  <Input
                    label="School/University"
                    type="text"
                    placeholder="Enter your school or university"
                    value={formData.school}
                    onChange={(e) => updateFormData("school", e.target.value)}
                    error={errors.school}
                    required
                  />

                  {/* Password */}
                  <div className="relative">
                    <Input
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) =>
                        updateFormData("password", e.target.value)
                      }
                      error={errors.password}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="space-y-2">
                      <div className="text-xs text-gray-600">
                        Password requirements:
                      </div>
                      <div className="space-y-1 text-xs">
                        <div
                          className={`flex items-center space-x-2 ${
                            formData.password.length >= 8
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              formData.password.length >= 8
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          ></div>
                          <span>At least 8 characters</span>
                        </div>
                        <div
                          className={`flex items-center space-x-2 ${
                            /[a-z]/.test(formData.password)
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              /[a-z]/.test(formData.password)
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          ></div>
                          <span>One lowercase letter</span>
                        </div>
                        <div
                          className={`flex items-center space-x-2 ${
                            /[A-Z]/.test(formData.password)
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              /[A-Z]/.test(formData.password)
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          ></div>
                          <span>One uppercase letter</span>
                        </div>
                        <div
                          className={`flex items-center space-x-2 ${
                            /\d/.test(formData.password)
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              /\d/.test(formData.password)
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          ></div>
                          <span>One number</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Confirm Password */}
                  <div className="relative">
                    <Input
                      label="Confirm Password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        updateFormData("confirmPassword", e.target.value)
                      }
                      error={errors.confirmPassword}
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Student Category Dropdown */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Student Category
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setShowCategoryDropdown(!showCategoryDropdown)
                        }
                        className="w-full flex items-center justify-between px-3 py-3 border border-gray-300 rounded-lg bg-white text-left text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      >
                        <span
                          className={
                            formData.studentCategory
                              ? "text-gray-900"
                              : "text-gray-500"
                          }
                        >
                          {formData.studentCategory
                            ? studentCategories.find(
                                (cat) => cat.id === formData.studentCategory
                              )?.name
                            : "Select your student category"}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-gray-400 transition-transform ${
                            showCategoryDropdown ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {showCategoryDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          {studentCategories.map((category) => (
                            <button
                              key={category.id}
                              type="button"
                              onClick={() => {
                                updateFormData("studentCategory", category.id);
                                setShowCategoryDropdown(false);
                              }}
                              className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                            >
                              <div className="text-lg">{category.icon}</div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {category.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {category.description}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {errors.studentCategory && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.studentCategory}
                      </p>
                    )}
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      required
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-1"
                    />
                    <p className="text-sm text-gray-600">
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="text-purple-600 hover:text-purple-800 font-medium"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-purple-600 hover:text-purple-800 font-medium"
                      >
                        Privacy Policy
                      </Link>
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 hover:opacity-90"
                    style={{
                      backgroundColor: "var(--primary-button)",
                    }}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </CardContent>
            </Card>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
