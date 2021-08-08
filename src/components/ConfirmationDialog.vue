<template>
    <v-card>
        <v-card-title v-text="title" />

        <v-card-actions>
            <v-spacer />
            <v-btn
                text
                color="success"
                v-text="actionButtons.cancel.title"
                @click="closeDialog"
            />
            <v-btn
                text
                color="error"
                v-text="actionButtons.confirm.title"
                @click="confirmationCallback"
            />
        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
import { ConfirmationButton } from "@/structures/dialogs";
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
    props: {
        title: { type: String, required: true, default: "Confirmation" },
        confirmationId: { type: String, required: true, default: true },
        buttons: {
            type: Array as () => ConfirmationButton[],
            required: false,
            default: function() {
                return { cancel: "Cancel", confirm: "Confirm" };
            },
            validator: function(buttons: ConfirmationButton[]) {
                const places = buttons.map(
                    (button: ConfirmationButton) => button.place
                );

                return (
                    places.length === 2 &&
                    places.indexOf("cancel") >= -1 &&
                    places.indexOf("confirm") >= -1 &&
                    buttons.find(
                        (button: ConfirmationButton) =>
                            button.place === "confirm"
                    )?.callbackName !== undefined
                );
            },
        },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setup(props: any, { emit }: { emit: any }) {
        const closeDialog = () => emit("close");

        const actionButtons = {
            confirm: props.buttons.find(
                (button: ConfirmationButton) => button.place === "confirm"
            ),
            cancel: props.buttons.find(
                (button: ConfirmationButton) => button.place === "cancel"
            ),
        };

        const confirmationCallback = () => {
            emit("close");
            emit(actionButtons.confirm.callbackName, props.confirmationId);
        };

        return {
            actionButtons,
            confirmationCallback,
            closeDialog,
        };
    },
});
</script>
