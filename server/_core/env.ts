export const ENV = {
  // Supabase configuration
  supabaseUrl: process.env.SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? "",
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",

  // Database
  databaseUrl: process.env.DATABASE_URL ?? "",

  // App configuration
  appUrl: process.env.APP_URL ?? "http://localhost:3000",
  isProduction: process.env.NODE_ENV === "production",

  // Admin configuration (comma-separated list of admin emails)
  adminEmails: (process.env.ADMIN_EMAILS ?? "").split(",").filter(Boolean),

  // Optional: OpenAI for AI features
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
};
