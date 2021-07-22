<template>
  <Modal :title="title">
    <p v-html="text" />
    <div class="flex justify-end space-x-4">
      <Button @click="hide">Cancel</Button>
      <div v-if="!dangerBtn">
        <PrimaryButton @click="handler">{{ action }}</PrimaryButton>
      </div>
      <div v-else>
        <DangerButton @click="handler">{{ action }}</DangerButton>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/Modals/Modal";
import PrimaryButton from "@/components/Elements/PrimaryButton";
import Button from "@/components/Elements/Button";
import DangerButton from "@/components/Elements/DangerButton";

export default {
  name: "Dialog",
  components: { Button, DangerButton, Modal, PrimaryButton },
  props: {
    title: {
      type: String,
      default: "Confirm"
    },
    text: {
      type: String
    },
    action: {
      type: String,
      default: "Confirm"
    },
    dangerBtn: {
      type: Boolean,
      default: false
    },
    handler: {
      type: Function
    }
  },
  methods: {
    hide() {
      this.$modal.hide("dialog");
    }
  }
};
</script>

<style scoped></style>
