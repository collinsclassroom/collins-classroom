import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function WebsiteContent() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  async function loadContent() {
    const { data, error } = await supabase
      .from("website_content")
      .select("*")
      .order("section");

    if (!error) setContent(data || []);

    setLoading(false);
  }

  async function save(item) {
    const { error } = await supabase
      .from("website_content")
      .update({
        title: item.title,
        subtitle: item.subtitle,
        content: item.content,
        image_url: item.image_url,
        video_url: item.video_url,
        button_text: item.button_text,
        button_link: item.button_link,
      })
      .eq("id", item.id);

    if (!error) {
      alert("Saved successfully.");
    } else {
      alert(error.message);
    }
  }

  function updateValue(index, field, value) {
    const updated = [...content];
    updated[index][field] = value;
    setContent(updated);
  }

  if (loading) return <p className="p-8">Loading...</p>;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Website Content Manager</h2>

      {content.map((item, index) => (
        <div
          key={item.id}
          className="bg-white rounded-xl shadow p-6 space-y-4"
        >
          <h3 className="font-bold text-xl">{item.section}</h3>

          <input
            className="w-full border rounded-lg p-3"
            placeholder="Title"
            value={item.title || ""}
            onChange={(e) =>
              updateValue(index, "title", e.target.value)
            }
          />

          <input
            className="w-full border rounded-lg p-3"
            placeholder="Subtitle"
            value={item.subtitle || ""}
            onChange={(e) =>
              updateValue(index, "subtitle", e.target.value)
            }
          />

          <textarea
            rows={6}
            className="w-full border rounded-lg p-3"
            placeholder="Content"
            value={item.content || ""}
            onChange={(e) =>
              updateValue(index, "content", e.target.value)
            }
          />

          <input
            className="w-full border rounded-lg p-3"
            placeholder="Image URL"
            value={item.image_url || ""}
            onChange={(e) =>
              updateValue(index, "image_url", e.target.value)
            }
          />

          <input
            className="w-full border rounded-lg p-3"
            placeholder="Video URL"
            value={item.video_url || ""}
            onChange={(e) =>
              updateValue(index, "video_url", e.target.value)
            }
          />

          <input
            className="w-full border rounded-lg p-3"
            placeholder="Button Text"
            value={item.button_text || ""}
            onChange={(e) =>
              updateValue(index, "button_text", e.target.value)
            }
          />

          <input
            className="w-full border rounded-lg p-3"
            placeholder="Button Link"
            value={item.button_link || ""}
            onChange={(e) =>
              updateValue(index, "button_link", e.target.value)
            }
          />

          <button
            onClick={() => save(item)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Save Changes
          </button>
        </div>
      ))}
    </div>
  );
}