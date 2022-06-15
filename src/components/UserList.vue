<template>
  <div class="team col-2">
    <div class="text-h6 text-bold q-ma-md text-center">{{ title }}</div>
    <div class="search">
      <q-input
        v-model="search"
        placeholder="Search User"
        @input="search.length ? '' : $emit('noSearch')"
        @keyup.enter="searchFields"
      >
        <template v-slot:append>
          <q-btn
            flat
            dense
            rounded
            color="primary"
            icon="send"
            @click="searchFields"
          />
        </template>
      </q-input>
    </div>
    <q-scroll-area style="height: 60vh">
      <q-infinite-scroll @load="loadUsers" :offset="50">
        <q-list bordered separator>
          <q-item v-for="(user, index) in users" :key="index" class="q-pa-md">
            <q-item-section avatar>
              <q-avatar
                color="primary"
                text-color="white"
                v-if="!user.avatarUrl"
              >
                {{ user.name[0].toUpperCase() }}
              </q-avatar>
              <q-avatar v-else>
                <img :src="user.avatarUrl" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ user.name }}</q-item-label>
              <q-item-label v-if="showEmail" caption lines="1">{{
                user.email
              }}</q-item-label>
            </q-item-section>

            <q-item-section side v-if="showDelete && currentUser != user._id">
              <q-btn
                flat
                dense
                icon="delete"
                color="negative"
                @click="deleteUser(user)"
              />
            </q-item-section>
          </q-item>
        </q-list>
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="40px" />
          </div>
        </template>
      </q-infinite-scroll>
    </q-scroll-area>
  </div>
</template>

<script>
import { notify } from "src/functions/notify";
export default {
  props: {
    title: {
      type: String,
      required: true,
      default: "",
    },
    searchField: {
      type: String,
      required: true,
      default: "",
    },
    users: {
      type: Array,
      required: true,
      default: [],
    },
    page: {
      type: Number,
      required: true,
      default: 1,
    },
    next: {
      type: Boolean,
      required: true,
      default: true,
    },
    authToken: {
      type: String,
      required: true,
      default: "",
    },
    showEmail: {
      type: Boolean,
      default: false,
    },
    showDelete: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      search: "",
      currentUser: "",
      size: 10,
    };
  },
  methods: {
    deleteUser(user) {
      this.$emit("deleteUser", user);
    },
    searchFields() {
      this.$emit("search", this.search);
    },
    loadUsers(index, done) {
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: "Bearer " + this.authToken,
          "Content-Type": "application/json",
        },
      };
      fetch(`${process.env.API}/users?page=${this.page + 1}`, requestOptions)
        .then((response) => response.json())
        .then((res) => {
          if (this.next) {
            this.$emit("loadUsers", {
              data: res.data,
              page: this.page + 1,
              next: res.next,
            });
            done();
          } else {
            done(true);
          }
        })
        .catch((error) => {
          console.log(error);
          notify("Failed", error.message);
        });
    },
  },
  created() {
    this.currentUser = localStorage.getItem("currentUserId");
  },
};
</script>
