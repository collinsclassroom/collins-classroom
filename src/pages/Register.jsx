import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { supabase } from "../lib/supabase";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserPlus,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

export default function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const passwordStrong = Object.values(checks).every(Boolean);

  async function handleRegister(e) {
    e.preventDefault();

    if (!passwordStrong) {
      alert("Please create a stronger password.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      full_name: fullName,
    },
  },
});

console.log("SIGNUP RESULT", { data, error });

setLoading(false);

if (error) {
  alert(error.message);
  return;
}

if (!data.user) {
  alert("No user was created. Please try again.");
  return;
}

alert("Account created successfully. Please check your email to verify your account.");
navigate("/login");
  }
  const Rule = ({ ok, text }) => (
    <div className="flex items-center gap-2 text-sm">
      {ok ? (
        <FaCheckCircle className="text-green-600" />
      ) : (
        <FaTimesCircle className="text-red-500" />
      )}
      <span className={ok ? "text-green-700" : "text-slate-600"}>
        {text}
      </span>
    </div>
  );

  return (
    <MainLayout>
      <section className="min-h-[85vh] bg-slate-100 flex items-center justify-center py-20 px-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10">

          <div className="text-center mb-10">
            <h1 className="text-4xl font-black">
              Create Account
            </h1>

            <p className="text-slate-500 mt-3">
              Join Collins Classroom and start learning today.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">

            <div>
              <label className="block font-semibold mb-2">
                Full Name
              </label>

              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>

                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e)=>setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full border rounded-xl py-4 pl-12 pr-4"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Email Address
              </label>

              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full border rounded-xl py-4 pl-12 pr-4"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Password
              </label>

              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>

                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full border rounded-xl py-4 pl-12 pr-12"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="mt-4 space-y-2">
                <Rule ok={checks.length} text="At least 8 characters" />
                <Rule ok={checks.upper} text="One uppercase letter (A-Z)" />
                <Rule ok={checks.lower} text="One lowercase letter (a-z)" />
                <Rule ok={checks.number} text="One number (0-9)" />
                <Rule ok={checks.symbol} text="One special character (!@#$...)" />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Confirm Password
              </label>

              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>

                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e)=>setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full border rounded-xl py-4 pl-12 pr-12"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-700 to-yellow-500 text-white py-4 rounded-xl font-bold text-lg"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

          <div className="mt-8 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-blue-700 hover:underline"
            >
              Sign In
            </Link>
          </div>

        </div>
      </section>
    </MainLayout>
  );
}