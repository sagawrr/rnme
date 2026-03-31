import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

import { ENV } from '@/constants/config';

export const supabase = createClient(ENV.SUPABASE_URL ?? '', ENV.SUPABASE_PUBLISHABLE_KEY ?? '', {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
