import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import siteConfig from "../config/siteConfig";
import { supabase } from "../lib/supabase";

import {
  FaGraduationCap,
  FaCertificate,
  FaChalkboardTeacher,
  FaPlayCircle,
} from "react-icons/fa";

export default function About() {

  const [aboutImage, setAboutImage] = useState(siteConfig.aboutImage);
const [introductionVideo, setIntroductionVideo] = useState(null);
const [media, setMedia] = useState({});

useEffect(() => {
  loadAboutImage();
  loadIntroductionVideo();
  loadGalleryMedia();
}, []);

async function loadAboutImage() {
  const { data } = await supabase
    .from("media")
    .select("file_url")
    .eq("media_key", "about_image")
    .single();

  if (data?.file_url) {
    setAboutImage(data.file_url);
  }
}

async function loadIntroductionVideo() {
  const { data } = await supabase
    .from("media")
    .select("file_url")
    .eq("media_key", "introduction_video")
    .single();

  if (data?.file_url) {
    setIntroductionVideo(data.file_url);
  }
}

async function loadGalleryMedia() {
  const { data, error } = await supabase
    .from("media")
    .select("*");

  if (error) {
    console.error(error);
    return;
  }

  const obj = {};

  (data || []).forEach((item) => {
    obj[item.media_key] = item;
  });

  setMedia(obj);
}

  return (
    <>
  <Helmet>
    <title>About Collins Classroom | Professional English Learning</title>

    <meta
      name="description"
      content="Learn about Collins Classroom, our mission, teaching experience, and commitment to helping students in Kazakhstan and around the world speak English confidently."
    />

    <meta
      name="keywords"
      content="About Collins Classroom, English teacher Kazakhstan, English education, Learn English Astana"
    />

    <link
      rel="canonical"
      href="https://collinsclassroom.online/about"
    />
  </Helmet>

    <MainLayout>
      {/* HERO */}

      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* IMAGE */}

            <div className="flex justify-center">
              <div className="w-[430px] h-[560px] rounded-3xl overflow-hidden border-4 border-yellow-400 shadow-2xl">

                <img
  src={aboutImage}
  alt="Collins"
  className="w-full h-full object-cover object-top"
/>

              </div>
            </div>

            {/* TEXT */}

            <div>

              <p className="uppercase tracking-[0.35em] text-blue-700 font-bold">
                ABOUT COLLINS
              </p>

              <h1 className="text-5xl font-black mt-5">
                Meet Your English Teacher
              </h1>

              <p className="mt-8 text-lg leading-9 text-slate-600">
                Hello! I'm Collins.

                I have been teaching English since 2019, helping children,
                teenagers and adults improve their speaking,
                pronunciation, grammar and confidence.

                My lessons are practical, interactive and enjoyable,
                designed to help students communicate naturally in
                everyday situations.
              </p>

              <div className="grid md:grid-cols-2 gap-5 mt-10">

                <div className="flex gap-4">

                  <FaGraduationCap className="text-3xl text-yellow-500 mt-1" />

                  <div>

                    <h3 className="font-bold">
                      Bachelor's Degree
                    </h3>

                    <p className="text-slate-500">
                      Media Technologies
                    </p>

                  </div>

                </div>

                <div className="flex gap-4">

                  <FaCertificate className="text-3xl text-yellow-500 mt-1" />

                  <div>

                    <h3 className="font-bold">
                      TESOL Certified
                    </h3>

                    <p className="text-slate-500">
                      English Language Teaching
                    </p>

                  </div>

                </div>

                <div className="flex gap-4">

                  <FaChalkboardTeacher className="text-3xl text-yellow-500 mt-1" />

                  <div>

                    <h3 className="font-bold">
                      Online English Teacher
                    </h3>

                    <p className="text-slate-500">
                      Children • Teens • Adults
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* CERTIFICATES */}

      <section className="bg-slate-100 py-20">

        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-4xl font-black text-center">
            Qualifications & Certificates
          </h2>

          <div className="grid md:grid-cols-3 gap-10 mt-14">

                      {/* Bachelor's Degree */}

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

              <div
                className="relative h-[420px] bg-slate-100 flex items-center justify-center p-4 overflow-hidden"
                onContextMenu={(e) => e.preventDefault()}
              >

                <img
                  src={siteConfig.certificates.bachelor}
                  alt="Bachelor Degree"
                  draggable={false}
                  className="max-w-full max-h-full object-contain select-none pointer-events-none"
                />

                {/* WATERMARK */}

                <div className="absolute inset-0 pointer-events-none">

                  <div className="absolute inset-0 flex items-center justify-center rotate-[-30deg]">

                    <div className="text-center">

                      <h2 className="text-5xl font-black tracking-[0.35em] text-slate-700/30">
                        COLLINS CLASSROOM
                      </h2>

                      <p className="text-xl font-bold tracking-[0.2em] mt-4 text-slate-700/30">
                        FOR VERIFICATION ONLY
                      </p>

                      <p className="mt-2 text-lg font-semibold text-slate-700/30">
                        www.collinsclassroom.online
                      </p>

                    </div>

                  </div>

                </div>

                {/* Blur Bottom */}

                <div className="absolute bottom-0 left-0 right-0 h-24 backdrop-blur-lg bg-white/20"></div>

              </div>

              <div className="p-6">

                <h3 className="text-2xl font-bold">
                  Bachelor's Degree
                </h3>

                <p className="text-slate-500 mt-2">
                  Media Technologies
                </p>

              </div>

            </div>

            {/* TESOL */}

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

              <div
                className="relative h-[420px] bg-slate-100 flex items-center justify-center p-4 overflow-hidden"
                onContextMenu={(e) => e.preventDefault()}
              >

                <img
                  src={siteConfig.certificates.tesol}
                  alt="TESOL Certificate"
                  draggable={false}
                  className="max-w-full max-h-full object-contain select-none pointer-events-none"
                />

                {/* WATERMARK */}

                <div className="absolute inset-0 pointer-events-none">

                  <div className="absolute inset-0 flex items-center justify-center rotate-[-30deg]">

                    <div className="text-center">

                      <h2 className="text-5xl font-black tracking-[0.35em] text-slate-700/30">
                        COLLINS CLASSROOM
                      </h2>

                      <p className="text-xl font-bold tracking-[0.2em] mt-4 text-slate-700/30">
                        FOR VERIFICATION ONLY
                      </p>

                      <p className="mt-2 text-lg font-semibold text-slate-700/30">
                        www.collinsclassroom.online
                      </p>

                    </div>

                  </div>

                </div>

                {/* Blur Bottom */}

                <div className="absolute bottom-0 left-0 right-0 h-24 backdrop-blur-lg bg-white/20"></div>

              </div>

              <div className="p-6">

                <h3 className="text-2xl font-bold">
                  TESOL Certificate
                </h3>

                <p className="text-slate-500 mt-2">
                  English Language Teaching
                </p>

              </div>

            </div>
                        {/* Cambridge */}

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

              <div className="h-[420px] bg-slate-100 flex flex-col items-center justify-center">

                <FaCertificate className="text-7xl text-slate-400 mb-6" />

                <h3 className="text-3xl font-black text-slate-600">
                  Coming Soon
                </h3>

                <p className="text-slate-500 mt-3">
                  Cambridge English Certification
                </p>

              </div>

              <div className="p-6">

                <h3 className="text-2xl font-bold">
                  Cambridge Certificate
                </h3>

                <p className="text-slate-500 mt-2">
                  Will be added soon
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* VIDEOS */}

