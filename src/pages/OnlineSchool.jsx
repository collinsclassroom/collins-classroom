import { Helmet } from "react-helmet-async";
import MainLayout from "../layouts/MainLayout";

export default function OnlineSchool() {
  return (
    <>
      <Helmet>
        <title>Online School | Collins Classroom</title>
        <meta
          name="description"
          content="Collins Classroom Online School — Coming Soon."
        />
      </Helmet>

      <MainLayout>
        <section className="min-h-screen bg-white flex items-center justify-center px-6">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-black text-slate-900">
              Online School
            </h1>

            <p className="text-2xl font-bold text-yellow-500 mt-6">
              Coming Soon
            </p>

            <p className="text-slate-600 mt-4 max-w-xl mx-auto">
              Our online school program for students from Grade 3 to SS3
              is currently being prepared.
            </p>
          </div>
        </section>
      </MainLayout>
    </>
  );
}