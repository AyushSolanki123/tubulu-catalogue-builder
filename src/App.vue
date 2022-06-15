<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
import { Loading } from 'quasar';
import { notify } from 'src/functions/notify';
export default {
  name: 'App',
  methods: {
    logOut() {
      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUserId");
      this.$router.push("/auth");
    },
    checkLoginStatus() {
      var authToken = localStorage.getItem("authToken");
      if (!authToken) {
        this.$router.push("/auth");
      } else {
        var requestOptions = {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          }
        }
        fetch(`${process.env.API}/auth/status/${authToken}`, requestOptions)
          .then((response) => response.json())
          .then((status) => {
            if (!status.status) {
              this.logOut();
              Loading.hide();
              notify('Failed', 'Session Expired, Please Login Successfully');
            }
          })
          .catch((err) => {});
      }
    }
  },
  created() {
    this.checkLoginStatus();
  }
}
</script>
