import { createClient } from "@supabase/supabase-js";
import { asyncComputed } from "@vueuse/core";
import { useRoute, useRouter } from "vue-router";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getSupabaseSession = async () => {
    const localSession = await supabase.auth.getSession();
    if (localSession.error === null && localSession.data.session) {
        return localSession.data.session;
    }
};

export const supabaseSession = asyncComputed(async () => getSupabaseSession());