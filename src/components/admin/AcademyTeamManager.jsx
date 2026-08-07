import { useEffect, useState } from "react";
import {
  loadTeam,
  updateMember,
  uploadMemberPhoto,
} from "../../utils/teamStorage";

export default function AcademyTeamManager() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTeacher, setShowAddTeacher] = useState(false);

  const [newTeacher, setNewTeacher] = useState({
  role: "",
  name: "",
  position: "",
  qualification: "",
  experience: "",
  specialization: "",
  biography: "",
});

  useEffect(() => {
    fetchTeam();
  }, []);

  async function fetchTeam() {
    try {
      const data = await loadTeam();
      setTeam(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function saveMember(member) {
    try {
      await updateMember(member.id, member);
      alert("Saved successfully.");
    } catch (err) {
      alert(err.message);
    }
  }

  function handleChange(id, field, value) {
    setTeam((current) =>
      current.map((member) =>
        member.id === id
          ? { ...member, [field]: value }
          : member
      )
    );
  }
async function handlePhotoUpload(id, file) {
  if (!file) return;

  try {
    console.log("Member ID:", id);

    const photoUrl = await uploadMemberPhoto(file, file.name);

    console.log("Photo URL:", photoUrl);

    const result = await updateMember(id, {
      photo_url: photoUrl,
    });

    console.log("Database Update:", result);

    const updatedTeam = await loadTeam();
    setTeam(updatedTeam);

    alert("Photo uploaded successfully.");
  } catch (err) {
  console.error(err);
  console.log(JSON.stringify(err, null, 2));
  alert(JSON.stringify(err, null, 2));
}
}
  if (loading) {

    return (
      <div className="text-center py-20">
        Loading Academy Team...
      </div>
    );
  }

  return (
  <div className="space-y-10">

    <div className="flex justify-between items-center mb-8">

      <h1 className="text-4xl font-black">
        Academy Team
      </h1>

      <button
        onClick={() => setShowAddTeacher(true)}
        className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-bold"
      >
        + Add Teacher
      </button>

    </div>

    {team.map((member) => (

        <div
          key={member.id}
          className="bg-white rounded-3xl shadow-lg p-8"
        >

          <h3 className="text-2xl font-bold mb-6 capitalize">
            {member.role.replace("_", " ")}
          </h3>

          <div className="grid lg:grid-cols-2 gap-6">

<div className="lg:col-span-2">

  <div className="lg:col-span-2">

  <label className="font-semibold">
    Team Photo
  </label>

  {member.photo_url && (
    <img
      src={member.photo_url}
      alt={member.name}
      className="w-40 h-40 object-cover rounded-2xl border mt-3 mb-4"
    />
  )}

  <input
    type="file"
    accept="image/*"
    onChange={(e) =>
      handlePhotoUpload(member.id, e.target.files[0])
    }
    className="w-full border rounded-xl p-3"
  />

  <p className="text-sm text-slate-500 mt-2">
    Upload a Founder, Managing Director or Teacher photo.
  </p>

</div>

</div>
            <div>

              <label className="font-semibold">
                Full Name
              </label>

              <input
                value={member.name || ""}
                onChange={(e) =>
                  handleChange(
                    member.id,
                    "name",
                    e.target.value
                  )
                }
                className="w-full border rounded-xl p-3 mt-2"
              />

            </div>

            <div>

              <label className="font-semibold">
                Position
              </label>

              <input
                value={member.position || ""}
                onChange={(e) =>
                  handleChange(
                    member.id,
                    "position",
                    e.target.value
                  )
                }
                className="w-full border rounded-xl p-3 mt-2"
              />

            </div>

            <div>

              <label className="font-semibold">
                Qualification
              </label>

              <textarea
                rows={3}
                value={member.qualification || ""}
                onChange={(e) =>
                  handleChange(
                    member.id,
                    "qualification",
                    e.target.value
                  )
                }
                className="w-full border rounded-xl p-3 mt-2"
              />

            </div>

            <div>

              <label className="font-semibold">
                Experience
              </label>

              <input
                value={member.experience || ""}
                onChange={(e) =>
                  handleChange(
                    member.id,
                    "experience",
                    e.target.value
                  )
                }
                className="w-full border rounded-xl p-3 mt-2"
              />

            </div>

            <div>

              <label className="font-semibold">
                Specialization
              </label>

              <textarea
                rows={3}
                value={member.specialization || ""}
                onChange={(e) =>
                  handleChange(
                    member.id,
                    "specialization",
                    e.target.value
                  )
                }
                className="w-full border rounded-xl p-3 mt-2"
              />

            </div>

            <div className="lg:col-span-2">

              <label className="font-semibold">
                Biography
              </label>

              <textarea
                rows={6}
                value={member.biography || ""}
                onChange={(e) =>
                  handleChange(
                    member.id,
                    "biography",
                    e.target.value
                  )
                }
                className="w-full border rounded-xl p-3 mt-2"
              />

            </div>

          </div>

          <button
            onClick={() => saveMember(member)}
            className="mt-8 bg-blue-700 text-white px-8 py-3 rounded-xl font-bold"
          >
            Save Changes
          </button>

        </div>

      ))}

    {showAddTeacher && (

      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

        <div className="bg-white rounded-3xl p-8 w-full max-w-2xl">

          <h2 className="text-3xl font-black mb-6">
            Add New Teacher
          </h2>

          <p className="text-slate-600 mb-6">
            Teacher form coming in the next step.
          </p>

          <div className="flex justify-end gap-4">

            <button
              onClick={() => setShowAddTeacher(false)}
              className="px-6 py-3 border rounded-xl"
            >
              Cancel
            </button>

            <button
              className="bg-blue-700 text-white px-6 py-3 rounded-xl"
            >
              Save Teacher
            </button>

          </div>

        </div>

      </div>

    )}

    </div>
  );
}
