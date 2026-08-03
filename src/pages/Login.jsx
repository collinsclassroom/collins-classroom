import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { supabase } from "../lib/supabase";
import { FaEnvelope, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
const [showPassword, setShowPassword] = useState(false);


  async function handleLogin(e) {
    e.preventDefault();

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/dashboard");
  }

  return (
    <MainLayout>
      <section className="min-h-[85vh] bg-slate-100 flex items-center justify-center py-20 px-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10">

          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-slate-900">
              Student Login
            </h1>

            <p className="text-slate-500 mt-3">
              Sign in to access your classroom.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">

            <div>
              <label className="block font-semibold mb-2">
                Email Address
              </label>

              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full border border-slate-300 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
  <label className="block font-semibold mb-2">
    Password
  </label>

  <div className="relative">
    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

    <input
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Enter your password"
      required
      className="w-full border border-slate-300 rounded-xl py-4 pl-12 pr-12 outline-none focus:border-blue-600"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
    >
      {showPassword ? <FaEyeSlash /> : <FaEye />}
    </button>
  </div>
</div>

            <div className="flex justify-between items-center text-sm">

              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Remember Me
              </label>

              <button
                type="button"
                className="text-blue-700 font-semibold hover:underline"
              >
                Forgot Password?
              </button>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-700 to-yellow-500 text-white py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-3 hover:scale-105 transition duration-300 disabled:opacity-60"
            >
              <FaSignInAlt />
              {loading ? "Signing In..." : "Sign In"}
            </button>

          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-600">
              Don't have an account?
            </p>

            <Link
              to="/register"
              className="font-bold text-blue-700 hover:underline"
            >
              Create an Account
            </Link>
          </div>

        </div>
      </section>
    </MainLayout>
  );
}