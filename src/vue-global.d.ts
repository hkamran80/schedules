import Vue from "vue";

declare module "vue/types/vue" {
    interface Vue {
        $developmentMode: string;
        $edgeMode: string;
    }
}
