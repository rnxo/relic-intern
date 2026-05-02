import { createBrowserClient } from "@supabase/ssr";

//環境変数の読み込み失敗時の型エラーを回避するために「!」を使用
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

//supabaseクライアントの作成
export const createClient = () => createBrowserClient(supabaseUrl, supabaseKey);