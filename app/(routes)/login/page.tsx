"use client"

import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { login } from "@/app/auth/actions"
import { Button } from "@/components/ui/button";
import Link from "next/link";

type InputData = {
    email: string;
    password: string;
}

export default function UserLoginPage() {
    const [input, setInput] = useState<InputData>({
        email: "",
        password: "",
    });

    const handleChange = (key: keyof InputData, value: string) => {
        setInput((prev) => ({
            ...prev,
            [key]: value,
        }))
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        await login(input.email, input.password);
        console.log("user login successed");
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="font-bold text-2xl">Login Page</h1>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Lumiアカウントのログインしよ!!</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        value={input.email}
                                        type="email"
                                        placeholder="my-email@example.com"
                                        required
                                        onChange={(e) => handleChange("email", e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">password</Label>
                                    <Input
                                        value={input.password}
                                        type="password"
                                        placeholder="********"
                                        required
                                        onChange={(e) => handleChange("password", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between mt-8">
                            <Label className="font-bold underline">
                                <Link href="/register">登録はこちら</Link>
                            </Label>
                            <Button type="submit">ログイン</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
