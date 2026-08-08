import { useEffect, useState } from "react";
import {
  loadTeam,
  updateMember,
  uploadMemberPhoto,
  addMember,
  deleteMember,
} from "../../utils/teamStorage";

export default function AcademyTeamManager() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddTeam, setShowAddTeam] = useState(false);

  const [newTeam, setNewTeam] = useState({
    role: "",
    name: "",
    position: "",
    qualification: "",
    experience: "",
    specialization: "",
    biography: "",
    photo_url: "",
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

  async function removeMember(id, name) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await deleteMember(id);
      await fetchTeam();
      alert("Team member deleted successfully.");
    } catch (err) {
      alert(err.message);
    }
  }

  async function saveNewTeam() {
    try {
      const member = {
        ...newTeam,
      };

      await addMember(member);

      await fetchTeam();

      setShowAddTeam(false);

      setNewTeam({
        role: "",
        name: "",
        position: "",
        qualification: "",
        experience: "",
        specialization: "",
        biography: "",
        photo_url: "",
      });

      alert("Team member added successfully.");
    } catch (err) {
      alert(err.message);
    }
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

  async function handleNewTeamPhoto(file) {
    if (!file) return;

    try {
      const photoUrl = await uploadMemberPhoto(file, file.name);

      setNewTeam((prev) => ({
        ...prev,
        photo_url: photoUrl,
      }));

      alert("Photo uploaded successfully.");
    } catch (err) {
      console.error(err);
      alert(err.message);
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
        onClick={() => setShowAddTeam(true)}
        className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-bold"
      >
        + Add Team Member
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

          <div className="mt-8 flex gap-4">

  <button
    onClick={() => saveMember(member)}
    className="bg-blue-700 text-white px-8 py-3 rounded-xl font-bold"
  >
    Save Changes
  </button>

  <button
    onClick={() => removeMember(member.id, member.name)}
    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold"
  >
    Delete
  </button>

</div>

        </div>

      ))}

    {showAddTeam && (

  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

    <div className="bg-white rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">

      <h2 className="text-3xl font-black mb-6">
  Add New Team Member
</h2>

<div className="space-y-5">

  {newTeam.photo_url && (
    <div className="flex justify-center">
      <img
        src={newTeam.photo_url}
        alt="Team Member"
        className="w-40 h-40 rounded-2xl object-cover border shadow"
      />
    </div>
  )}

  <div>
    <label className="block font-semibold mb-2">
      Team Member Photo
    </label>

    <input
      type="file"
      accept="image/*"
      onChange={(e) =>
        handleNewTeamPhoto(e.target.files[0])
      }
      className="w-full border rounded-xl p-3"
    />

    <p className="text-sm text-slate-500 mt-2">
      Upload a team member profile photo.
    </p>
  </div>

  <input
    type="text"
    placeholder="Full Name"
    value={newTeam.name}
    onChange={(e) =>
      setNewTeam({
        ...newTeam,
        name: e.target.value,
      })
    }
    className="w-full border rounded-xl p-3"
  />

  <select
  value={newTeam.role}
  onChange={(e) =>
    setNewTeam({
      ...newTeam,
      role: e.target.value,
    })
  }
  className="w-full border rounded-xl p-3"
>
  <option value="">Select Role</option>
  <option value="founder">Founder</option>
  <option value="managing_director">Managing Director</option>
  <option value="team">Team</option>
  <option value="marketing_manager">Marketing Manager</option>
  <option value="receptionist">Receptionist</option>
  <option value="accountant">Accountant</option>
  <option value="it_administrator">IT Administrator</option>
</select>

  <input
    type="text"
    placeholder="Position"
    value={newTeam.position}
    onChange={(e) =>
      setNewTeam({
        ...newTeam,
        position: e.target.value,
      })
    }
    className="w-full border rounded-xl p-3"
  />

  <textarea
    rows={2}
    placeholder="Qualification"
    value={newTeam.qualification}
    onChange={(e) =>
      setNewTeam({
        ...newTeam,
        qualification: e.target.value,
      })
    }
    className="w-full border rounded-xl p-3"
  />

  <input
    type="text"
    placeholder="Experience"
    value={newTeam.experience}
    onChange={(e) =>
      setNewTeam({
        ...newTeam,
        experience: e.target.value,
      })
    }
    className="w-full border rounded-xl p-3"
  />

  <textarea
    rows={2}
    placeholder="Specialization"
    value={newTeam.specialization}
    onChange={(e) =>
      setNewTeam({
        ...newTeam,
        specialization: e.target.value,
      })
    }
    className="w-full border rounded-xl p-3"
  />

  <textarea
    rows={5}
    placeholder="Biography"
    value={newTeam.biography}
    onChange={(e) =>
      setNewTeam({
        ...newTeamr,
        biography: e.target.value,
      })
    }
    className="w-full border rounded-xl p-3"
  />

</div>

          <div className="flex justify-end gap-4">

            <button
  onClick={() => {
    setShowAddTeam(false);

    setNewTeam({
      role: "",
      name: "",
      position: "",
      qualification: "",
      experience: "",
      specialization: "",
      biography: "",
      photo_url: "",
    });
  }}
  className="px-6 py-3 border rounded-xl"
>
  Cancel
</button>

            <button
  onClick={saveNewTeam}
  className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-bold"
>
  Save Team Member
</button>

          </div>

        </div>

      </div>

    )}

    </div>
  );
}
