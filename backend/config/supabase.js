import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabaseInstance = null;

const isValidUrl = (url) => {
  try {
    return url && (url.startsWith("http://") || url.startsWith("https://"));
  } catch {
    return false;
  }
};

if (!isValidUrl(supabaseUrl) || !supabaseKey || supabaseKey.startsWith("your_")) {
  console.warn("⚠️ Warning: Supabase URL or Key is missing or contains placeholders in .env.");
  // Create a proxy/dummy client to prevent immediate crash on startup
  supabaseInstance = new Proxy({}, {
    get: (target, prop) => {
      // Returns a function or object that will throw an error when invoked,
      // letting the application boot but fail gracefully during API requests.
      return () => {
        return {
          select: () => ({
            eq: () => ({
              order: () => ({
                maybeSingle: () => Promise.resolve({ data: null, error: new Error("Supabase is not configured. Please supply valid credentials in backend/.env") }),
                single: () => Promise.resolve({ data: null, error: new Error("Supabase is not configured. Please supply valid credentials in backend/.env") })
              }),
              maybeSingle: () => Promise.resolve({ data: null, error: new Error("Supabase is not configured. Please supply valid credentials in backend/.env") }),
              single: () => Promise.resolve({ data: null, error: new Error("Supabase is not configured. Please supply valid credentials in backend/.env") })
            }),
            or: () => ({
              maybeSingle: () => Promise.resolve({ data: null, error: new Error("Supabase is not configured. Please supply valid credentials in backend/.env") }),
              single: () => Promise.resolve({ data: null, error: new Error("Supabase is not configured. Please supply valid credentials in backend/.env") })
            }),
            like: () => Promise.resolve({ data: null, error: new Error("Supabase is not configured. Please supply valid credentials in backend/.env") })
          }),
          insert: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: null, error: new Error("Supabase is not configured. Please supply valid credentials in backend/.env") })
            })
          }),
          update: () => ({
            eq: () => Promise.resolve({ data: null, error: new Error("Supabase is not configured. Please supply valid credentials in backend/.env") })
          })
        };
      };
    }
  });
} else {
  supabaseInstance = createClient(supabaseUrl, supabaseKey);
}

export const supabase = supabaseInstance;
