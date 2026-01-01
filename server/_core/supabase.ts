import { createClient } from "@supabase/supabase-js";
import type { Request } from "express";
import { ENV } from "./env";

// Server-side Supabase client with service role key (for admin operations)
export const supabaseAdmin = createClient(ENV.supabaseUrl, ENV.supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Create a Supabase client for a specific request (uses user's session)
export function createSupabaseClient(req: Request) {
  const authHeader = req.headers.authorization;
  const accessToken = authHeader?.replace("Bearer ", "");

  return createClient(ENV.supabaseUrl, ENV.supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    },
  });
}

// Get the current user from a request
export async function getAuthUser(req: Request) {
  const authHeader = req.headers.authorization;
  const accessToken = authHeader?.replace("Bearer ", "");

  if (!accessToken) {
    return null;
  }

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

// Upload file to Supabase Storage
export async function uploadToStorage(
  bucket: string,
  path: string,
  file: Buffer,
  contentType: string
) {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, file, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);

  return urlData.publicUrl;
}

// Delete file from Supabase Storage
export async function deleteFromStorage(bucket: string, path: string) {
  const { error } = await supabaseAdmin.storage.from(bucket).remove([path]);

  if (error) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}
