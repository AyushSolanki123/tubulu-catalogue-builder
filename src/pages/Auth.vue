<template>
  <q-page class="flex flex-center">
    <q-card class="row my-card q-pa-none q-ma-none shadow-24">
      <q-card-section
        class="col-md-4 col-lg-4 col-sm-12 col-xs-12 float-left items-center row"
        style="background-color: #1f509e"
      >
        <div class="text-center flex flex-center full-width">
          <div>
            <div>
              <div><img src="icon.png" style="width: 33%" /></div>
            </div>
            <div class="text-weight-bolder text-white text-h5">
              Tubulu Catalogue
            </div>
            <div class="text-subtitle-1 text-white">Your one stop solution</div>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="col-md-8 col-lg-8 col-sm-12 sol-xs-12 float-left">
        <q-card-section>
          <p class="text-weight-bolder login-card-text">
            {{ isForgot ? "Reset Password" : "Login" }}
          </p>
        </q-card-section>
        <q-card-section>
          <q-form class="q-gutter-md">
            <!-- LOGIN FORM START -->
            <div v-if="!isForgot && !resetPassword">
              <div class="text-weight-bolder text-grey">Email</div>
              <q-input
                dense
                class="q-ma-none q-ml-md"
                v-model.trim="login.email"
                lazy-rules
                :rules="[
                  (val) => isValidEmail(val) || 'Please enter Valid Email',
                ]"
                placeholder="Email"
              >
                <template v-slot:prepend>
                  <q-icon name="eva-email-outline" />
                </template>
              </q-input>
              <div class="text-weight-bolder text-grey">Password</div>
              <q-input
                dense
                class="q-ma-none q-ml-md"
                v-model.trim="login.password"
                lazy-rules
                :rules="[(val) => !!val || 'Field is Required']"
                :type="isPwd ? 'password' : 'text'"
                placeholder="Password"
              >
                <template v-slot:prepend>
                  <q-icon name="eva-lock-outline" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </div>
            <!-- LOGIN FORM END  -->

            <!-- FORGOT PASSWORD FORM START -->
            <div v-else-if="isForgot && !resetPassword">
              <div>
                <div class="text-weight-bolder text-grey">Email</div>
                <q-input
                  dense
                  class="q-ma-none q-ml-md"
                  v-model.trim="login.email"
                  lazy-rules
                  :rules="[
                    (val) => isValidEmail(val) || 'Please enter Valid Email',
                  ]"
                  placeholder="Email"
                >
                  <template v-slot:prepend>
                    <q-icon name="eva-email-outline" />
                  </template>
                </q-input>
              </div>
              <div v-if="isOTP">
                <div class="text-weight-bolder text-grey">OTP</div>
                <q-input
                  dense
                  class="q-ma-none q-ml-md"
                  v-model.trim="otp"
                  mask="####"
                  masked-value
                  lazy-rules
                  :rules="[(val) => !!val || 'Field is Required']"
                  placeholder="OTP"
                >
                  <template v-slot:prepend>
                    <q-icon name="eva-lock-outline" />
                  </template>
                </q-input>
              </div>
            </div>
            <div v-else>
              <div class="text-weight-bolder text-grey">Enter Password</div>
              <q-input
                dense
                class="q-ma-none q-ml-md"
                v-model.trim="password.first"
                lazy-rules
                type="password"
                :rules="[(val) => !!val || 'Field is Required']"
                placeholder="Enter Password"
              >
                <template v-slot:prepend>
                  <q-icon name="eva-email-outline" />
                </template>
              </q-input>
              <div class="text-weight-bolder text-grey">Confirm Password</div>
              <q-input
                dense
                class="q-ma-none q-ml-md"
                v-model.trim="password.second"
                lazy-rules
                type="password"
                :rules="[
                  (val) =>
                    (!!val && val == password.first) ||
                    'Passwords do not Match',
                ]"
                placeholder="Confirm Password"
              >
                <template v-slot:prepend>
                  <q-icon name="eva-lock-outline" />
                </template>
              </q-input>
            </div>
            <!-- FORGOT PASSWORD FOMR END  -->
          </q-form>
        </q-card-section>
        <q-card-actions>
          <div class="row full-width justify-between items-center">
            <div>
              <q-btn
                dense
                flat
                v-if="!isForgot"
                no-caps
                color="primary"
                label="Forgot Password?"
                @click="isForgot = true"
              />
              <q-btn
                dense
                flat
                v-else
                no-caps
                color="primary"
                label="Back"
                @click="back"
              />
            </div>
            <div>
              <q-btn
                v-if="!isForgot && !resetPassword && !isOTP"
                flat
                size="md"
                color="primary"
                label="Login"
                dense
                no-caps
                :disable="!login.email || !login.password"
                @click="loginRequest"
              />
              <q-btn
                v-else-if="isForgot && !resetPassword && !isOTP"
                flat
                size="md"
                color="primary"
                label="Next"
                no-caps
                :disable="!login.email"
                @click="sendResetToken"
              />
              <q-btn
                v-else-if="isForgot && !resetPassword && isOTP"
                flat
                size="md"
                color="primary"
                label="Next"
                no-caps
                :disable="!login.email || !otp"
                @click="generateResetPasswordAuthToken"
              />
              <q-btn
                v-else
                flat
                size="md"
                color="primary"
                label="Submit"
                no-caps
                :disable="!password.first || !password.second"
                @click="updateUser"
              />
            </div>
          </div>
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { notify } from "../functions/notify";
export default {
  data() {
    return {
      login: {
        email: "",
        password: "",
      },
      password: {
        first: "",
        second: "",
      },
      otp: "",
      resOTP: "",
      authToken: "",
      user: {},
      isPwd: true,
      isForgot: false,
      isOTP: false,
      resetPassword: false,
    };
  },
  methods: {
    back() {
      this.isForgot = false;
      this.isOTP = false;
      this.resetPassword = false;
    },
    isValidEmail(value) {
      const re =
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      return re.test(String(value).toLowerCase());
    },

    loginRequest() {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.login),
      };
      fetch(`${process.env.API}/auth/login`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data.status) {
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("currentUserId", data.user.id);
            localStorage.setItem("userType", data.user.type);
            this.$router.push("/");
            notify("Success", "Login successfully");
          } else {
            throw new Error("Login Failed");
          }
        })
        .catch((error) => {
          notify("Failed", "Login Failed");
          console.log(error);
        });
    },

    sendResetToken() {
      fetch(`${process.env.API}/auth/sendResetToken/${this.login.email}`)
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          if (!res.error) {
            this.isOTP = true;
            this.resOTP = res.token;
            notify("Warning", "Otp sent at entered email");
          } else {
            notify("Failed", "User Does not exist");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    generateResetPasswordAuthToken() {
      if (this.otp == this.resOTP) {
        fetch(
          `${process.env.API}/auth/forgotPassword/${this.login.email}&${this.otp}`
        )
          .then((response) => response.json())
          .then((data) => {
            this.authToken = data.token;
            this.user = data.user;
            this.resetPassword = true;
          })
          .catch((err) => notify("Failed", err.message));
      } else {
        notify("Failed", "Entered OTP is incorrect");
      }
    },

    updateUser() {
      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.authToken}`,
        },
        body: JSON.stringify({ password: this.password.first }),
      };
      fetch(`${process.env.API}/users/${this.user.id}`, requestOptions)
        .then((response) => response.json())
        .then(() => {
          this.isForgot = false;
          this.isOTP = false;
          this.resetPassword = false;
          notify("Success", "Password changed Successfully");
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>

<style lang="scss">
.login-card {
  margin: 0 auto;
  border-radius: 12px;
}
.login-card-text-label {
  margin-top: auto;
  margin-bottom: auto;
}
.login-card-text {
  font-size: 28px;
  text-align: center;
}
.my-card {
  height: 30%;
  width: 45%;
}
</style>
