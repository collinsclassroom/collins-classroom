import { supabase } from "../lib/supabase";

/* =========================
   Load Entire Team
========================= */

export async function loadTeam() {
  const { data, error } = await supabase
    .from("academy_team")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw error;

  return data;
}

/* =========================
   Update Member
========================= */

export async function updateMember(id, updates) {
  const { data, error } = await supabase
    .from("academy_team")
    .update(updates)
    .eq("id", id)
    .select();

  console.log("UPDATE DATA:", data);
  console.log("UPDATE ERROR:", error);

  if (error) throw error;

  return data;
}

/* =========================
   Upload Photo
========================= */

export async function uploadMemberPhoto(file, fileName) {
  const filePath = `academy-team/${Date.now()}-${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(filePath, file, {
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from("media")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/* =========================
   Delete Member
========================= */

export async function deleteMember(id) {
  const { error } = await supabase
    .from("academy_team")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

/* =========================
   Create Member
========================= */

export async function createMember(member) {
  const { data, error } = await supabase
    .from("academy_team")
    .insert(member)
    .select()
    .single();

  if (error) throw error;

  return data;
}