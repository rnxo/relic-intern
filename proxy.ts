import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server';

// 認証不要の公開ルート
const PUBLIC_PATHS = ['/', '/login', '/register', '/reset-password', '/send-reset-password-email'];

export async function proxy(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
        cookies: {
            getAll() {
                return request.cookies.getAll()
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value }) =>
                    request.cookies.set(name, value)
                )
                supabaseResponse = NextResponse.next({ request })
                cookiesToSet.forEach(({ name, value, options }) =>
                    supabaseResponse.cookies.set(name, value, options)
                )
            },
        },
    })

    const { data: { user } } = await supabase.auth.getUser();

    const isPublic = PUBLIC_PATHS.some(path =>
        request.nextUrl.pathname === path ||
        request.nextUrl.pathname.startsWith(path + '/')
    );

    // ① 未ログインユーザーを弾く
    if (!user && !isPublic) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url);
    }

    // ② ログイン済みユーザーがログイン・登録画面に来たらリダイレクト
    const { pathname } = request.nextUrl;
    if (user && (pathname === '/login' || pathname === '/register')) {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
    }

    // ③ /api/user/[userId] へのアクセス時にuserIdの一致を検証
    const apiUserMatch = pathname.match(/^\/api\/user\/([^/]+)/);
    if (apiUserMatch) {
        const requestedUserId = apiUserMatch[1];
        if (!user || user.id !== requestedUserId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        // api の除外を削除
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
        '/dashboard/:path*',
        '/calendar/:path*',
        '/register-habit/:path*',
        '/stats/:path*',
        '/api/:path*',
        '/mypage/:path*',
        '/habits/:path*',
        '/consultation-room/:path*',
    ],
}