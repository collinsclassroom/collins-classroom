import { useEffect, useState } from "react";
import Sidebar from "../components/admin/Sidebar";
import MainLayout from "../layouts/MainLayout";
import { supabase } from "../lib/supabase";
import AdminCourses from "../components/admin/AdminCourses";
import AdminMedia from "../components/admin/AdminMedia";

import {
  FaUsers,
  FaBookOpen,
  FaMoneyBillWave,
  FaCalendarAlt,
} from "react-icons/fa";

console.log("ADMIN COMPONENT LOADED");

export default function Admin() {
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);

  const [active, setActive] = useState(
  localStorage.getItem("adminTab") || "dashboard"
);

const [loading, setLoading] = useState(false);
const [processingPayment, setProcessingPayment] = useState(null);

const [editingStudent, setEditingStudent] = useState(null);

const [editName, setEditName] = useState("");
const [editEmail, setEditEmail] = useState("");

const [courses, setCourses] = useState([]);

const [reviewCount, setReviewCount] = useState(0);
const [revenue, setRevenue] = useState(0);
const [activeCourses, setActiveCourses] = useState(0);

const [editCourse, setEditCourse] = useState("");
const [editStatus, setEditStatus] = useState("");

  useEffect(() => {
  loadStudents();
  loadPayments();
  loadCourses();
  loadDashboardStats();
}, []);

useEffect(() => {
  localStorage.setItem("adminTab", active);
}, [active]);

async function approvePayment(id) {
  try {
    setProcessingPayment(id);

    const { data, error } = await supabase
      .from("payments")
      .update({ status: "Approved" })
      .eq("id", id)
      .select();

    console.log("Approve data:", data);
    console.log("Approve error:", error);

    if (error) {
      alert(error.message);
      return;
    }

    if (!data || data.length === 0) {
      alert("No payment was updated.");
      return;
    }

    await loadPayments();
    await loadDashboardStats();

    alert("Payment approved successfully.");
  } catch (err) {
    console.error(err);
    alert(err.message);
  } finally {
    setProcessingPayment(null);
  }
}

async function rejectPayment(id) {
  setProcessingPayment(id);

  const { error } = await supabase
    .from("payments")
    .update({
      status: "Rejected",
    })
    .eq("id", id);

  if (error) {
    alert(error.message);
    setProcessingPayment(null);
    return;
  }

  await loadPayments();
await loadDashboardStats();

  setProcessingPayment(null);
}

async function deletePayment(id) {
  if (!window.confirm("Delete this payment?")) return;

  try {
    setProcessingPayment(id);

    const { error } = await supabase
  .from("payments")
  .delete()
  .eq("id", id);

if (error) {
  alert(error.message);
  return;
}

alert("Payment deleted successfully.");

await loadPayments();
await loadDashboardStats();

    if (error) {
      alert(error.message);
      return;
    }

    setPayments((prev) => prev.filter((payment) => payment.id !== id));

    await loadPayments();
    await loadDashboardStats();

    alert("Payment deleted successfully.");
  } catch (err) {
    alert(err.message);
  } finally {
    setProcessingPayment(null);
  }
}


async function approveStudent(id) {
  const { error } = await supabase
    .from("profiles")
    .update({
      status: "Active",
    })
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  await loadStudents();

  alert("Student approved successfully.");
}

function openEditStudent(student) {
  setEditingStudent(student);

  setEditName(student.full_name || "");
  setEditEmail(student.email || "");

 setEditCourse(
  student.student_courses?.[0]?.course_id?.toString() || ""
);
setEditStatus(student.status || "Pending");
}

async function saveStudent() {
  const { error } = await supabase
    .from("profiles")
    .update({
  full_name: editName,
  email: editEmail,
  status: editStatus,
})
    .eq("id", editingStudent.id);

  if (error) {
    alert(error.message);
    return;
  }

  const { error: courseError } = await supabase
    .from("student_courses")
    .update({
      course_id: Number(editCourse),
    })
    .eq("student_id", editingStudent.id);

  if (courseError) {
    alert(courseError.message);
    return;
  }

  await loadStudents();

  setEditingStudent(null);

  alert("Student updated successfully.");
}

 async function loadPayments() {
  const { data, error } = await supabase
    .from("payments")
    .select(`
      id,
      amount,
      receipt_url,
      status,
      profiles!payments_student_id_fkey (
        full_name,
        email
      )
    `)
    .order("created_at", { ascending: false });

  console.log("Payments:", data);

  if (error) {
    console.error(error);
    return;
  }

  setPayments(data || []);
}

