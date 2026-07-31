import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminMedia() {
  const [selectedFiles, setSelectedFiles] = useState({});
const [uploadedMedia, setUploadedMedia] = useState({});
const [loading, setLoading] = useState(true);

const fileRefs = useRef({});

const mediaKeys = {
  "Homepage Hero Image": "home_hero",
  "About Page Image": "about_image",
  "Introduction Video": "introduction_video",

  "Student Testimonial 1": "student_testimonial_1",
  "Student Testimonial 2": "student_testimonial_2",
  "Student Testimonial 3": "student_testimonial_3",
  "Student Testimonial 4": "student_testimonial_4",
  "Student Testimonial 5": "student_testimonial_5",

  "Classroom Highlight 1": "classroom_highlight_1",
  "Classroom Highlight 2": "classroom_highlight_2",
  "Classroom Highlight 3": "classroom_highlight_3",
  "Classroom Highlight 4": "classroom_highlight_4",
  "Classroom Highlight 5": "classroom_highlight_5",
};

console.log(uploadedMedia);

const mediaCards = [
  "Homepage Hero Image",
  "About Page Image",
  "Introduction Video",

  "Student Testimonial 1",
  "Student Testimonial 2",
  "Student Testimonial 3",
  "Student Testimonial 4",
  "Student Testimonial 5",

  "Classroom Highlight 1",
  "Classroom Highlight 2",
  "Classroom Highlight 3",
  "Classroom Highlight 4",
  "Classroom Highlight 5",
];

async function loadMedia() {
  setLoading(true);

  const { data, error } = await supabase
    .from("media")
    .select("*");

  if (error) {
    console.error(error);
    return;
  }

  const mediaObject = {};

  data.forEach((item) => {
    mediaObject[item.media_key] = item;
  });

  setUploadedMedia(mediaObject);
  setLoading(false);
}

useEffect(() => {
  loadMedia();
}, []);

async function deleteMedia(item) {
  const mediaKey = mediaKeys[item];

  console.log("Saving:", item);
console.log("Media Key:", mediaKey);

  const media = uploadedMedia[mediaKey];

  if (!media) {
    alert("No media to delete.");
    return;
  }

  const { error: storageError } = await supabase.storage
    .from("media")
    .remove([media.file_name]);

  if (storageError) {
    alert(storageError.message);
    return;
  }

  const { error: dbError } = await supabase
    .from("media")
    .delete()
    .eq("media_key", mediaKey);

  if (dbError) {
    alert(dbError.message);
    return;
  }

  await loadMedia();

  alert("Media deleted successfully.");
}


  async function saveMedia(item) {

    const {
  data: { user },
} = await supabase.auth.getUser();

console.log("Current User:", user);

  const file = selectedFiles[item];

  console.log("Selected File:", file);

console.log({
  name: file?.name,
  type: file?.type,
  size: file?.size,
});

  if (!file) {
    alert("Please select a file first.");
    return;
  }

  const mediaKey = mediaKeys[item];

  const fileExt = file.name.split(".").pop();
  const fileName = `${mediaKey}.${fileExt}`;

console.log("Uploading as:", fileName);

  let uploadError = null;

try {
  const { error } = await supabase.storage
    .from("media")
    .upload(fileName, file, {
      upsert: true,
    });

  uploadError = error;
} catch (err) {
  console.error("UPLOAD EXCEPTION:", err);
  alert("Upload Exception: " + err.message);
  return;
}

if (uploadError) {
  console.error("UPLOAD ERROR:", uploadError);
  alert(uploadError.message);
  return;
}

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("media")
    .getPublicUrl(fileName);

  const { error: dbError } = await supabase
  .from("media")
  .upsert(
    {
      media_key: mediaKey,
      file_name: fileName,
      file_url: publicUrl,
      media_type: file.type.startsWith("image")
        ? "image"
        : "video",
    },
    {
      onConflict: "media_key",
    }
  );

  if (dbError) {
    alert(dbError.message);
    return;
  }

  await loadMedia();

alert("Media saved successfully.");
}

  return (
    <div className="max-w-7xl mx-auto">

      <h1 className="text-4xl font-black">
        Media Manager
      </h1>

      <p className="text-slate-600 mt-2 mb-10">
        Manage all website images and videos.
      </p>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

        {mediaCards.map((item) => (

          <div
            key={item}
            className="bg-white rounded-3xl shadow-lg p-6"
          >

            <div className="h-48 bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center">

  {uploadedMedia[mediaKeys[item]] ? (

    uploadedMedia[mediaKeys[item]].media_type === "image" ? (

      <img
        src={uploadedMedia[mediaKeys[item]].file_url}
        alt={item}
        className="w-full h-full object-cover"
      />

    ) : (

      <video
        src={uploadedMedia[mediaKeys[item]].file_url}
        controls
        className="w-full h-full object-cover"
      />

    )

  ) : (

    <span className="text-slate-400">
      No media uploaded
    </span>

  )}

</div>

            <h2 className="text-xl font-bold mt-6">
              {item}
            </h2>

<input
  type="file"
  accept={
    item.toLowerCase().includes("image")
      ? "image/*"
      : "video/*"
  }
  ref={(el) => (fileRefs.current[item] = el)}
  className="hidden"
  onChange={(e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedFiles((prev) => ({
      ...prev,
      [item]: file,
    }));
  }}
/>

<button
  onClick={() => fileRefs.current[item]?.click()}
  className="w-full mt-5 bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-xl font-bold"
>
  {item.toLowerCase().includes("image")
    ? "📤 Upload Image"
    : "📤 Upload Video"}
</button>

{selectedFiles[item] && (
  <p className="text-green-600 text-sm mt-3 break-all">
    Selected:
    <br />
    {selectedFiles[item].name}
  </p>
)}

<div className="flex gap-3 mt-6">

  <button
  onClick={() => deleteMedia(item)}
  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold"
>
  Delete
</button>

  <button
  onClick={() => saveMedia(item)}
  className="flex-1 bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-bold"
>
  Save
</button>

</div>
            
          </div>

        ))}

      </div>

    </div>
  );
}