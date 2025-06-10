import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
const supabaseKey = process.env.SUPABASE_PROJECT_API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export const uploadFile = async (uploadPath, file) => {
  const { data, error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET_NAME)
    .upload(uploadPath, file, {
      cacheControl: "3600", //time the file is cached in browser, def is 3600
      upsert: false, //false (if true overwrites the file if exists, if false it throws an err)
    });

  return { data, error };
};

export const signUp = async (email, password, userData) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });
  return { data, error };
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getSession = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  return { session, error };
};

export const getUser = async () => {
  console.log("Supabase: Getting user...");
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  console.log("Supabase: User data:", user ? "User found" : "No user");
  if (error) {
    console.error("Supabase: Error getting user:", error);
  }
  return { user, error };
};
