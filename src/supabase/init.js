import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://juxpbiimmssazgkjwskq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1eHBiaWltbXNzYXpna2p3c2txIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDg5ODI0NTMsImV4cCI6MTk2NDU1ODQ1M30.oBPTogGLI0iXL4LSQcp2Y0rQiZ80GyVmxnNZGGiV2Z0";
export const supabase = createClient(supabaseUrl, supabaseKey);
