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
import { signup } from "@/app/auth/actions"
import { Button } from "@/components/ui/button";
import Link from "next/link";

type InputData = {
    userName: string;
    email: string;
    password: string;
}

export default function UserRegisterPage() {
    const [input, setInput] = useState<InputData>({
        userName: "",
        email: "",
        password: "",
    });

    const handleChange = (key: keyof InputData, value: string) => {
        setInput((prev) => ({
            ...prev,
            [key]: value,
        }))
    };

    const handleSubmit = async () => {
        const userName = input.userName === "" ? "ゲスト" : input.userName;
        await signup(userName, input.email, input.password);
        console.log("user register successed");
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="font-bold text-2xl">User Register</h1>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Lumiアカウントの新規登録をしよ!!</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">user name</Label>
                                <Input
                                    value={input.userName}
                                    type="text"
                                    placeholder="ゲスト"
                                    onChange={(e) => handleChange("userName", e.target.value)}
                                />
                            </div>
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
                                <Link href="/login">ログインはこちら</Link>
                            </Label>
                            <Button type="submit">新規登録</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