<section className="bg-white py-20">

  <div className="max-w-7xl mx-auto px-6">

    <h2 className="text-4xl font-black text-center">
      Introduction
    </h2>

    {/* Introduction Video */}

<div
  id="introduction-video"
  className="mt-12 max-w-5xl mx-auto"
>

      {introductionVideo ? (

  <video
    controls
    className="w-full h-[420px] rounded-3xl object-cover shadow-xl"
    src={introductionVideo}
  />

) : (

  <div className="bg-slate-900 rounded-3xl h-[420px] flex flex-col items-center justify-center text-white shadow-xl">

    <FaPlayCircle className="text-8xl text-red-500" />

    <h3 className="text-3xl font-bold mt-6">
      Meet Collins
    </h3>

    <p className="text-slate-300 mt-2">
      60-Second Introduction Video
    </p>

  </div>

)}

    </div>

    {/* Student Testimonials */}

    <div className="mt-24">

      <h2 className="text-4xl font-black text-center mb-12">
        Student Testimonials
      </h2>

      <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-6">

        {[1,2,3,4,5].map((video) => {
  const item = media[`student_testimonial_${video}`];

  return item ? (
    <video
      key={video}
      controls
      className="w-full h-56 rounded-2xl object-contain bg-black shadow-lg"
      src={item.file_url}
    />
  ) : (
    <div
      key={video}
      className="bg-slate-900 rounded-2xl h-56 flex flex-col items-center justify-center text-white shadow-lg"
    >
      <FaPlayCircle className="text-6xl text-red-500" />

      <p className="mt-5 font-bold">
        Testimonial {video}
      </p>
    </div>
  );
})}

      </div>

    </div>

    {/* Classroom Highlights */}

    <div className="mt-24">

      <h2 className="text-4xl font-black text-center mb-12">
        Classroom Highlights
      </h2>

      <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-6">

        {[1,2,3,4,5].map((video) => {
  const item = media[`classroom_highlight_${video}`];

  return item ? (
    <video
      key={video}
      controls
      className="w-full h-56 rounded-2xl object-cover shadow-lg"
      src={item.file_url}
    />
  ) : (
    <div
      key={video}
      className="bg-slate-900 rounded-2xl h-56 flex flex-col items-center justify-center text-white shadow-lg"
    >
      <FaPlayCircle className="text-6xl text-red-500" />

      <p className="mt-5 font-bold">
        Classroom {video}
      </p>
    </div>
  );
})}

      </div>

    </div>

  </div>

</section>
          </MainLayout>
          </>
  );
}