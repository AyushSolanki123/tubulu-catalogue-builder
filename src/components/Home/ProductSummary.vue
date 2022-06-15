<template>
  <div class="q-pa-md">
    <q-scroll-area style="height: 40vh" class="full-width">
      <div class="row">
        <q-list
          v-for="(user, index) in users"
          :key="index"
          class="q-pa-md col-md-3"
        >
          <q-item class="shadow-5 card q-card q-pa-sm">
            <div class="col">
              <div class="row q-pl-md">
                <q-item-section avatar>
                  <q-avatar
                    size="xl"
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

                <q-item-section class="text-h6 text-bold row col">
                  <q-item-label class="row" lines="1">{{
                    user.name
                  }}</q-item-label>
                  <q-item-label lines="1" class="text-caption row"
                    >Total: {{ user.length }}
                  </q-item-label>
                </q-item-section>

                <q-item-section>
                  <q-circular-progress
                    show-value
                    font-size="12px"
                    :value="user.progress * 100"
                    size="55px"
                    :thickness="0.25"
                    color="secondary"
                    track-color="grey-3"
                    class=""
                  >
                    {{ (user.progress * 100).toFixed(1) }}%
                  </q-circular-progress>
                </q-item-section>
              </div>

              <div
                class="space-between row text-body2 text-weight-bold q-py-sm"
              >
                <div class="col q-pl-md">
                  Reviewed:
                  <span class="text-body2">{{
                    user.length - user.status.pending
                  }}</span>
                </div>
                <div class="col">
                  Pending:
                  <span class="text-body2">{{ user.status.pending }}</span>
                </div>
              </div>

              <div>
                <div class="row q-pl-md">
                  <div class="text-subtitle2 text-weight-medium col">
                    <q-badge rounded color="positive" /> Approved
                  </div>
                  <div class="col-6 q-mr-sm q-mt-sm">
                    <q-linear-progress
                      color="positive"
                      size="md"
                      rounded
                      :value="user.status.approved / user.length"
                      v-if="user.length"
                      ><q-tooltip>{{
                        user.status.approved
                      }}</q-tooltip></q-linear-progress
                    >
                    <q-linear-progress
                      color="positive"
                      size="md"
                      rounded
                      :value="user.length"
                      v-else
                      ><q-tooltip>{{
                        user.status.approved
                      }}</q-tooltip></q-linear-progress
                    >
                  </div>
                </div>

                <div class="row q-mt-md q-pl-md">
                  <div class="text-subtitle2 text-weight-medium col">
                    <q-badge rounded color="warning" /> Duplicates
                  </div>
                  <div class="col-6 q-mr-sm q-mt-sm">
                    <q-linear-progress
                      color="warning"
                      size="md"
                      rounded
                      :value="user.status.duplicate / user.length"
                      v-if="user.length"
                      ><q-tooltip>{{
                        user.status.duplicate
                      }}</q-tooltip></q-linear-progress
                    >
                    <q-linear-progress
                      color="warning"
                      size="md"
                      rounded
                      :value="user.length"
                      v-else
                      ><q-tooltip>{{
                        user.status.duplicate
                      }}</q-tooltip></q-linear-progress
                    >
                  </div>
                </div>

                <div class="row q-mt-md q-pl-md">
                  <div class="text-subtitle2 text-weight-medium col">
                    <q-badge rounded color="negative" /> Rejected
                  </div>
                  <div class="col-6 q-mr-sm q-mt-sm">
                    <q-linear-progress
                      color="negative"
                      size="md"
                      rounded
                      :value="user.status.rejected / user.length"
                      v-if="user.length"
                      ><q-tooltip>{{
                        user.status.rejected
                      }}</q-tooltip></q-linear-progress
                    >
                    <q-linear-progress
                      color="negative"
                      size="md"
                      rounded
                      :value="user.length"
                      v-else
                      ><q-tooltip>{{
                        user.status.rejected
                      }}</q-tooltip></q-linear-progress
                    >
                  </div>
                </div>
              </div>
            </div>
          </q-item>
        </q-list>
      </div>
    </q-scroll-area>
  </div>
</template>

<script>
export default {
  props: {
    users: {
      type: Array,
      default: [],
    },
    property: {
      type: Object,
      default: null,
    },
    authToken: {
      type: String,
      default: "",
    },
  },
  methods: {
    loadUsers(index, done) {
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: "Bearer " + this.authToken,
          "Content-Type": "application/json",
        },
      };
      fetch(
        `${process.env.API}/users?page=${this.property.page + 1}&size=${
          this.property.size
        }`,
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          if (this.property.next) {
            this.$emit("loadUsers", {
              data: data.data,
              page: this.property.page + 1,
              next: data.next,
            });
            done();
          } else {
            done(true);
          }
        });
    },
  },
};
</script>

<style lang="scss">
.card {
  border-radius: 12px;
}
</style>
