"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader } from "lucide-react";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true)

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/login");
      } else {
        const data = await res.json();
        setLoading(false)
        setError(data.error || "Signup failed.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl mb-4">Sign Up</h2>
        <input
          type="text"
          placeholder="Username"
          disabled={loading}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-2 p-2 border w-full"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          disabled={loading}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-2 p-2 border w-full"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white p-2 w-full rounded flex justify-center"
        >
          {loading ?  <Loader className="animate-spin"/> : "Sign Up"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
      <p className="text-center mt-4">
        Already&apos;t have an account?{" "}
        <Link href="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default SignupPage;
