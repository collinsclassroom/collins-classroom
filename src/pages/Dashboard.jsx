import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserGraduate,
  FaBookOpen,
  FaCalendarAlt,
  FaCreditCard,
  FaSignOutAlt,
  FaCheckCircle,
} from "react-icons/fa";
import MainLayout from "../layouts/MainLayout";
import { supabase } from "../lib/supabase";

export default function Dashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);

  const [receiptFile, setReceiptFile] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
const [uploading, setUploading] = useState(false);
const [payments, setPayments] = useState([]);
const [review, setReview] = useState("");
const [rating, setRating] = useState(5);
const [reviewStatus, setReviewStatus] = useState(null);
const [editingReview, setEditingReview] = useState(false);


  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      navigate("/login");
      return;
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (profileError) {
      console.error(profileError);
    } else {
      setProfile(profileData);
    }

    const { data: courseData, error: courseError } = await supabase
      .from("courses")
      .select("*")
      .order("id");

    if (courseError) {
      console.error(courseError);
    } else {
      setCourses(courseData || []);
    }

    const { data: selectedData } = await supabase
      .from("student_courses")
      .select("course_id")
      .eq("student_id", session.user.id);

    if (selectedData) {
      setSelectedCourses(
        selectedData.map((item) => item.course_id)
      );
    }

    const { data: paymentData } = await supabase
  .from("payments")
  .select("*")
  .eq("student_id", session.user.id)
  .order("created_at", { ascending: false });

setPayments(paymentData || []);

    setLoading(false);
  }

  const { data: reviewData } = await supabase
  .from("reviews")
  .select("*")
  .eq("student_id", session.user.id)
  .maybeSingle();

if (reviewData) {
  setReview(reviewData.comment || "");
  setRating(reviewData.rating || 5);
  setReviewStatus(reviewData.status);
}

  async function saveCourses() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("Logged in user:", session.user.id);

  if (!session) {
    alert("Please login again.");
    return;
  }

  if (selectedCourses.length === 0) {
    alert("Please select at least one course.");
    return;
  }

  console.log("selectedCourses =", selectedCourses);

  console.log("Selected courses:", selectedCourses);

  const rows = selectedCourses.map((courseId) => ({
    student_id: session.user.id,
    course_id: courseId,
    status: "Pending",
  }));

 const { data: deletedRows, error: deleteError } = await supabase
  .from("student_courses")
  .delete()
  .eq("student_id", session.user.id)
  .select();

console.log("Deleted rows:", deletedRows);

  if (deleteError) {
    alert(deleteError.message);
    return;
  }
console.log("Rows being inserted:", rows);

  const { data: insertedRows, error: insertError } = await supabase
  .from("student_courses")
  .insert(rows)
  .select();

console.log("Inserted rows:", insertedRows);
console.log("Insert error:", insertError);

