<script setup lang="ts">
import { slugify } from "@hkamran/utility-strings";
import { InputHTMLAttributes, ref } from "vue";

const props = defineProps<{
    type: "text" | "number" | "password" | "email";
    placeholder: string;
    label: string;
    modelValue: string | number | undefined;
    inputProps?: Partial<
        | "inputMode"
        | Omit<
              InputHTMLAttributes,
              | "type"
              | "placeholder"
              | "disabled"
              | "value"
              | "required"
              | "onChange"
              | "readOnly"
              | "step"
          >
    >;
    error?: string | boolean;
    className?: string;
    required?: boolean;
    readonly?: boolean;
    disabled?: boolean;
}>();
const emit = defineEmits(["update:modelValue"]);

const inputId = ref(`${slugify(props.label)}-input`);
</script>

<template>
    <div
        :class="['w-full items-center', props.className ? props.className : '']"
    >
        <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
        <label
            :for="inputId"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            v-text="props.label"
        />

        <div class="relative mt-1 rounded-md">
            <input
                :id="inputId"
                :type="props.type"
                :placeholder="props.placeholder"
                :class="[
                    'relative w-full appearance-none rounded-lg border-gray-300 bg-white px-4 py-2 text-sm placeholder-gray-400 outline-none focus:outline-none dark:border-gray-700 dark:bg-ut-grey-light',
                    !props.disabled
                        ? 'focus:border-pink-700 focus:ring focus:ring-pink-700 dark:focus:border-pink-400 dark:focus:ring-pink-400'
                        : '',
                    props.error ? '˝border-red-500 ring ring-red-500' : '',
                ]"
                :value="modelValue"
                v-bind="props.inputProps"
                @input="
                    $emit(
                        'update:modelValue',
                        ($event.target as HTMLInputElement).value,
                    )
                "
            />
        </div>

        <p
            v-if="props.error && typeof props.error === 'string'"
            class="mt-2 text-xs text-red-600 dark:text-red-400"
            v-text="props.error"
        />
    </div>
</template>
