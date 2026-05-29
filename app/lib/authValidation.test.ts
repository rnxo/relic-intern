import { describe, it, expect } from "vitest";
import {
  validateLogin,
  validateSignup,
  hasErrors,
  translateAuthError,
  translateSignupError,
} from "./authValidation";

describe("validateLogin", () => {
  it("有効な入力ならエラーなし", () => {
    expect(validateLogin({ email: "you@example.com", password: "secret" })).toEqual({});
  });

  it("メール未入力でエラー", () => {
    expect(validateLogin({ email: "", password: "x" }).email).toBe(
      "メールアドレスを入力してください"
    );
  });

  it("空白のみのメールは未入力扱い", () => {
    expect(validateLogin({ email: "   ", password: "x" }).email).toBe(
      "メールアドレスを入力してください"
    );
  });

  it("形式が不正なメールでエラー", () => {
    expect(validateLogin({ email: "invalid", password: "x" }).email).toBe(
      "有効なメールアドレスを入力してください"
    );
  });

  it("パスワード未入力でエラー", () => {
    expect(validateLogin({ email: "you@example.com", password: "" }).password).toBe(
      "パスワードを入力してください"
    );
  });

  it("ログインは8文字未満でもパスワード長はチェックしない", () => {
    expect(validateLogin({ email: "you@example.com", password: "123" })).toEqual({});
  });
});

describe("validateSignup", () => {
  it("有効な入力ならエラーなし", () => {
    expect(validateSignup({ email: "you@example.com", password: "12345678" })).toEqual({});
  });

  it("パスワードが8文字未満でエラー", () => {
    expect(validateSignup({ email: "you@example.com", password: "1234567" }).password).toBe(
      "パスワードは8文字以上で入力してください"
    );
  });

  it("パスワード未入力は『入力してください』を優先", () => {
    expect(validateSignup({ email: "you@example.com", password: "" }).password).toBe(
      "パスワードを入力してください"
    );
  });

  it("ちょうど8文字はOK", () => {
    expect(validateSignup({ email: "you@example.com", password: "12345678" }).password).toBeUndefined();
  });
});

describe("hasErrors", () => {
  it("空オブジェクトはfalse", () => {
    expect(hasErrors({})).toBe(false);
  });

  it("キーがあればtrue", () => {
    expect(hasErrors({ email: "エラー" })).toBe(true);
  });
});

describe("translateAuthError", () => {
  it("既知のメッセージを日本語化", () => {
    expect(translateAuthError("Invalid login credentials")).toBe(
      "メールアドレスまたはパスワードが正しくありません"
    );
  });

  it("部分一致でも変換する", () => {
    expect(translateAuthError("Error: Too many requests, retry later")).toBe(
      "試行回数が多すぎます。しばらくお待ちください"
    );
  });

  it("未知のメッセージはそのまま返す", () => {
    expect(translateAuthError("some unknown error")).toBe("some unknown error");
  });
});

describe("translateSignupError", () => {
  it("登録済みメールを日本語化", () => {
    expect(translateSignupError("User already registered")).toBe(
      "このメールアドレスはすでに登録されています"
    );
  });

  it("Password should be at least 6 characters を変換", () => {
    expect(translateSignupError("Password should be at least 6 characters")).toBe(
      "パスワードは6文字以上で入力してください"
    );
  });

  it("未知のメッセージはそのまま返す", () => {
    expect(translateSignupError("unexpected")).toBe("unexpected");
  });
});
