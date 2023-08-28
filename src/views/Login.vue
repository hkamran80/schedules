<script setup lang="ts">
import { ref, watch } from "vue";
import { supabase, getSupabaseSession } from "../composables/auth";
import Login from "./login/Login.vue";
import MFA from "./login/MFA.vue";
import Loading from "./login/Loading.vue";
import { useRouter } from "vue-router";
import { useMainStore } from "../stores/main";
import { Session } from "@supabase/supabase-js";

const { push } = useRouter();
const store = useMainStore();

const loginComplete = ref(false);
const ready = ref(false);
const showMFA = ref(false);
const session = ref<Session>()

const checkAALStatus = async () => {
    const { data, error } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

    if (error) {
        throw error;
    }

    const mfaStatus =
        data.nextLevel === "aal2" && data.nextLevel !== data.currentLevel;

    showMFA.value = mfaStatus;
    console.debug("MFA status:", mfaStatus);
    console.debug("Session status:", session.value);
    console.debug("Ready status:", ready.value);
    if (ready.value && !mfaStatus) {
        store.loadCustomSchedules();
        push("/");
    }
};

const setComplete = async () => {
    loginComplete.value = true;
    session.value = await getSupabaseSession();
};

watch(loginComplete, async () => {
    try {
        checkAALStatus();
    } finally {
        ready.value = true;
    }
});
</script>

<template>
    <div className="pt-16 md:pt-12">
        <div
            className="flex h-[80vh] flex-col justify-center py-12 sm:px-6 lg:px-8"
        >
            <div class="sm:mx-auto sm:w-full sm:max-w-md">
                <img
                    src="/assets/images/favicons/favicon-192.png"
                    alt="Schedules Logo"
                    height="50"
                    width="50"
                    class="mx-auto"
                />
                <h2
                    className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white"
                >
                    Schedules
                </h2>
                <p
                    className="mx-auto mt-2 max-w-sm text-center text-sm text-gray-600 dark:text-gray-400"
                >
                    Schedules uses a UNISON Technologies account for storing
                    your schedules
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div v-if="loginComplete && session">
                    <MFA
                        v-if="ready && showMFA"
                        :session="session"
                        @recheck="checkAALStatus"
                    />
                    <Loading v-else />
                </div>

                <Login v-else @complete="setComplete" />
            </div>
        </div>
    </div>
</template>
