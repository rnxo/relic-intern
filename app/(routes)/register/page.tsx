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
        <>
            <style>{`
                @keyframes lumi-drift-a {
                    from { transform: translate(0px,  0px)  scale(1);    }
                    to   { transform: translate(50px, 70px) scale(1.10); }
                }
                @keyframes lumi-drift-b {
                    from { transform: translate(0px,   0px)  scale(1);    }
                    to   { transform: translate(-60px,-45px) scale(1.12); }
                }
                @keyframes lumi-drift-c {
                    from { transform: translate(0px,  0px)  scale(1);    }
                    to   { transform: translate(35px,-55px) scale(1.08); }
                }
            `}</style>

            <div className="fixed inset-0 overflow-hidden flex items-center justify-center p-8">

                {/* ── 背景 1: ダークベース ── */}
                <div className="absolute inset-0" style={{
                    background: "radial-gradient(ellipse 160% 110% at 60% 115%, #07080f 0%, #0b0c1b 50%, #111224 100%)"
                }} />

                {/* ── 背景 2: ブルーネビュラ（左上） ── */}
                <div className="absolute rounded-full pointer-events-none" style={{
                    width: 700, height: 700, top: -250, left: -190,
                    background: "radial-gradient(circle, rgba(122,162,247,0.6) 0%, rgba(74,114,200,0.2) 42%, transparent 70%)",
                    filter: "blur(72px)",
                    opacity: 0.55,
                    animation: "lumi-drift-a 22s ease-in-out infinite alternate"
                }} />

                {/* ── 背景 3: パープルネビュラ（右下） ── */}
                <div className="absolute rounded-full pointer-events-none" style={{
                    width: 580, height: 580, bottom: -190, right: -150,
                    background: "radial-gradient(circle, rgba(187,154,247,0.55) 0%, rgba(139,92,246,0.16) 44%, transparent 70%)",
                    filter: "blur(82px)",
                    opacity: 0.52,
                    animation: "lumi-drift-b 26s ease-in-out infinite alternate"
                }} />

                {/* ── 背景 4: シアンアクセント（中央右） ── */}
                <div className="absolute rounded-full pointer-events-none" style={{
                    width: 400, height: 290, top: "38%", right: "12%",
                    background: "radial-gradient(circle, rgba(125,207,255,0.32) 0%, transparent 70%)",
                    filter: "blur(90px)",
                    opacity: 0.28,
                    animation: "lumi-drift-c 32s ease-in-out infinite alternate"
                }} />

                {/* ── 背景 5: グレインノイズ ── */}
                <div className="absolute inset-0 pointer-events-none" style={{
                    backgroundImage: "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/></filter><rect width='256' height='256' filter='url(%23n)' opacity='0.07'/></svg>\")",
                    backgroundSize: "256px 256px",
                    opacity: 0.45
                }} />

                {/* ── 背景 6: ビネット ── */}
                <div className="absolute inset-0 pointer-events-none" style={{
                    background: "radial-gradient(ellipse 82% 82% at 50% 50%, transparent 32%, rgba(4,5,13,0.82) 100%)"
                }} />

                {/* ── フロストガラスカード ── */}
                <div
                    className="relative z-10 flex w-full max-w-[860px] min-h-[580px] rounded-2xl overflow-hidden"
                    style={{
                        border: "0.5px solid rgba(122,162,247,0.18)",
                        boxShadow: [
                            "0 0 0 0.5px rgba(122,162,247,0.06)",
                            "0 40px 80px rgba(0,0,0,0.55)",
                            "0 0 140px rgba(122,162,247,0.06)",
                        ].join(", ")
                    }}
                >
                    {/* 左カラム（ブランドエリア） */}
                    <div
                        className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden backdrop-blur-2xl"
                        style={{
                            background: "rgba(26,27,38,0.62)",
                            borderRight: "0.5px solid rgba(122,162,247,0.12)"
                        }}
                    >
                        <div className="absolute inset-0 pointer-events-none" style={{
                            background: "radial-gradient(circle 160px at 50% 38%, rgba(122,162,247,0.07) 0%, transparent 100%)"
                        }} />
                        <div className="absolute w-[180px] h-[180px] rounded-full -bottom-[60px] -left-[60px] pointer-events-none" style={{
                            background: "rgba(122,162,247,0.14)", filter: "blur(40px)"
                        }} />
                        <div className="absolute w-[120px] h-[120px] rounded-full top-[30px] -right-[30px] pointer-events-none" style={{
                            background: "rgba(187,154,247,0.14)", filter: "blur(36px)"
                        }} />

                        <Image alt="lumi-svg" src="/lumi-lv1.svg" width={100} height={100} className="relative z-10" />
                        <Label className="text-[2.8rem] font-bold text-lumi-fg tracking-tight relative z-10 leading-none select-none">Lumi</Label>
                        <Label className="text-[0.85rem] text-lumi-muted/60 mt-2 uppercase tracking-widest relative z-10">あなただけの相棒</Label>
                        <span className="mt-4 inline-flex items-center gap-1 text-[0.68rem] px-3 py-1 rounded-full relative z-10" style={{
                            border: "0.5px solid rgba(187,154,247,0.3)",
                            color: "rgba(187,154,247,0.8)",
                            background: "rgba(187,154,247,0.08)"
                        }}>
                            ✦ 感情を持つAIペットと共に成長
                        </span>
                    </div>

                    {/* 右カラム（フォームエリア） */}
                    <div
                        className="flex-[1.2] flex flex-col justify-center px-8 py-10 backdrop-blur-2xl"
                        style={{ background: "rgba(18,19,28,0.78)" }}
                    >
                        <Button
                            type="button"
                            variant="outline"
                            disabled
                            className="w-full h-auto py-2.5 rounded-lg text-sm text-lumi-muted/70 hover:text-lumi-muted/70"
                            style={{
                                background: "rgba(255,255,255,0.03)",
                                border: "0.5px solid rgba(122,162,247,0.2)"
                            }}
                        >
                            <GoogleIcon />
                            Googleで続ける
                        </Button>

                        <div className="flex items-center gap-3 my-5">
                            <div className="flex-1 h-px" style={{ background: "rgba(122,162,247,0.14)" }} />
                            <span className="text-[0.72rem] tracking-[0.06em]" style={{ color: "rgba(169,177,214,0.32)" }}>
                                または
                            </span>
                            <div className="flex-1 h-px" style={{ background: "rgba(122,162,247,0.14)" }} />
                        </div>

                        <SignUpForm />

                        <p className="text-center text-[0.73rem] leading-relaxed mt-6" style={{ color: "rgba(169,177,214,0.35)" }}>
                            すでにアカウントをお持ちの方は{" "}
                            <Link
                                href="/login"
                                className="hover:underline transition-opacity hover:opacity-80"
                                style={{ color: "rgba(122,162,247,0.6)" }}
                            >
                                ログイン
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}


