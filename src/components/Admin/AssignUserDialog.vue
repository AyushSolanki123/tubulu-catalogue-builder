<template>
  <q-card class="dialog-card">
    <div class="row q-pa-md bg-primary text-white">
      <div class="col">
        <div class="row justify-between">
          <div class="text-h6 text-weight-bold">Assign To</div>
          <q-btn round icon="close" flat @click="closeDialog" />
        </div>
      </div>
    </div>
    <div>
      <q-scroll-area style="height: 60vh">
        <q-infinite-scroll @load="loadUsers" :offset="50">
        <q-list class="q-pa-sm" separator>
          <q-item
            v-for="(user, index) in users"
            :key="index"
            clickable
            class="q-pa-sm"
            @click="selectedItems(user)"
          >
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
  </q-card>
</template>

<script>
import { notify } from "src/functions/notify";
export default {
  props: {  
    authToken: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      selected: false,
      page: 1,
      next: true,
      users: []
    };
  },
  methods: {
    closeDialog() {
      this.$emit("close");
    },
    async listUsers() {
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: "Bearer " + this.authToken,
          "Content-Type": "application/json",
        },
      };
      try {
        var data = await fetch(
          `${process.env.API}/users`,
          requestOptions
        );
        data = await data.json();
        this.users = data.data;
        this.next = data.next;
      } catch (err) {
        notify("Failed", err.message);
      }
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
            this.users = [...this.users, ...res.data];
            this.page += 1;
            this.next = res.next
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
    selectedItems(user) {
      this.$emit('assignUser', user);
      this.closeDialog();
    },
  },
  async created() {
    await this.listUsers()
  }
};
</script>

<style>
.card-class:active,
.card-class:hover,
.card-class:visited {
  border: 1px solid #3d57a3;
}
.card-class {
  border-radius: 10px;
  cursor: pointer;
}
</style>
