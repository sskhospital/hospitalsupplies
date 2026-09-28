import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zduecibgqkzynjaelcwv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkdWVjaWJncWt6eW5qYWVsY3d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1Nzk1MDQsImV4cCI6MjEwNjE1NTUwNH0.yZvX74CuzunWTD65uPlF1zfmWTBY0RR0ZBbIi3rb4JY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
