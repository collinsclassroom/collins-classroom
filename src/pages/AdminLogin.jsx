import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { supabase } from "../lib/supabase";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e) {
  e.preventDefault();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert(error.message);
    return;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .single();

  if (profileError) {
    alert("Admin profile not found.");
    return;
  }

  if (profile.role !== "Admin") {
    alert("You are not an administrator.");
    await supabase.auth.signOut();
    return;
  }

  if (profile.status !== "Active") {
    alert("Admin account is not active.");
    await supabase.auth.signOut();
    return;
  }

  navigate("/admin");
}

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-xl shadow-xl w-[400px]"
      >
        <h1 className="text-3xl font-bold mb-6">
          Admin Login
        </h1>

        <input
          type="email"
          placeholder="Admin Email"
          className="w-full border p-3 mb-4 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative mb-6">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    className="w-full border p-3 pr-12 rounded"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </button>
</div>

        <button
          className="w-full bg-blue-700 text-white p-3 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}