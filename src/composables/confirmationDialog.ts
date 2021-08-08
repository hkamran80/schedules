import { ref } from "@vue/composition-api";
import { ConfirmationButton } from "@/structures/dialogs";

export function loadConfirmationDialog() {
    const confirmationProps = ref({
        visible: false,
        title: "",
        id: "",
        buttons: [] as ConfirmationButton[],
    });

    const confirmationValue = ref(false);

    const openConfirmationDialog = (
        title: string,
        confirmationId: string,
        buttons: ConfirmationButton[]
    ) => {
        confirmationProps.value.title = title;
        confirmationProps.value.id = confirmationId;
        confirmationProps.value.buttons = buttons;
        confirmationProps.value.visible = true;
    };
    const closeConfirmationDialog = () => {
        confirmationProps.value.visible = false;
        confirmationProps.value.title = "";
        confirmationProps.value.id = "";
    };

    return {
        confirmationProps,
        confirmationValue,
        openConfirmationDialog,
        closeConfirmationDialog,
    };
}
