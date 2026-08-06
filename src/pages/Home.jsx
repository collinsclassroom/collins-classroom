import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import siteConfig from "../config/siteConfig";
import { supabase } from "../lib/supabase";
import {
  FaWhatsapp,
  FaPlayCircle,
  FaStar
} from "react-icons/fa";

export default function Home() {

  const [reviews, setReviews] = useState([]);
const [visibleReviews, setVisibleReviews] = useState([]);
const [averageRating, setAverageRating] = useState(5);
const [heroImage, setHeroImage] = useState(siteConfig.heroImage);
const [academyTeam, setAcademyTeam] = useState([]);
const [expandedFounder, setExpandedFounder] = useState(false);
const [expandedDirector, setExpandedDirector] = useState(false);
const [expandedTeacher, setExpandedTeacher] = useState(null);

useEffect(() => {
  loadReviews();
  loadAcademyTeam();
  loadHeroImage();
}, []);

async function loadReviews() {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("status", "Approved")
    .order("created_at", { ascending: false });

  console.log("Reviews:", data);
  console.log("Error:", error);

  if (error) {
    alert(error.message);
    console.error(error);
    return;
  }

  setReviews(data || []);
  setVisibleReviews((data || []).slice(0, 10));

  if (data.length > 0) {
    const avg =
      data.reduce((sum, item) => sum + item.rating, 0) /
      data.length;

    setAverageRating(avg.toFixed(1));
  }
}

async function loadHeroImage() {
  const { data, error } = await supabase
    .from("media")
    .select("file_url")
    .eq("media_key", "home_hero")
    .single();

  if (!error && data?.file_url) {
    setHeroImage(data.file_url);
  }
}

useEffect(() => {
  if (reviews.length <= 10) return;

  const interval = setInterval(() => {
    setVisibleReviews((current) => {
      // Reviews that are NOT currently visible
      const hiddenReviews = reviews.filter(
        (review) =>
          !current.some((visible) => visible.id === review.id)
      );

      if (hiddenReviews.length === 0) return current;

      // Pick one hidden review
      const nextReview =
        hiddenReviews[
          Math.floor(Math.random() * hiddenReviews.length)
        ];

      // Replace one random visible review
      const replaceIndex = Math.floor(
        Math.random() * current.length
      );

      const updated = [...current];
      updated[replaceIndex] = nextReview;

      return updated;
    });
  }, 6000);

  return () => clearInterval(interval);
}, [reviews]);

async function loadAcademyTeam() {
  const { data, error } = await supabase
    .from("academy_team")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  setAcademyTeam(data || []);
}

const founder = academyTeam.find(
  member => member.role === "founder"
);

const managingDirector = academyTeam.find(
  member => member.role === "managing_director"
);

const teachers = academyTeam.filter(
  member => member.role === "teacher"
);

return (

    <>
  <Helmet>
  <title>Learn English in Kazakhstan & Online | Collins Classroom</title>

  <meta
    name="description"
    content="Learn English with Collins Classroom. Professional English courses in Kazakhstan and online, including IELTS preparation, Business English, grammar, speaking, and conversational English."
  />

  <meta
    name="keywords"
    content="English classes Kazakhstan, English tutor Astana, Learn English online, IELTS preparation Kazakhstan, Business English, Collins Classroom"
  />

  <link rel="canonical" href="https://collinsclassroom.online/" />

  {/* Open Graph (Facebook, WhatsApp, LinkedIn) */}
  <meta property="og:title" content="Collins Classroom" />
  <meta
    property="og:description"
    content="Professional English lessons in Kazakhstan and online."
  />
  <meta
    property="og:image"
    content="https://collinsclassroom.online/logo/social-banner.jpg"
  />
  <meta property="og:url" content="https://collinsclassroom.online/" />
  <meta property="og:type" content="website" />

  {/* Twitter/X */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Collins Classroom" />
  <meta
    name="twitter:description"
    content="Professional English lessons in Kazakhstan and online."
  />
  <meta
    name="twitter:image"
    content="https://collinsclassroom.online/logo/social-banner.jpg"
  />
</Helmet>
  
    <MainLayout>
      <section className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white min-h-[90vh] flex items-center">

        <div className="max-w-7xl mx-auto px-6 py-20 w-full">

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* LEFT */}

            <div>

              <p className="text-yellow-400 font-bold tracking-[0.35em] uppercase">
                Teaching English Since 2019
              </p>

              <h1 className="text-5xl lg:text-7xl font-black leading-tight mt-6">
                Learn English
                <br />
                With Confidence.
              </h1>

              <p className="mt-8 text-xl leading-9 text-slate-300 max-w-xl">
                Professional English lessons for children,
                teenagers and adults. Learn confidently with
                practical speaking, grammar, pronunciation and
                real-life communication.
              </p>

              <div className="flex flex-wrap gap-5 mt-10">

                <a
                  href={`https://wa.me/${siteConfig.whatsapp.replace("+", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-yellow-400 text-black px-8 py-4 rounded-xl font-bold hover:scale-105 duration-300 shadow-xl"
                >
                  <FaWhatsapp />
                  Book Free Trial
                </a>

                <a
                  href={siteConfig.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 border border-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-black duration-300"
                >
                  <FaPlayCircle />
                  Watch Introduction
                </a>

              </div>

              <div className="grid grid-cols-3 gap-8 mt-16">

                <div>
                  <h2 className="text-4xl font-black text-yellow-400">6+</h2>
                  <p className="text-slate-300 mt-2">Years Teaching</p>
                </div>

                <div>
                  <h2 className="text-4xl font-black text-yellow-400">1000+</h2>
                  <p className="text-slate-300 mt-2">Lessons</p>
                </div>

                <div>
                  <h2 className="text-4xl font-black text-yellow-400">5★</h2>
                  <p className="text-slate-300 mt-2">Student Rating</p>
                </div>

              </div>

            </div>

            {/* RIGHT */}

            <div className="flex justify-center">

              <div className="w-[450px] h-[620px] rounded-3xl overflow-hidden shadow-2xl border-4 border-yellow-400 bg-white">

                <img
                  src={heroImage}
                  alt="Collins Classroom"
                  className="w-full h-full object-cover object-top"
                />

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================= EXECUTIVE LEADERSHIP ================= */}

<section className="bg-white py-20">

  <div className="max-w-7xl mx-auto px-6">

    <h2 className="text-4xl font-black text-center mb-14">
      Meet Our Leadership
    </h2>

    <div className="grid lg:grid-cols-2 gap-10">

      {/* Founder */}

      {founder && (

        <div className="bg-slate-50 rounded-3xl shadow-xl overflow-hidden">

          <img
  src={founder.photo_url}
  alt={founder.name}
  className="w-full h-80 object-contain bg-gray-100"
/>

            <div className="p-4">

  <p className="uppercase tracking-[0.3em] text-yellow-500 font-bold">
    Founder
  </p>

  <h3 className="text-3xl font-black mt-3">
    {founder.name}
  </h3>

            <div className="mt-6 space-y-3">

              <p>✔ {founder.qualification}</p>

              <p>✔ {founder.experience}</p>

              <p>✔ {founder.specialization}</p>

            </div>

            <h4 className="font-bold text-lg mt-8 mb-3">
  Biography
</h4>

<p
  className={`leading-8 text-slate-700 ${
    expandedFounder ? "" : "line-clamp-5"
  }`}
>
  {founder.biography}
</p>

<button
  onClick={() =>
    setExpandedFounder(!expandedFounder)
  }
  className="mt-4 text-blue-600 font-semibold hover:underline"
>
  {expandedFounder ? "Read Less" : "Read More"}
</button>

          </div>

        </div>

      )}

      {/* Managing Director */}

      {managingDirector && (

        <div className="bg-slate-50 rounded-3xl shadow-xl overflow-hidden">

          <img
            src={managingDirector.photo_url}
            alt={managingDirector.name}
            className="w-full h-30 object-cover"
          />

          <div className="p-4">

  <p className="uppercase tracking-[0.3em] text-blue-600">
    Managing Director
  </p>

            <h3 className="text-3xl font-black mt-3">
              {managingDirector.name}
            </h3>

            <div className="mt-6 space-y-3">

              <p>✔ {managingDirector.qualification}</p>

              <p>✔ {managingDirector.experience}</p>

              <p>✔ {managingDirector.specialization}</p>

            </div>

            <h4 className="font-bold text-lg mt-8 mb-3">
  Biography
</h4>

<p
  className={`leading-8 text-slate-700 ${
    expandedDirector ? "" : "line-clamp-5"
  }`}
>
  {managingDirector.biography}
</p>

<button
  onClick={() =>
    setExpandedDirector(!expandedDirector)
  }
  className="mt-4 text-blue-600 font-semibold hover:underline"
>
  {expandedDirector ? "Read Less" : "Read More"}
</button>

          </div>

        </div>

      )}

        </div>

  </div>

</section>

{/* ================= TEACHERS ================= */}

<section className="bg-slate-100 py-20">
  <div className="max-w-7xl mx-auto px-6">

    <h2 className="text-4xl font-black text-center">
      Our Lead Teachers
    </h2>

    <p className="text-center text-slate-600 mt-3 mb-14">
      Meet our experienced English language educators.
    </p>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

      {teachers.map((teacher) => (
        <div
          key={teacher.id}
          className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition"
        >

          <img
            src={teacher.photo_url}
            alt={teacher.name}
            className="w-full h-40 object-cover"
          />

          <div className="p-5">

            <h3 className="text-2xl font-bold">
              {teacher.name}
            </h3>

            <p className="text-blue-600 font-semibold mt-1">
              {teacher.position}
            </p>

            <div className="mt-4 space-y-2 text-slate-700">
              <p>✔ {teacher.qualification}</p>
              <p>✔ {teacher.experience}</p>
              <p>✔ {teacher.specialization}</p>
            </div>

            <p
              className={`mt-5 text-slate-600 leading-7 ${
                expandedTeacher === teacher.id
                  ? ""
                  : "line-clamp-3"
              }`}
            >
              {teacher.biography}
            </p>

            <button
              onClick={() =>
                setExpandedTeacher(
                  expandedTeacher === teacher.id
                    ? null
                    : teacher.id
                )
              }
              className="mt-4 text-blue-600 font-semibold hover:underline"
            >
              {expandedTeacher === teacher.id
                ? "Read Less"
                : "Read More"}
            </button>

          </div>

        </div>
      ))}

    </div>

  </div>
</section>


      {/* ================= REVIEWS ================= */}

<section className="bg-slate-100 py-20">

  <div className="max-w-7xl mx-auto px-6">

    <div className="text-center">

      <h2 className="text-4xl font-black">
        ⭐ Student Reviews
      </h2>

      <p className="text-2xl font-bold text-yellow-500 mt-4">
        {averageRating} / 5.0
      </p>

      <p className="text-slate-500 mt-2">
        Based on {reviews.length} verified student reviews
      </p>

    </div>

    <div className="grid lg:grid-cols-2 xl:grid-cols-2 gap-6 mt-14">

      {visibleReviews.map((review) => (

        <div
  key={review.id}
  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-700 flex flex-col justify-between"
>

          <div className="flex mb-4">

            {[1,2,3,4,5].map((star) => (

              <FaStar
                key={star}
                className={
                  star <= review.rating
                    ? "text-yellow-400"
                    : "text-gray-300"
                }
              />

            ))}

          </div>

          <p className="text-slate-700 leading-7 italic">

            "{review.comment}"

          </p>

          <div className="mt-6">

            <div className="mt-6">

  <h4 className="font-bold text-lg">
    {review.reviewer_name}
  </h4>

  <p className="text-green-600 font-semibold text-sm mt-1">
    ✔ Verified Student
  </p>

</div>

          </div>

        </div>

      ))}

    </div>

  </div>

</section>

    </MainLayout>
    </>
  );
}
