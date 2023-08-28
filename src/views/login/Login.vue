<script setup lang="ts">
import { ref } from "vue";
import InputField from "../../components/InputField.vue";
import { supabase } from "../../composables/auth";

const emit = defineEmits(["complete"]);

const emailInput = ref("");
const passwordInput = ref("");
const error = ref<string | undefined>();

const login = async () => {
    const response = await supabase.auth.signInWithPassword({
        email: emailInput.value,
        password: passwordInput.value,
    });
    console.debug(response);

    if (response.error) {
        if (response.error.message === "Invalid login credentials") {
            error.value = "Incorrect email/password combination";
        } else {
            error.value = response.error.message;
        }
    } else if (response.data.user && response.data.session) {
        emit("complete");
    }
};
</script>

<template>
    <form
        class="space-y-6 rounded-lg bg-white px-8 py-8 shadow dark:bg-ut-grey sm:px-10"
    >
        <InputField
            v-model="emailInput"
            type="email"
            :input-props="{ autocomplete: 'email' }"
            placeholder="Email"
            label="Email"
            :error="error"
            required
        />

        <InputField
            v-model="passwordInput"
            type="password"
            :input-props="{ autocomplete: 'current-password' }"
            placeholder="Password"
            label="Password"
            :error="error"
            required
            @keyup.enter="login"
        />

        <div>
            <button
                type="button"
                :class="[
                    'group relative flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white transition duration-300',
                    emailInput.trim() === '' || passwordInput.trim() === ''
                        ? 'bg-gray-500'
                        : 'bg-pink-700 hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-pink-700 focus:ring-offset-2 dark:bg-pink-400 dark:focus:ring-pink-400',
                ]"
                :disabled="
                    emailInput.trim() === '' || passwordInput.trim() === ''
                "
                @click="login"
            >
                Sign in
            </button>
        </div>

        <p class="text-xs text-gray-700 dark:text-gray-300">
            To create an account or reset your password, please visit the
            <a
                class="underline transition-colors duration-150 ease-in-out hover:text-pink-700 dark:hover:text-pink-500"
                href="https://beta-account.unisontech.org"
                target="_blank"
                rel="noopener noreferrer"
                >UT Account portal</a
            >.
        </p>
    </form>
</template>
