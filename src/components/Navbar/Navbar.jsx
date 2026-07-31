import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaLock, FaSignOutAlt } from "react-icons/fa";

import { supabase } from "../../lib/supabase";
import siteConfig from "../../config/siteConfig";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [session, setSession] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

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
    <>
      <header className="sticky top-0 z-50 bg-white shadow-lg">

        <div className="max-w-7xl mx-auto px-4 lg:px-8">

          <div className="flex items-center justify-between h-20">

            {/* Logo */}

            <Link
              to={isAdmin ? "/admin" : "/"}
              className="flex items-center gap-3"
            >

              <img
                src={siteConfig.logo}
                alt="Collins Classroom"
                className="w-12 h-12 lg:w-16 lg:h-16 object-contain"
              />

              <div>

                <h1 className="text-xl lg:text-3xl font-extrabold text-slate-900">
                  Collins Classroom
                </h1>

                <p className="hidden sm:block text-sm text-yellow-600 font-semibold">
                  Learn • Speak • Succeed
                </p>

              </div>

            </Link>

            {isAdmin ? (

              <div className="flex gap-3">

                <button className="flex items-center gap-2 bg-blue-700 text-white px-5 py-2 rounded-xl">

                  <FaLock />

                  Lock

                </button>

                <button className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-xl">

                  <FaSignOutAlt />

                  Sign Out

                </button>

              </div>

            ) : (

              <>

                {/* Desktop Navigation */}

                <nav className="hidden lg:flex items-center gap-10 ml-auto">

                  <Link
                    to="/"
                    className="font-semibold hover:text-blue-700"
                  >
                    Home
                  </Link>

                  <Link
                    to="/about"
                    className="font-semibold hover:text-blue-700"
                  >
                    About
                  </Link>

                  <Link
                    to="/courses"
                    className="font-semibold hover:text-blue-700"
                  >
                    Courses
                  </Link>

                </nav>

                {/* Desktop Button */}

                <div className="hidden lg:block ml-8">

                  {!session ? (

                    <Link
                      to="/register"
                      className="bg-gradient-to-r from-blue-700 to-yellow-500 text-white px-6 py-3 rounded-xl font-bold shadow"
                    >
                      Register
                    </Link>

                  ) : (

                    <Link
                      to="/dashboard"
                      className="bg-gradient-to-r from-blue-700 to-yellow-500 text-white px-6 py-3 rounded-xl font-bold shadow"
                    >
                      My Dashboard
                    </Link>

                  )}

                </div>

                {/* Mobile Hamburger */}

                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="lg:hidden text-2xl text-slate-800"
                >

                  {mobileOpen ? <FaTimes /> : <FaBars />}

                </button>

              </>

            )}

          </div>

        </div>

      </header>

      {!isAdmin && (

        <MobileMenu
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          session={session}
        />

      )}

    </>
  );
}