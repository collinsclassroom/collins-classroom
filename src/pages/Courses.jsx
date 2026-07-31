import { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { supabase } from "../lib/supabase";

export default function Courses() {
  const phone = "YOUR_WHATSAPP_NUMBER";

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("active", true)
      .order("id");

    if (error) {
      console.error(error);
      return;
    }

    setCourses(data || []);
  }

  return (
    <>
      <Navbar />

      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-16">
            <h1 className="text-5xl font-black text-slate-900 mb-4">
              English Courses
            </h1>

            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Professional online English lessons for children, teenagers and adults.
            </p>

            <div className="mt-8 inline-block bg-gradient-to-r from-blue-700 to-yellow-500 text-white px-10 py-5 rounded-2xl shadow-xl">
              <p className="uppercase tracking-widest text-sm">
                Lessons Starting From
              </p>

              <h2 className="text-4xl font-black mt-2">
                {courses.length > 0
                  ? `$${Math.min(...courses.map((c) => Number(c.price)))}`
                  : "$15"}
              </h2>

              <p className="mt-1">
  Per Lesson
</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">

            {courses.map((course) => (

              <div
                key={course.id}
                className="bg-white rounded-3xl shadow-xl p-8 hover:-translate-y-2 duration-300"
              >
                <div className="text-6xl mb-6">
  {course.icon || "📘"}
</div>

                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  {course.title}
                </h2>

                <p className="text-slate-600 leading-7 mb-8">
  {course.description}
</p>

                <div className="border-y py-6 mb-8">

                  <h3 className="text-4xl font-black text-blue-700">
                    ${course.price}
                  </h3>

                  <p className="text-slate-500 mt-2">
  Per Lesson
</p>

                </div>

                <a
                  href={`https://wa.me/${phone}?text=${encodeURIComponent(
                    `Hello Collins,

I'm interested in the ${course.title} course.

Please let me know your available schedule.

Thank you.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full text-center bg-gradient-to-r from-blue-700 to-yellow-500 text-white font-bold py-4 rounded-xl hover:scale-105 duration-300"
                >
                  Book on WhatsApp
                </a>

              </div>

            ))}

          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}