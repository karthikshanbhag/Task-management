"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader } from "lucide-react";

const LoginPage = () => {
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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      
      if (res.ok) {
        const data: any = await res.json()
        console.log("Login successful! Redirecting...");
        router.push("/tasks");
      } else {
        console.log("Login failed. Status:", res.status);
        setLoading(false)
        try {
          const data = await res.json();
          setError(data.error || "Login failed.");
        } catch (jsonError) {
          setError("Login failed. Invalid response from server.");
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl mb-4">Login</h2>
        <input
          disabled={loading}
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-2 p-2 border w-full"
          required
        />
        <input
          disabled={loading}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-2 p-2 border w-full"
          required
        />
        <button
          disabled={loading}
          type="submit"
          className="bg-blue-500 text-white p-2 w-full rounded flex justify-center"
        >
          {loading ?  <Loader className="animate-spin"/> : "Login"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
      <p className="text-center mt-4">
        Don't have an account?{" "}
        <Link href="/signup" className="text-blue-500 hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
