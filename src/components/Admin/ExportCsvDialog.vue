<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="dialog-card">
      <q-card-section class="header row justify-between bg-primary text-white">
        <div class="text-h6 text-bold">Export CSV</div>
        <div>
          <q-btn
            flat
            dense
            rounded
            icon="close"
            color="white"
            @click="closeDialog"
          />
        </div>
      </q-card-section>

      <q-card-section class="form">
        <div>
          <div class="text-subtitle1">Enter email to receive csv</div>
          <div>
            <q-input
              v-model.trim="email"
              outlined
              placeholder="Email"
              lazy-rules
              :rules="[
                (val) => isValidEmail(val) || 'Please enter Valid Email',
              ]"
            />
          </div>
        </div>
        <div class="row justify-end">
          <q-btn
            dense
            no-caps
            class="q-px-sm"
            label="Submit"
            color="primary"
            :disable="!isValidEmail(email)"
            @click="exportCsv"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    showDialog: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      email: "",
    };
  },
  methods: {
    isValidEmail(value) {
      const re =
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      return re.test(String(value).toLowerCase());
    },
    exportCsv() {
      this.$emit("exportCsv", this.email);
      this.email = "";
    },
    closeDialog() {
      this.$emit("closeDialog");
      this.email = "";
    },
  },
};
</script>