async function loadStudents() {
  console.log("loadStudents called");

  const { data, error } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      email,
      status,
      student_courses(
        course_id,
        courses(
          id,
          title
        )
      )
    `);

  console.log(data);
  console.log(error);

  if (error) {
    console.error(error);
    return;
  }

  setStudents(data || []);
}

async function loadDashboardStats() {

  // Reviews

  const { count: reviews } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true });

  setReviewCount(reviews || 0);

  // Active Courses

  const { count: courses } = await supabase
    .from("courses")
    .select("*", { count: "exact", head: true })
    .eq("active", true);

  setActiveCourses(courses || 0);

  // Revenue

  const { data: paymentData } = await supabase
    .from("payments")
    .select("amount")
    .eq("status", "Approved");

  const totalRevenue =
    paymentData?.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0
    ) || 0;

  setRevenue(totalRevenue);
}

async function loadCourses() {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("id");

  if (error) {
    console.error(error);
    return;
  }

  setCourses(data || []);
}

async function deleteStudent(id) {
  const confirmDelete = window.confirm(
    "Delete this student permanently?"
  );

  if (!confirmDelete) return;

  setLoading(true);

  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    setLoading(false);
    return;
  }

  await loadStudents();

  setLoading(false);

  alert("Student deleted successfully.");
}

  return (
    <MainLayout>
      <div className="flex min-h-screen">
        <Sidebar
          active={active}
          setActive={setActive}
        />

        <div className="flex-1">
          <section className="bg-slate-100 min-h-screen py-10 px-6">

            {active === "dashboard" && (
              <>

                <div className="max-w-7xl mx-auto">

                  <h1 className="text-5xl font-black">
                    Collins Classroom
                  </h1>

                  <p className="text-slate-600 mt-2 text-xl">
                    Administrator Dashboard
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mt-10">

  <div className="bg-white rounded-3xl shadow-lg p-8 border-l-4 border-blue-600">
    <p className="text-slate-500">Students</p>
    <h2 className="text-5xl font-black mt-3">
      {students.length}
    </h2>
    <p className="text-blue-600 mt-2">
      Registered Students
    </p>
  </div>

  <div className="bg-white rounded-3xl shadow-lg p-8 border-l-4 border-green-600">
    <p className="text-slate-500">Courses</p>
    <h2 className="text-5xl font-black mt-3">
      {activeCourses}
    </h2>
    <p className="text-green-600 mt-2">
      Active Courses
    </p>
  </div>

  <div className="bg-white rounded-3xl shadow-lg p-8 border-l-4 border-yellow-500">
    <p className="text-slate-500">Revenue</p>
    <h2 className="text-5xl font-black mt-3">
      ${revenue.toLocaleString()}
    </h2>
    <p className="text-yellow-600 mt-2">
      Approved Payments
    </p>
  </div>

  <div className="bg-white rounded-3xl shadow-lg p-8 border-l-4 border-red-500">
    <p className="text-slate-500">Pending</p>
    <h2 className="text-5xl font-black mt-3">
      {payments.filter((p) => p.status === "Pending").length}
    </h2>
    <p className="text-red-600 mt-2">
      Awaiting Approval
    </p>
  </div>

  <div className="bg-white rounded-3xl shadow-lg p-8 border-l-4 border-purple-600">
    <p className="text-slate-500">Reviews</p>
    <h2 className="text-5xl font-black mt-3">
      {reviewCount}
    </h2>
    <p className="text-purple-600 mt-2">
      Student Reviews
    </p>
  </div>

                  </div>
                                    <div className="bg-white rounded-3xl shadow-lg p-8 mt-10">

                    <h2 className="text-3xl font-black mb-6">
                      Registered Students
                    </h2>

                    <div className="overflow-x-auto">

                      <table className="w-full">

                        <thead>

                          <tr className="border-b">

                            <th className="text-left py-4">
                              Student
                            </th>

                            <th className="text-left py-4">
                              Email
                            </th>

                            <th className="text-left py-4">
                              Courses
                            </th>

                            <th className="text-left py-4">
                              Status
                            </th>

                          </tr>

                        </thead>

                        <tbody>

                          {students.length === 0 ? (

                            <tr className="border-b">

                              <td className="py-5">
                                No students yet.
                              </td>

                              <td>-</td>

                              <td>-</td>

                              <td>-</td>

                            </tr>

                          ) : (

                            students.map((student) => (

                              <tr
                                key={student.id}
                                className="border-b"
                              >

                                <td className="py-5 font-semibold">
                                  {student.full_name}
                                </td>

                                <td>
                                  {student.email}
                                </td>

                                <td>

                                  {student.student_courses.length === 0
                                    ? "No Course Selected"
                                    : student.student_courses
                                        .map((item) => item.courses.title)
                                        .join(", ")
                                  }

                                </td>

                                <td>

                                  <span
  className={`px-3 py-1 rounded-full text-sm font-semibold ${
    student.status === "Active"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700"
  }`}
>
  {student.status || "Pending"}
</span>

                                </td>

                              </tr>

                            ))

                          )}

                        </tbody>

                      </table>

                    </div>

                  </div>

                  <div className="bg-white rounded-3xl shadow-lg p-8 mt-10">

                    <h2 className="text-3xl font-black mb-6">
                      Payment Approvals
                    </h2>

                    <div className="overflow-x-auto">

                      <table className="w-full">

                        <thead>

                          <tr className="border-b">

                            <th className="text-left py-4">
                              Student
                            </th>

                            <th className="text-left py-4">
                              Amount
                            </th>

                            <th className="text-left py-4">
                              Receipt
                            </th>

                            <th className="text-left py-4">
                              Status
                            </th>

                          </tr>

                        </thead>

                        <tbody>

                          {payments.length === 0 ? (

                            <tr>

                              <td className="py-5">
                                No payment receipts submitted.
                              </td>

                              <td>-</td>

                              <td>-</td>

                              <td>-</td>

<td className="py-5">

</td>
                            </tr>

                          ) : (

                            payments.map((payment) => (

                              <tr
                                key={payment.id}
                                className="border-b"
                              >

                                <td className="py-5 font-semibold">
  {payment.profiles?.full_name || "Unknown User"}
</td>

                                <td>
                                  ${payment.amount}
                                </td>

                                <td>

                                  {payment.receipt_url ? (

                                    <a
                                      href={payment.receipt_url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-blue-600 font-semibold"
                                    >
                                      View Receipt
                                    </a>

                                  ) : (

                                    "No Receipt"

                                  )}

                                </td>

                                <td>

                                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-semibold text-sm">
                                    {payment.status}
                                  </span>

                                </td>

                              </tr>

                            ))

                          )}

                        </tbody>

                      </table>

                    </div>

                  </div>
                                    <div className="bg-white rounded-3xl shadow-lg p-8 mt-10">

                    <h2 className="text-3xl font-black mb-6">
                      Lesson Requests
                    </h2>

                    <div className="overflow-x-auto">

                      <table className="w-full">

                        <thead>

                          <tr className="border-b">

                            <th className="text-left py-4">
                              Student
                            </th>

                            <th className="text-left py-4">
                              Preferred Day
                            </th>

                            <th className="text-left py-4">
                              Preferred Time
                            </th>

                            <th className="text-left py-4">
                              Status
                            </th>

                          </tr>

                        </thead>

                        <tbody>

                          <tr>

                            <td className="py-5">
                              No lesson requests yet.
                            </td>

                            <td>-</td>

                            <td>-</td>

                            <td>-</td>

                          </tr>

                        </tbody>

                      </table>

                    </div>

                  </div>

                </div>

              </>
            )}

            {active === "students" && (
              

              <div className="max-w-7xl mx-auto">

                <h1 className="text-4xl font-black mb-8">
                  Registered Students
                </h1>

                <div className="bg-white rounded-3xl shadow-lg p-8">

                  <div className="overflow-x-auto">

                    <table className="w-full">

                      <thead>

                        <tr className="border-b">

                          <th className="text-left py-4">
                            Student
                          </th>

                          <th className="text-left py-4">
                            Email
                          </th>

                          <th className="text-left py-4">
                            Courses
                          </th>

                          <th className="text-left py-4">
                            Status
                          </th>

<th className="text-left py-4">
  Actions
</th>
                        </tr>

                      </thead>

                      <tbody>

                        {students.length === 0 ? (

                          <tr>

                            <td className="py-5">
                              No students yet.
                            </td>

                            <td>-</td>

                            <td>-</td>

                            <td>-</td>

                          </tr>

                        ) : (

                          students.map((student) => (

                            <tr
                              key={student.id}
                              className="border-b"
                            >

                              <td className="py-5 font-semibold">
                                {student.full_name}
                              </td>

                              <td>
                                {student.email}
                              </td>

                              <td>

                                {student.student_courses.length === 0
  ? "No Course Selected"
  : [...new Set(student.student_courses.map((item) => item.courses.title))].join(", ")
}

                              </td>

                              <td>

                                <span
  className={`px-3 py-1 rounded-full text-sm font-semibold ${
    student.status === "Active"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700"
  }`}
>
  {student.status}
</span>

</td>

<td className="py-5">

  <div className="flex gap-2">

    <button
  onClick={() => openEditStudent(student)}
  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm"
>
  Edit
</button>

    <button
  onClick={() => approveStudent(student.id)}
  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm"
>
  Approve
</button>

    <button
  onClick={() => deleteStudent(student.id)}
  disabled={loading}
  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm"
>
  Delete
</button>

  </div>

</td>

</tr>

                          ))

                        )}

                      </tbody>

                    </table>

                  </div>

                </div>

              </div>

            )}

            {active === "payments" && (

              <div className="max-w-7xl mx-auto">

                <h1 className="text-4xl font-black mb-8">
                  Payment Approvals
                </h1>

                <div className="bg-white rounded-3xl shadow-lg p-8">

                  <div className="overflow-x-auto">

                    <table className="w-full">

                      <thead>

                        <tr className="border-b">

                          <th className="text-left py-4">
                            Student
                          </th>

                          <th className="text-left py-4">
                            Amount
                          </th>

                          <th className="text-left py-4">
                            Receipt
                          </th>

                          <th className="text-left py-4">
                            Status
                          </th>

<th className="text-left py-4">
  Actions
</th>

                        </tr>

                      </thead>

                      <tbody>
                                              {payments.length === 0 ? (

                          <tr>

                            <td className="py-5">
                              No payment receipts submitted.
                            </td>

                            <td>-</td>

                            <td>-</td>

                            <td>-</td>

                          </tr>

                        ) : (

                          payments.map((payment) => (

                            <tr
                              key={payment.id}
                              className="border-b"
                            >

                              <td className="py-5 font-semibold">
                               payment.profiles?.full_name || "Unknown User"
                              </td>

                              <td>
                                ${payment.amount}
                              </td>

                              <td>

                                {payment.receipt_url ? (

                                  <a
                                    href={payment.receipt_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-600 font-semibold"
                                  >
                                    View Receipt
                                  </a>

                                ) : (

                                  "No Receipt"

                                )}

                              </td>

                              <td>

  <span
    className={`px-3 py-1 rounded-full font-semibold text-sm ${
      payment.status === "Approved"
        ? "bg-green-100 text-green-700"
        : payment.status === "Rejected"
        ? "bg-red-100 text-red-700"
        : "bg-yellow-100 text-yellow-700"
    }`}
  >
    {payment.status}
  </span>

</td>
<td className="py-5">

  <div className="flex gap-2">

    <button
  type="button"
  disabled={processingPayment === payment.id}
  onClick={() => approvePayment(payment.id)}
  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-3 py-1 rounded-lg text-sm"
>
  {processingPayment === payment.id
    ? "Approving..."
    : "Approve"}
</button>

    <button
  type="button"
  disabled={processingPayment === payment.id}
  onClick={() => rejectPayment(payment.id)}
  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-3 py-1 rounded-lg text-sm"
>
  {processingPayment === payment.id
    ? "Rejecting..."
    : "Reject"}
</button>

   <button
  type="button"
  disabled={processingPayment === payment.id}
  onClick={() => deletePayment(payment.id)}
  className="bg-gray-700 hover:bg-gray-800 disabled:bg-gray-400 text-white px-3 py-1 rounded-lg text-sm"
>
  {processingPayment === payment.id
    ? "Deleting..."
    : "Delete"}
</button>

  </div>

</td>
                            </tr>

                          ))

                        )}

                      </tbody>

                    </table>

                  </div>

                </div>

              </div>

            )}

            {active === "courses" && (
  <AdminCourses />
)}

            {active === "media" && <AdminMedia />}

            {active === "settings" && (

              <div className="max-w-7xl mx-auto">

                <h1 className="text-4xl font-black">
                  Settings
                </h1>

                <p className="text-slate-600 mt-2">
                  Settings page coming soon.
                </p>

              </div>

            )}

          </section>

        </div>

      </div>

{editingStudent && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

      <h2 className="text-2xl font-bold mb-6">
        Edit Student
      </h2>

      <div className="space-y-4">

        <div>
          <label className="block text-sm font-medium mb-2">
            Full Name
          </label>

          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Email
          </label>

          <input
            type="email"
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

<div>
  <label className="block text-sm font-medium mb-2">
    Course
  </label>

  <select
  value={editCourse}
  onChange={(e) => setEditCourse(e.target.value)}
  className="w-full border rounded-lg px-4 py-2"
>
  <option value="">Select Course</option>

  {courses.map((course) => (
    <option
      key={course.id}
      value={course.id}
    >
      {course.title}
    </option>
  ))}
</select>
</div>

<div>
  <label className="block text-sm font-medium mb-2">
    Status
  </label>

  <select
    value={editStatus}
    onChange={(e) => setEditStatus(e.target.value)}
    className="w-full border rounded-lg px-4 py-2"
  >
    <option value="Pending">Pending</option>
    <option value="Active">Active</option>
  </select>
</div>

      </div>

      <div className="flex justify-end gap-3 mt-6">

        <button
          onClick={() => setEditingStudent(null)}
          className="px-4 py-2 rounded-lg border"
        >
          Cancel
        </button>

        <button
          onClick={saveStudent}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Save
        </button>

      </div>

    </div>

  </div>
)}

    </MainLayout>
  );
}