if (insertError) {
  alert(JSON.stringify(insertError, null, 2));
  return;
}

  alert("Courses saved successfully.");

  await loadProfile();
}

  async function uploadReceipt() {
  if (!receiptFile) {
    alert("Please choose a payment receipt.");
    return;
  }

  if (!paymentAmount || Number(paymentAmount) <= 0) {
  alert("Please enter the amount you paid.");
  return;
}

  if (selectedCourses.length === 0) {
    alert("Please select a course first.");
    return;
  }

  setUploading(true);

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      alert("Please login again.");
      return;
    }

    const fileName = `${session.user.id}-${Date.now()}-${receiptFile.name}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
  .from("payment-receipts")
  .upload(fileName, receiptFile);

console.log("Upload Data:", uploadData);
console.log("Upload Error:", uploadError);

if (uploadError) {
  alert(JSON.stringify(uploadError, null, 2));
  return;
}

    const { data: publicUrlData } = supabase.storage
      .from("payment-receipts")
      .getPublicUrl(fileName);

    const amount = Number(paymentAmount);

    const { error: paymentError } = await supabase
      .from("payments")
      .insert({
        student_id: session.user.id,
        amount,
        receipt_url: publicUrlData.publicUrl,
        status: "Pending",
      });

    if (paymentError) throw paymentError;

    alert("Payment receipt submitted successfully.");

    setReceiptFile(null);
    setPaymentAmount("");
 } catch (error) {
    console.error(error);
    alert(JSON.stringify(error, null, 2));
} finally {
    setUploading(false);
}
}

async function submitReview() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return;

  console.log("Loading review...");

const { data: reviewData, error: reviewError } = await supabase
  .from("reviews")
  .select("*")
  .eq("student_id", session.user.id)
  .maybeSingle();

console.log(reviewData);
console.log(reviewError);

  if (data) {
    await supabase
      .from("reviews")
      .update({
        rating,
        comment: review,
        status: "Pending",
      })
      .eq("student_id", session.user.id);
  } else {
    await supabase
      .from("reviews")
      .insert({
        student_id: session.user.id,
        reviewer_name: profile.full_name,
        rating,
        comment: review,
        status: "Pending",
      });
  }

  alert("Review submitted successfully.");

  loadProfile();
}

function editReview() {
  setEditingReview(true);
}

    async function logout() {
    await supabase.auth.signOut();
    navigate("/");
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <h2 className="text-2xl font-bold">
            Loading Dashboard...
          </h2>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="bg-slate-100 min-h-screen py-12 px-6">

        <div className="max-w-7xl mx-auto">

          {/* Welcome */}

          <div className="bg-white rounded-3xl shadow-xl p-8 flex justify-between items-center">

            <div className="flex items-center gap-6">

              <div className="w-20 h-20 rounded-full bg-blue-700 text-white flex items-center justify-center text-3xl font-black">

                {profile?.avatar_url ? (

                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-20 h-20 rounded-full object-cover"
                  />

                ) : (

                  profile?.full_name?.charAt(0).toUpperCase()

                )}

              </div>

              <div>

                <h1 className="text-4xl font-black">
                  Welcome, {profile?.full_name}
                </h1>

                <p className="text-slate-600 mt-2">
                  {profile?.email}
                </p>

                <div className="flex items-center gap-2 mt-3 text-green-600 font-semibold">

                  <FaCheckCircle />

                  Verified Student

                </div>

              </div>

            </div>

            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl flex items-center gap-3 font-bold"
            >
              <FaSignOutAlt />
              Logout
            </button>

          </div>

          {/* Dashboard Cards */}

          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mt-12">

            {/* Courses */}

            <div className="bg-white rounded-2xl shadow-lg p-8">

              <FaBookOpen className="text-5xl text-blue-700" />

              <h2 className="font-black text-2xl mt-5">
                My Courses
              </h2>

              <p className="text-slate-500 mt-2 mb-6">
                Select the courses you want to study.
              </p>

              <div className="space-y-4">

                {courses.map((course) => (

                  <label
                    key={course.id}
                    className="flex items-center gap-3"
                  >

                   <input
  type="checkbox"
  checked={selectedCourses.includes(Number(course.id))}
  onChange={(e) => {
    const id = Number(course.id);

    if (e.target.checked) {
      setSelectedCourses((prev) => [...prev, id]);
    } else {
      setSelectedCourses((prev) =>
        prev.filter((courseId) => courseId !== id)
      );
    }
  }}
/>

                    <span>
                      {course.title}
                    </span>

                  </label>

                ))}

              </div>

              <button
                onClick={saveCourses}
                className="mt-6 w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-bold"
              >
                Save Courses
              </button>

            </div>

            {/* Lesson Request */}

            <div className="bg-white rounded-2xl shadow-lg p-8">

              <FaCalendarAlt className="text-5xl text-yellow-500" />

              <h2 className="font-black text-2xl mt-5">
                Lesson Requests
              </h2>

              <p className="text-slate-500 mt-2">
                Schedule your preferred class time.
              </p>

            </div>

            {/* Payments */}

<div className="bg-white rounded-2xl shadow-lg p-8">

  <FaCreditCard className="text-5xl text-green-600" />

  <h2 className="font-black text-2xl mt-5">
    Payments
  </h2>

  <p className="text-slate-500 mt-2 mb-6">
    Upload payment receipt for approval.
  </p>

<label className="block font-semibold mb-2">
  Amount Paid ($)
</label>

<input
  type="number"
  value={paymentAmount}
  onChange={(e) => setPaymentAmount(e.target.value)}
  placeholder="Example: 160"
  className="w-full border rounded-xl p-3 mb-5"
/>

{selectedCourses.length > 0 && (
  <p className="text-sm text-slate-500 mb-5">
    Recommended payment for{" "}
    <strong>
      {courses.find(
        (course) => course.id === selectedCourses[0]
      )?.title}
    </strong>
    :{" "}
    <strong className="text-blue-700">
      $
      {courses.find(
        (course) => course.id === selectedCourses[0]
      )?.price}
    </strong>
  </p>
)}

  <input
    type="file"
    accept="image/*,.pdf"
    onChange={(e) => setReceiptFile(e.target.files[0])}
    className="w-full border rounded-xl p-3"
  />

  {receiptFile && (
    <p className="text-green-600 mt-3 text-sm font-semibold">
      Selected: {receiptFile.name}
    </p>
  )}

  <button
    type="button"
    onClick={uploadReceipt}
    disabled={uploading}
    className="mt-6 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-bold"
  >
    {uploading ? "Uploading..." : "Submit Payment Receipt"}
  </button>

</div>

          </div>
                    {/* Student Information */}

          <div className="bg-white rounded-3xl shadow-xl p-8 mt-12">

            <h2 className="text-3xl font-black mb-8">
              Student Information
            </h2>

            <div className="grid md:grid-cols-2 gap-8">

              <div>
                <p className="text-slate-500">Full Name</p>
                <h3 className="font-bold text-xl">
                  {profile?.full_name}
                </h3>
              </div>

              <div>
                <p className="text-slate-500">Email</p>
                <h3 className="font-bold text-xl">
                  {profile?.email}
                </h3>
              </div>

              <div>
                <p className="text-slate-500">Role</p>
                <h3 className="font-bold text-xl capitalize">
                  {profile?.role}
                </h3>
              </div>

              <div>
                <p className="text-slate-500">Member Since</p>
                <h3 className="font-bold text-xl">
                  {new Date(profile?.created_at).toLocaleDateString()}
                </h3>
              </div>

            </div>

          </div>

<div className="bg-white rounded-3xl shadow-xl p-8 mt-12">

  <h2 className="text-3xl font-black mb-8">
    Payment History
  </h2>

  {payments.length === 0 ? (

    <p className="text-slate-500">
      You haven't submitted any payment receipts yet.
    </p>

  ) : (

    <div className="space-y-5">

      {payments.map((payment) => (

        <div
          key={payment.id}
          className="border rounded-2xl p-5 flex justify-between items-center"
        >

          <div>

            <h3 className="font-bold text-lg">
              Payment of ${payment.amount}
            </h3>

            <p className="text-slate-500 mt-1">
              Submitted on{" "}
              {new Date(payment.created_at).toLocaleString()}
            </p>

          </div>

          <div>

            {payment.status === "Approved" && (

              <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">
                ✅ Approved
              </span>

            )}

            {payment.status === "Pending" && (

              <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-bold">
                ⏳ Pending Approval
              </span>

            )}

            {payment.status === "Rejected" && (

              <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-bold">
                ❌ Rejected
              </span>

            )}

          </div>

        </div>

      ))}

    </div>

  )}

</div>

{/* Review */}

<div className="bg-white rounded-3xl shadow-xl p-8 mt-12">

  <h2 className="text-3xl font-black mb-8">
    My Review
  </h2>

  <label className="block font-semibold mb-2">
    Rating
  </label>

  <select
    value={rating}
    onChange={(e) => setRating(Number(e.target.value))}
    disabled={!editingReview && reviewStatus === "Approved"}
    className="w-full border rounded-xl p-3 mb-5"
  >
    <option value={5}>★★★★★</option>
    <option value={4}>★★★★☆</option>
    <option value={3}>★★★☆☆</option>
    <option value={2}>★★☆☆☆</option>
    <option value={1}>★☆☆☆☆</option>
  </select>

  <label className="block font-semibold mb-2">
    Review
  </label>

  <textarea
    rows={5}
    value={review}
    onChange={(e) => setReview(e.target.value)}
    disabled={!editingReview && reviewStatus === "Approved"}
    placeholder="Write your review here..."
    className="w-full border rounded-xl p-4"
  />

  <div className="mt-6">

    {reviewStatus === "Approved" && (
      <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">
        ✅ Approved
      </span>
    )}

    {reviewStatus === "Pending" && (
      <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-bold">
        ⏳ Pending Approval
      </span>
    )}

    {reviewStatus === "Rejected" && (
      <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-bold">
        ❌ Rejected
      </span>
    )}

  </div>

  <div className="flex gap-4 mt-8">

    <button
      type="button"
      onClick={editReview}
      className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-bold"
    >
      Edit
    </button>

    <button
      type="button"
      onClick={submitReview}
      className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-bold"
    >
      Send
    </button>

  </div>

</div>

          {/* Coming Soon */}

          <div className="bg-gradient-to-r from-blue-700 to-yellow-500 rounded-3xl text-white p-10 mt-12">

            <div className="flex items-center gap-5">

              <FaUserGraduate className="text-6xl" />

              <div>

                <h2 className="text-3xl font-black">
                  More Features Coming Soon
                </h2>

                <p className="mt-3 text-lg">
                  Lesson scheduling, payment tracking,
                  profile editing and teacher announcements
                  will appear here.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

    </MainLayout>

  );
}