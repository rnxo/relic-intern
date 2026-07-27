import { Suspense } from 'react';
import ResetPasswordContent from './_components/ResetPasswordContent';

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}
