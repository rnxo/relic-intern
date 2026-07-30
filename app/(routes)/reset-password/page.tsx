import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/app/lib/supabase/server';
import UpdatePasswordContent from './_components/UpdatePasswordContent';

export default async function ResetPasswordUpdatePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/send-reset-password-email');
  }

  return (
    <Suspense>
      <UpdatePasswordContent />
    </Suspense>
  );
}
