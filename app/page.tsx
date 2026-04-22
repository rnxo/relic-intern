import { createClient } from '@/app/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/register')

    return <div>ようこそ、{user.user_metadata.name}さん</div>
}
