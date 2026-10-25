"use client";
import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_PUBLIC_KEY, SUPABASE_URL } from "./env";

let client: ReturnType<typeof createBrowserClient> | null = null;

/** Cliente del navegador (comparte la sesión por cookies). Usado para subir imágenes a Storage. */
export function browserClient() {
  if (!client) client = createBrowserClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
  return client;
}
