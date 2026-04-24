"use client"

import { useState } from "react";
import { signup } from "@/app/auth/actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

type InputData = {
    userName: string;
    email: string;
    password: string;
}

function GoogleIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    );
}

function SignUpForm() {
    const [input, setInput] = useState<InputData>({
        userName: "",
        email: "",
        password: "",
    });

    const handleChange = (key: keyof InputData, value: string) => {
        setInput((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userName = input.userName || "ゲスト";
        await signup(userName, input.email, input.password);
    };

    const inputClass =
        "h-auto bg-lumi-surface/90 border-lumi-primary/20 rounded-lg px-3.5 py-2.5 text-lumi-fg placeholder:text-lumi-muted/25 focus-visible:ring-0 focus-visible:border-lumi-primary/55";
    const labelClass =
        "text-[0.72rem] font-medium text-lumi-muted/55 uppercase tracking-[0.08em] mb-1.5";
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label className={labelClass}>ユーザー名</Label>
                <Input
                    type="text"
                    value={input.userName}
                    onChange={(e) => handleChange("userName", e.target.value)}
                    placeholder="lumi_user"
                    className={inputClass}
                />
            </div>
            <div>
                <Label className={labelClass}>メールアドレス</Label>
                <Input
                    type="email"
                    required
                    value={input.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="you@example.com"
                    className={inputClass}
                />
            </div>
            <div>
                <Label className={labelClass}>パスワード</Label>
                <Input
                    type="password"
                    required
                    value={input.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="8文字以上"
                    className={inputClass}
                />
            </div>
            <Button
                type="submit"
                className="w-full h-auto py-2.5 rounded-lg bg-lumi-primary text-lumi-base hover:bg-lumi-primary-hover active:scale-[0.98] transition-all"
            >
                Lumiをはじめる
            </Button>
        </form>
    );
}

export default function UserRegisterPage() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-lumi-sidebar p-8">
            <div className="flex w-full max-w-215 min-h-145 rounded-2xl overflow-hidden border border-lumi-primary/15">

                {/* 左カラム（ブランドエリア） */}
                <div className="flex-1 bg-lumi-base flex flex-col items-center justify-center p-8 border-r border-lumi-primary/15 relative overflow-hidden">
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: "radial-gradient(circle 150px at 50% 40%, rgba(122,162,247,0.08) 0%, transparent 100%)" }}
                    />
                    <div className="absolute w-45 h-45 rounded-full bg-lumi-primary/25 -bottom-15 -left-15 pointer-events-none" />
                    <div className="absolute w-45 h-45 rounded-full bg-lumi-secondary/25 top-8 -right-8 pointer-events-none" />

                    <Image alt="lumi-svg" src="/lumi-lv1.svg" width={100} height={100} />
                    <Label className="text-[2.8rem] font-bold text-lumi-fg tracking-tight relative z-10 leading-none">Lumi</Label>
                    <Label className="text-[0.85rem] text-lumi-muted/60 mt-2 uppercase tracking-widest relative z-10">あなただけの相棒</Label>
                    <span className="mt-4 inline-flex items-center gap-1 text-[0.68rem] px-3 py-1 rounded-full border border-lumi-secondary/30 text-lumi-secondary/80 bg-lumi-secondary/10 relative z-10">
                        ✦ 感情を持つAIペットと共に成長
                    </span>
                </div>

                {/* 右カラム（フォームエリア） */}
                <div className="flex-[1.2] bg-lumi-sidebar flex flex-col justify-center px-8 py-10">

                    <Button
                        type="button"
                        variant="outline"
                        disabled
                        className="w-full h-auto py-2.5 rounded-lg bg-lumi-surface/60 border-lumi-primary/20 text-lumi-muted/70 hover:bg-lumi-primary/6 hover:border-lumi-primary/45 hover:text-lumi-muted/70"
                    >
                        <GoogleIcon />
                        Googleで続ける
                    </Button>

                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-lumi-primary/15" />
                        <span className="text-[0.72rem] text-lumi-muted/35 tracking-[0.06em]">または</span>
                        <div className="flex-1 h-px bg-lumi-primary/15" />
                    </div>
                    <SignUpForm />
                    <p className="text-center text-[0.73rem] text-lumi-muted/35 leading-relaxed mt-6">
                        すでにアカウントをお持ちの方は{" "}
                        <Link href="/login" className="text-lumi-primary/65 hover:underline">
                            ログイン
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}


