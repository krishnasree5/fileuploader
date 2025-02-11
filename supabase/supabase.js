import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
const supabaseKey = process.env.SUPABASE_PROJECT_API_KEY;

const supabase = createClient(
  supabaseUrl,
  supabaseKey
);

export const uploadFile = async (uploadPath, file) => {
  const { data, error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET_NAME)
    .upload(uploadPath, file, {
      cacheControl: "3600", //time the file is cached in browser, def is 3600
      upsert: false, //false (if true overwrites the file if exists, if false it throws an err)
    });
  
  return { data, error };
}
