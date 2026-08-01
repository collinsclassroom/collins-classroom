import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaLock,
  FaSignOutAlt,
} from "react-icons/fa";

import { supabase } from "../../lib/supabase";
import siteConfig from "../../config/siteConfig";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [session, setSession] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navLinks = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "About",
      path: "/about",
    },
    {
      name: "Courses",
      path: "/courses",
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur shadow-sm">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}

          <Link
            to={isAdmin ? "/admin" : "/"}
            className="flex min-w-0 items-center gap-3"
          >
            <img
              src={siteConfig.logo}
              alt="Collins Classroom"
              className="h-11 w-11 flex-shrink-0 object-contain sm:h-12 sm:w-12 lg:h-14 lg:w-14"
            />

            <div className="min-w-0">
              <h1 className="truncate text-lg font-extrabold text-slate-900 sm:text-xl lg:text-2xl">
                Collins Classroom
              </h1>

              <p className="hidden text-sm font-medium text-yellow-600 md:block">
                Learn • Speak • Succeed
              </p>
            </div>
          </Link>

          {isAdmin ? (
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2 font-semibold text-white transition hover:bg-blue-800">
                <FaLock />
                <span className="hidden sm:inline">Lock</span>
              </button>

              <button className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700">
                <FaSignOutAlt />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <>
              {/* Desktop / Tablet Navigation */}

              <nav className="hidden items-center gap-8 lg:flex">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`font-semibold transition-colors ${
                      location.pathname === link.path
                        ? "text-blue-700"
                        : "text-slate-700 hover:text-blue-700"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              {/* Right Actions */}

              <div className="flex items-center gap-3">
                <div className="hidden md:block">
                  {session ? (
                    <Link
                      to="/dashboard"
                      className="rounded-xl bg-gradient-to-r from-blue-700 to-yellow-500 px-5 py-3 font-bold text-white shadow-md transition hover:scale-[1.02]"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/register"
                      className="rounded-xl bg-gradient-to-r from-blue-700 to-yellow-500 px-5 py-3 font-bold text-white shadow-md transition hover:scale-[1.02]"
                    >
                      Register
                    </Link>
                  )}
                </div>

                {/* Mobile Hamburger */}

                <button
                  type="button"
                  aria-label="Toggle menu"
                  aria-expanded={mobileOpen}
                  onClick={() => setMobileOpen((prev) => !prev)}
                  className="rounded-lg p-2 text-2xl text-slate-800 transition hover:bg-slate-100 lg:hidden"
                >
                  {mobileOpen ? <FaTimes /> : <FaBars />}
                </button>
              </div>
            </>
          )}
        </div>

        {!isAdmin && (
          <MobileMenu
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
            session={session}
          />
        )}
      </header>
    </>
  );
}