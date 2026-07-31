import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import siteConfig from "../../config/siteConfig";
import { FaLock, FaSignOutAlt } from "react-icons/fa";

export default function Navbar() {
  const [session, setSession] = useState(null);

  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-8">

        <div className="flex items-center justify-between h-28">

          <Link
            to={isAdmin ? "/admin" : "/"}
            className="flex items-center gap-5"
          >
            <img
              src={siteConfig.logo}
              alt="Collins Classroom"
              className="w-20 h-20 object-contain"
            />

            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">
                Collins Classroom
              </h1>

              <p className="text-base text-yellow-600 font-semibold mt-2">
                Learn • Speak • Succeed
              </p>
            </div>
          </Link>

          {isAdmin ? (

            <div className="flex items-center gap-4">

              <button
                className="flex items-center gap-2 bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-800 transition"
              >
                <FaLock />
                Lock
              </button>

              <button
                className="flex items-center gap-2 bg-red-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-red-700 transition"
              >
                <FaSignOutAlt />
                Sign Out
              </button>

            </div>

          ) : (

            <>
              <nav className="hidden lg:flex items-center gap-10 ml-auto mr-12">

                <Link
                  to="/"
                  className="text-lg font-semibold text-slate-800 hover:text-blue-700"
                >
                  Home
                </Link>

                <Link
                  to="/about"
                  className="text-lg font-semibold text-slate-800 hover:text-blue-700"
                >
                  About
                </Link>

                <Link
                  to="/courses"
                  className="text-lg font-semibold text-slate-800 hover:text-blue-700"
                >
                  Courses
                </Link>

              </nav>

              {!session ? (

                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-700 to-yellow-500 text-white px-7 py-3 rounded-xl font-bold text-lg shadow-lg"
                >
                  Register
                </Link>

              ) : (

                <Link
                  to="/dashboard"
                  className="bg-gradient-to-r from-blue-700 to-yellow-500 text-white px-7 py-3 rounded-xl font-bold text-lg shadow-lg"
                >
                  My Dashboard
                </Link>

              )}
            </>

          )}

        </div>

      </div>
    </header>
  );
}