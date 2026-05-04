import { Suspense } from "react";
import RegisterContent from "./_components/RegisterContent";

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterContent />
    </Suspense>
  );
}
