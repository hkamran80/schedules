<script setup lang="ts">
import { Session } from "@supabase/supabase-js";
import { computed, ref } from "vue";
import { supabase } from "../../composables/auth";
import InputField from "../../components/InputField.vue";
import { useRouter } from "vue-router";

const props = defineProps<{ session: Session }>();
const emit = defineEmits(["recheck"]);

const { push } = useRouter();

const otp = ref("");
const otpErrorText = ref();
const preventProceed = computed(
    () => otp.value.trim().length !== 6 || isNaN(Number(otp)),
);

const factor = props.session.user.factors![0];

const verifyMFA = async () => {
    const { error } = await supabase.auth.mfa.challengeAndVerify({
        factorId: factor.id,
        code: otp.value,
    });

    if (error) {
        otpErrorText.value = "OTP code is incorrect";
    } else {
        emit("recheck");
    }
};

const logout = async () => {
    await supabase.auth.signOut();
    push("/");
};
</script>

<template>
    <div
        class="space-y-6 rounded-lg bg-white px-8 py-8 shadow dark:bg-ut-grey sm:px-10"
    >
        <InputField
            v-model="otp"
            type="text"
            placeholder="OTP Code"
            label="OTP Code"
            :input-props="{
                // inputMode: 'numeric',
                // autoComplete: 'one-time-code',
                // maxLength: 6,
                // onKeyDown: (event: KeyboardEvent) => {
                //     if (event.key === 'Enter' && !preventProceed) {
                //         verifyMFA();
                //     }
                // },
            }"
            required
            :error="otpErrorText"
            @keyup.enter="verifyMFA"
        />

        <div class="space-y-4">
            <button
                type="button"
                :class="[
                    'group relative flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white transition duration-300',
                    preventProceed
                        ? 'bg-gray-500'
                        : 'bg-pink-700 hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-pink-700 focus:ring-offset-2 dark:bg-pink-400 dark:focus:ring-pink-400',
                ]"
                :disabled="preventProceed"
                @click="verifyMFA"
            >
                Sign in
            </button>

            <button
                type="button"
                class="w-full text-center text-sm text-red-500"
                @click="logout"
            >
                Sign out
            </button>
        </div>
    </div>
</template>
