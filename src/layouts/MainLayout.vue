<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar v-if="$q.platform.is.desktop" class="q-py-sm">
        <!--          <q-btn @click="left = !left" flat round dense icon="menu" class="q-mr-sm" />-->
        <img class="cursor-pointer" src="icon.png" style="width: 3%" />
        <q-toolbar-title>
          <span
            class="float-left q-mt-xs text-h6 text-weight-bold"
            style="font-size: 17px"
            >Tubulu Catalogue</span
          >
        </q-toolbar-title>

        <q-btn
          flat
          round
          dense
          icon="eva-home-outline"
          class="q-mr-md"
          to="/"
        />
        <q-btn
          flat
          round
          dense
          icon="eva-file-text-outline"
          class="q-mr-md"
          to="/assignment"
        />
        <q-btn flat round dense icon="eva-person-outline" to="/admin" />
        <q-btn
          flat
          round
          dense
          icon="eva-log-out-outline"
          class="q-ml-xl"
          @click="logOut()"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { notify } from "../functions/notify";
export default {
  name: "MainLayout",
  data() {
    return {
      tab: "home",
    };
  },
  methods: {
    logOut() {
      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUserId");
      this.$router.push("/auth");
      notify("Success", "Logout Successful");
    },
  },
};
</script>
