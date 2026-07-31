import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
} from "react-icons/fa";

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);

  // Add Course
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newIcon, setNewIcon] = useState("📘");

  // Edit Course
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingPrice, setEditingPrice] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [editingIcon, setEditingIcon] = useState("📘");
  const [editingActive, setEditingActive] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

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

  async function addCourse() {
    if (!newTitle || !newPrice) {
      alert("Please complete all fields.");
      return;
    }

    const { error } = await supabase
      .from("courses")
      .insert({
        title: newTitle,
        price: Number(newPrice),
        description: newDescription,
        icon: newIcon,
        active: true,
      });

    if (error) {
      alert(error.message);
      return;
    }

    setNewTitle("");
    setNewPrice("");
    setNewDescription("");
    setNewIcon("📘");

    await loadCourses();
  }

  function editCourse(course) {
    setEditingId(course.id);
    setEditingTitle(course.title);
    setEditingPrice(course.price);
    setEditingDescription(course.description || "");
    setEditingIcon(course.icon || "📘");
    setEditingActive(course.active);
  }

  async function saveCourse() {
    const { error } = await supabase
      .from("courses")
      .update({
        title: editingTitle,
        price: Number(editingPrice),
        description: editingDescription,
        icon: editingIcon,
        active: editingActive,
      })
      .eq("id", editingId);

    if (error) {
      alert(error.message);
      return;
    }

    setEditingId(null);

    await loadCourses();
  }

  async function deleteCourse(id) {
    if (!window.confirm("Delete this course?")) return;

    const { error } = await supabase
      .from("courses")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    await loadCourses();
  }

    return (
  <div className="bg-white rounded-3xl shadow-xl p-8 mt-10">

    <h2 className="text-3xl font-black mb-8">
      Course Management
    </h2>

    <div className="bg-slate-50 border rounded-2xl p-6 mb-10">

  <h3 className="text-2xl font-bold mb-6">
    Add New Course
  </h3>

  <div className="grid lg:grid-cols-2 gap-6">

    <div>
      <label className="block font-semibold mb-2">
        Course Name
      </label>

      <input
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        placeholder="Basic General English"
        className="w-full border rounded-xl px-4 py-3"
      />
    </div>

    <div>
      <label className="block font-semibold mb-2">
        Price ($)
      </label>

      <input
        type="number"
        value={newPrice}
        onChange={(e) => setNewPrice(e.target.value)}
        placeholder="15"
        className="w-full border rounded-xl px-4 py-3"
      />
    </div>

    <div>
      <label className="block font-semibold mb-2">
        Course Icon
      </label>

      <input
        value={newIcon}
        onChange={(e) => setNewIcon(e.target.value)}
        placeholder="📘"
        className="w-full border rounded-xl px-4 py-3"
      />

      <p className="text-sm text-slate-500 mt-2">
        Examples: 📘 🌍 ✍️ 💼 🎓 👧 🗣️
      </p>

    </div>

    <div>
      <label className="block font-semibold mb-2">
        Description
      </label>

      <textarea
        rows={5}
        value={newDescription}
        onChange={(e) => setNewDescription(e.target.value)}
        placeholder="Describe this course..."
        className="w-full border rounded-xl px-4 py-3"
      />
    </div>

  </div>

  <button
    onClick={addCourse}
    className="mt-8 bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-xl flex items-center gap-3"
  >
    <FaPlus />
    Add Course
  </button>

</div>

<table className="w-full">
        <thead>

  <tr className="border-b">

    <th className="text-left py-4">Icon</th>

    <th className="text-left py-4">Course</th>

    <th className="text-left py-4">Price</th>

    <th className="text-left py-4">Status</th>

    <th className="text-left py-4">Actions</th>

  </tr>

</thead>

        <tbody>

  {courses.map((course) => (

    <tr
      key={course.id}
      className="border-b hover:bg-slate-50 transition"
    >

      {/* ICON */}

      <td className="py-5">

        {editingId === course.id ? (

          <input
            value={editingIcon}
            onChange={(e) => setEditingIcon(e.target.value)}
            className="border rounded-lg p-2 w-20 text-center"
          />

        ) : (

          <span className="text-5xl">
  {course.icon || "📘"}
</span>

        )}

      </td>

      {/* COURSE */}

      <td className="py-5">

        {editingId === course.id ? (

          <div className="space-y-3">

            <input
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              className="border rounded-lg p-2 w-full"
            />

            <textarea
              rows={4}
              value={editingDescription}
              onChange={(e) => setEditingDescription(e.target.value)}
              className="border rounded-lg p-2 w-full"
            />

          </div>

        ) : (

          <>

            <h3 className="font-bold text-lg">
              {course.title}
            </h3>

            <p className="text-slate-500 mt-2 leading-7 max-w-lg">
  {course.description}
</p>

          </>

        )}

      </td>

      {/* PRICE */}

      <td className="py-5">

        {editingId === course.id ? (

          <input
            type="number"
            value={editingPrice}
            onChange={(e) => setEditingPrice(e.target.value)}
            className="border rounded-lg p-2 w-28"
          />

        ) : (

          <span className="text-2xl font-black text-blue-700">
  ${course.price}
</span>

        )}

      </td>

      {/* STATUS */}

      <td className="py-5">

        {editingId === course.id ? (

          <label className="flex items-center gap-2">

            <input
              type="checkbox"
              checked={editingActive}
              onChange={(e) =>
                setEditingActive(e.target.checked)
              }
            />

            Active

          </label>

        ) : (

          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              course.active
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {course.active ? "Active" : "Inactive"}
          </span>

        )}

      </td>

      {/* ACTIONS */}

      <td className="py-5">

        {editingId === course.id ? (

          <div className="flex gap-2">

            <button
              onClick={saveCourse}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <FaSave />
              Save
            </button>

            <button
              onClick={() => setEditingId(null)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <FaTimes />
              Cancel
            </button>

          </div>

        ) : (

          <div className="flex gap-2">

            <button
              onClick={() => editCourse(course)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <FaEdit />
              Edit
            </button>

            <button
              onClick={() => deleteCourse(course.id)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <FaTrash />
              Delete
            </button>

          </div>

        )}

      </td>

    </tr>

  ))}

</tbody>

</table>

</div>
);
}