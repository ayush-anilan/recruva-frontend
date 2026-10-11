"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { registerUser } from "@/lib/auth";

const registerSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phoneNumber: z
    .string()
    .optional()
    .refine(
      (value) => !value || /^\d{10,15}$/.test(value),
      "Enter a phone number with 10–15 digits"
    ),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError("");
    setSuccessMessage("");

    const requestData = {
        ...data,
        phoneNumber: data.phoneNumber?.trim() || undefined, // Ensure phoneNumber is undefined if not provided
    }

    try {
      const response = await registerUser(requestData);

      if (response.success) {
        setSuccessMessage("Account created successfully. Redirecting to login...");

        setTimeout(() => {
          router.push("/login");
        }, 1200);
      } else {
        setServerError(response.message || "Registration failed.");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Unable to register. Please try again."
        );
      } else {
        setServerError("An unexpected error occurred.");
      }
    }
  };

  const inputClass =
    "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <Link href="/" className="text-sm font-semibold text-indigo-600">
          Recruva
        </Link>

        <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Get started with your recruitment workspace.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                First name
              </label>
              <input
                id="firstName"
                autoComplete="given-name"
                {...register("firstName")}
                className={inputClass}
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                Last name
              </label>
              <input
                id="lastName"
                autoComplete="family-name"
                {...register("lastName")}
                className={inputClass}
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email")}
              className={inputClass}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register("password")}
              className={inputClass}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
              Phone number <span className="text-gray-400">(optional)</span>
            </label>
            <input
              id="phoneNumber"
              type="tel"
              autoComplete="tel"
              {...register("phoneNumber")}
              className={inputClass}
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-xs text-red-600">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          {serverError && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {serverError}
            </p>
          )}

          {successMessage && (
            <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}