"use server";
import { createServerSupabase } from "@/lib/supabase";

export async function subscribeNewsletter(email) {
  const trimmed = email?.trim().toLowerCase();
  if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { success: false, error: "Please enter a valid email." };
  }
  const supabase = createServerSupabase();
  const { error } = await supabase
    .from("subscribers")
    .insert({ email: trimmed });
  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "You're already subscribed!" };
    }
    console.error("subscribeNewsletter error:", error);
    return { success: false, error: "Something went wrong. Try again." };
  }
  return { success: true };
}