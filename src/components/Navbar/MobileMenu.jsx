import { Link } from "react-router-dom";

export default function MobileMenu({
  mobileOpen,
  setMobileOpen,
  session,
}) {
  if (!mobileOpen) return null;

  return (
    <div className="lg:hidden bg-white shadow-xl border-t animate-fade-in">

      <nav className="flex flex-col py-3">

        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="px-6 py-4 text-lg font-semibold hover:bg-gray-100 transition"
        >
          Home
        </Link>

        <Link
          to="/about"
          onClick={() => setMobileOpen(false)}
          className="px-6 py-4 text-lg font-semibold hover:bg-gray-100 transition"
        >
          About
        </Link>

        <Link
          to="/courses"
          onClick={() => setMobileOpen(false)}
          className="px-6 py-4 text-lg font-semibold hover:bg-gray-100 transition"
        >
          Courses
        </Link>

        <div className="border-t mt-2 pt-4 px-6 pb-5">

          {!session ? (

            <Link
              to="/register"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center bg-gradient-to-r from-blue-700 to-yellow-500 text-white py-3 rounded-xl font-bold"
            >
              Register
            </Link>

          ) : (

            <Link
              to="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center bg-gradient-to-r from-blue-700 to-yellow-500 text-white py-3 rounded-xl font-bold"
            >
              My Dashboard
            </Link>

          )}

        </div>

      </nav>

    </div>
  );
}