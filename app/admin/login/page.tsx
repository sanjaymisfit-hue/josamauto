"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-5 pt-36 pb-24">
      <p className="eyebrow">Admin</p>
      <h1 className="font-display mt-4 text-4xl text-ivory">
        Sign <span className="text-gold">in</span>
      </h1>
      <form onSubmit={onSubmit} className="mt-8 border border-white/[0.06] bg-onyx p-8">
        <label className="label" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="field"
          autoComplete="email"
        />
        <label className="label mt-5" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="field"
          autoComplete="current-password"
        />
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        <button type="submit" disabled={loading} className="btn-gold mt-6 w-full">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
