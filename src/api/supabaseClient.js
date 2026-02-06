import { createClient } from "@supabase/supabase-js";

// તમારો Supabase પ્રોજેક્ટ URL
const SUPABASE_URL = "https://epsmgeiqjuybbmggmkaf.supabase.co";

// તમારી Anon Key (જે તમે આપી છે તે)
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwc21nZWlxanV5YmJtZ2dta2FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyODM0MDEsImV4cCI6MjA4NTg1OTQwMX0.HKkOPbyL50EF2lPK4UZ-xOTUUWTBv3r1VEGTYyOnwfU";

// Supabase Client બનાવવો
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
