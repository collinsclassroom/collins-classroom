import React from "react";

const menuItems = [
  { id: "dashboard", label: "📊 Dashboard" },
  { id: "students", label: "👨‍🎓 Students" },
  { id: "payments", label: "💳 Payments" },
  { id: "courses", label: "📚 Courses" },
  { id: "media", label: "🖼 Media" },
];

export default function Sidebar({ active, setActive }) {
  return (
    <div className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">

      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold">
          Collins Classroom
        </h1>
        <p className="text-sm text-slate-400">
          Admin Panel
        </p>
      </div>

      <div className="flex-1 py-4">

        {menuItems.map((item) => (

          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`w-full text-left px-6 py-4 transition

            ${
              active === item.id
                ? "bg-blue-600"
                : "hover:bg-slate-800"
            }`}
          >
            {item.label}
          </button>

        ))}

      </div>

    </div>
  );
}