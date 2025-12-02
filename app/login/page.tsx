"use client";

import axios from "axios";
import config from "../config";
import { useEffect, useState } from "react";
import Loading from "../genericComponents/Loading";
import { useRouter } from "next/navigation";

// React Hook Form + Zod
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const baseURL = config.baseURL;

// Validation Schema
const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string()
        .min(6, "Password must be at least 6 characters")
        .max(20, "Password must be less than 20 characters"),
    remember: z.boolean().optional()
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data: LoginForm) => {
        setLoading(true);
        try {
            const res = await axios.post(`${baseURL}/auth/login`, {
                email: data.email,
                password: data.password
            });

            if (res.data.isAuthenticated) {
                const userId = res.data.user.userId;

                sessionStorage.setItem("isAuthenticated", "true");
                sessionStorage.setItem("userId", userId);

                if (data.remember) {
                    localStorage.setItem("isAuthenticated", "true");
                    localStorage.setItem("userId", userId);
                }

                router.push(`/movies/${userId}`);
            }
        } catch (error: any) {
            const message = error?.response?.data?.message;
            alert(message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    // Auto login check
    useEffect(() => {
        const local = localStorage.getItem("isAuthenticated") === "true";
        const session = sessionStorage.getItem("isAuthenticated") === "true";

        const userId = localStorage.getItem("userId")
            || sessionStorage.getItem("userId");

        if ((local || session) && userId) {
            router.push(`/movies/${userId}`);
        }
    }, []);

    if (loading) return <Loading />;

    return (
        <div className="flex flex-col justify-center h-full items-center">
            <h1>Sign in</h1>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-5 w-full md:w-[300px] mt-5"
            >
                {/* Email */}
                <input
                    type="email"
                    placeholder="Email"
                    {...register("email")}
                />
                {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}

                {/* Password */}
                <input
                    type="password"
                    placeholder="Password"
                    {...register("password")}
                />
                {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}

                {/* Remember Me */}
                <label className="flex items-center justify-center gap-2 cursor-pointer">
                    <input type="checkbox" {...register("remember")} />
                    <span>Remember me</span>
                </label>

                <button className="primary-button" type="submit">
                    Login
                </button>
            </form>
        </div>
    );
}
