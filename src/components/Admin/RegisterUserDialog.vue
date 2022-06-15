<template>
    <q-dialog v-model="showDialog" persistent>
        <q-card class="dialog-card">
            <q-card-section class="header row justify-between bg-primary text-white">
                <div class="text-h6 text-bold">Register User</div>
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
                    <div class="text-subtitle1">Enter Username</div>
                    <div>
                        <q-input 
                            v-model.trim="user.name"
                            placeholder="Username"
                            :rules="[val => !!val || 'Field is Required']"
                            outlined
                            lazy-rules
                        />
                    </div>

                    <div class="text-subtitle1">Enter email</div>
                    <div>
                        <q-input 
                            v-model.trim="user.email"
                            outlined
                            placeholder="Email"
                            lazy-rules
                            :rules="[val => isValidEmail(val) || 'Please enter Valid Email']"
                        />
                    </div>

                    <div class="text-subtitle1">Enter Password</div>
                    <div>
                        <q-input 
                            v-model.trim="user.password"
                            outlined
                            type="password"
                            placeholder="Password"
                            :rules="[val => !!val && val.length >= 8 || 'Password should be atleast 8 characters long']"
                            lazy-rules
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
                        :disable="!user.name || !user.email || !user.password"
                        @click="register"
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
                default: false,
                required: true
            }
        },
        data() {
            return {
                user: {
                    name: '',
                    password: '',
                    email: '',
                    type: 'user'
                }
            }
        },
        methods: {
            isValidEmail(value) {
                const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                return re.test(String(value).toLowerCase());
            },

            register() {
                this.$emit('register', this.user);
                this.user = {
                    name: '',
                    password: '',
                    email: '',
                    type: 'user'
                }
            },

            closeDialog() {
                this.$emit('closeDialog');
                this.user = {
                    name: '',
                    password: '',
                    email: '',
                    type: 'user'
                }
            }
        }
    }
</script>

<style lang="scss">

</style>