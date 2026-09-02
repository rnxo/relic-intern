export type LoginErrors = { email?: string; password?: string };
export type SignupErrors = { userName?: string; email?: string; password?: string };
export type UpdatePasswordErrors = { password?: string; confirmPassword?: string };

const EMAIL_RE = /\S+@\S+\.\S+/;

export function validateLogin(input: { email: string; password: string }): LoginErrors {
  const errors: LoginErrors = {};
  if (!input.email.trim()) {
    errors.email = "メールアドレスを入力してください";
  } else if (!EMAIL_RE.test(input.email)) {
    errors.email = "有効なメールアドレスを入力してください";
  }
  if (!input.password) {
    errors.password = "パスワードを入力してください";
  }
  return errors;
}

export function validateSignup(input: { email: string; password: string }): SignupErrors {
  const errors: SignupErrors = {};
  if (!input.email.trim()) {
    errors.email = "メールアドレスを入力してください";
  } else if (!EMAIL_RE.test(input.email)) {
    errors.email = "有効なメールアドレスを入力してください";
  }
  if (!input.password) {
    errors.password = "パスワードを入力してください";
  } else if (input.password.length < 8) {
    errors.password = "パスワードは8文字以上で入力してください";
  }
  return errors;
}

export function validateUpdatePassword(input: {
  password: string;
  confirmPassword: string;
}): UpdatePasswordErrors {
  const errors: UpdatePasswordErrors = {};
  if (!input.password) {
    errors.password = "新しいパスワードを入力してください";
  } else if (input.password.length < 8) {
    errors.password = "パスワードは8文字以上で入力してください";
  }
  if (!input.confirmPassword) {
    errors.confirmPassword = "確認のためもう一度入力してください";
  } else if (input.password && input.confirmPassword !== input.password) {
    errors.confirmPassword = "パスワードが一致しません";
  }
  return errors;
}

export function hasErrors(errors: Record<string, string | undefined>): boolean {
  return Object.keys(errors).length > 0;
}

const AUTH_ERROR_MAP: Record<string, string> = {
  "Invalid login credentials": "メールアドレスまたはパスワードが正しくありません",
  "Email not confirmed": "メールアドレスの確認が完了していません",
  "Too many requests": "試行回数が多すぎます。しばらくお待ちください",
  "User not found": "このメールアドレスは登録されていません",
  "Password should be at least": "パスワードは8文字以上で入力してください",
  "New password should be different from the old password":
    "新しいパスワードは現在のパスワードと異なるものにしてください",
};

const SIGNUP_ERROR_MAP: Record<string, string> = {
  "User already registered": "このメールアドレスはすでに登録されています",
  "Email already in use": "このメールアドレスはすでに使用されています",
  "Password should be at least": "パスワードは6文字以上で入力してください",
  "Unable to validate email address": "有効なメールアドレスを入力してください",
  "invalid format": "有効なメールアドレスを入力してください",
};

function translate(map: Record<string, string>, msg: string): string {
  for (const [key, ja] of Object.entries(map)) {
    if (msg.includes(key)) return ja;
  }
  return msg;
}

export function translateAuthError(msg: string): string {
  return translate(AUTH_ERROR_MAP, msg);
}

export function translateSignupError(msg: string): string {
  return translate(SIGNUP_ERROR_MAP, msg);
}
