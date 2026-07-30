import Link from 'next/link';

//有効期限が切れたときのエラーページ
export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-lumi-base p-4">
      <div
        className="w-full max-w-sm rounded-2xl bg-lumi-surface px-8 py-10 text-center"
        style={{ border: '1px solid var(--lumi-border)' }}
      >
        <span
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full text-2xl"
          style={{
            background: 'color-mix(in srgb, #ef4444 12%, transparent)',
            color: 'color-mix(in srgb, #ef4444 88%, white)',
          }}
          aria-hidden="true"
        >
          ⚠
        </span>
        <h1 className="text-lg font-bold text-lumi-fg">リンクの有効期限が切れています</h1>
        <p className="mt-2 text-sm text-lumi-muted">
          このリンクはすでに使用されたか、有効期限が切れています。お手数ですが、もう一度パスワードリセットをリクエストしてください。
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Link
            href="/send-reset-password-email"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-lumi-base transition-all duration-200 active:scale-[0.98]"
            style={{
              background:
                'linear-gradient(135deg, var(--lumi-primary) 0%, var(--lumi-secondary) 55%, var(--lumi-primary-hover) 100%)',
            }}
          >
            もう一度リクエストする
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-lumi-border/50 px-4 py-2.5 text-sm text-lumi-muted transition-colors duration-200 hover:text-lumi-fg"
          >
            ログインページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
