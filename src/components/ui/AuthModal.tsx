"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import Modal from "./Modal";
import Input from "./Input";
import { useStore } from "@/store/useStore";

export default function AuthModal() {
  const isAuthOpen = useStore((s) => s.ui.isAuthOpen);
  const setAuthOpen = useStore((s) => s.ui.setAuthOpen);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      localStorage.setItem("auth_token", data.token);
      useStore.setState({ user: data.user });
      setAuthOpen(false);
      window.location.href = data.user.role === "ADMIN" ? "/admin" : "/dashboard";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: regName, email: regEmail, password: regPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      localStorage.setItem("auth_token", data.token);
      useStore.setState({ user: data.user });
      setAuthOpen(false);
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isAuthOpen}
      onClose={() => setAuthOpen(false)}
      title=""
    >
      {/* Tabs */}
      <div className="flex mb-8 bg-white/5 rounded-full p-1">
        {(["login", "register"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setError("");
            }}
            className={`flex-1 py-3 text-sm tracking-widest rounded-full transition-all duration-300 ${
              activeTab === tab
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            {tab === "login" ? "SIGN IN" : "REGISTER"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-6"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {activeTab === "login" ? (
          <motion.form
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleLogin}
            className="space-y-4"
          >
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              icon={<Mail size={16} />}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              icon={<Lock size={16} />}
            />
            <div className="flex justify-end">
              <button
                type="button"
                className="text-amber-400/60 text-xs hover:text-amber-400 transition-colors tracking-wider"
              >
                Forgot password?
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold py-4 rounded-full tracking-widest text-sm transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "SIGN IN"
              )}
            </button>
          </motion.form>
        ) : (
          <motion.form
            key="register"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleRegister}
            className="space-y-4"
          >
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              icon={<User size={16} />}
            />
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              icon={<Mail size={16} />}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              icon={<Lock size={16} />}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={regConfirmPassword}
              onChange={(e) => setRegConfirmPassword(e.target.value)}
              icon={<Lock size={16} />}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold py-4 rounded-full tracking-widest text-sm transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                "CREATE ACCOUNT"
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <p className="text-white/20 text-xs text-center mt-6 tracking-wider">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </Modal>
  );
}
