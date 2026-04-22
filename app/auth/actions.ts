'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/server'

export async function login(email: string, password: string) {
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        redirect('/login?error=' + encodeURIComponent(error.message))
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard');
}

export async function signup(userName: string, email: string, password: string) {
    const supabase = await createClient()

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {data: {user_name: userName}}
    })

    if (error) {
        redirect('/register?error=' + encodeURIComponent(error.message))
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/')
}
