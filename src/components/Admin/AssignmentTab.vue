<template>
  <q-card class="column q-pa-md">
    <div class="col-1">
      <div class="row justify-between">
        <div class="row justify-between">
          <q-input
            v-model="search"
            :placeholder="
              currentSearchType == 'USERS' ? 'Search Users' : searchField
            "
            @input="resetSearch"
            @keyup.enter="searchList"
          >
            <template v-slot:append>
              <q-btn
                flat
                dense
                rounded
                color="primary"
                icon="send"
                @click="searchList"
              />
            </template>
          </q-input>
          <div class="q-ml-md q-mt-md">
            <span>Search By:</span>
            <q-btn-dropdown color="primary" :label="currentSearchType" flat>
              <q-list style="min-width: 100px">
                <q-item clickable @click="selectSearchBy" v-close-popup>
                  <q-item-section>{{
                    isCategory ? categoryType : "PRODUCT"
                  }}</q-item-section>
                </q-item>
                <q-item
                  clickable
                  @click="currentSearchType = 'USERS'"
                  v-close-popup
                >
                  <q-item-section>USERS</q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
        </div>
        <div>
          <q-btn
            no-caps
            class="btn"
            color="primary"
            :label="!selectAll ? 'Select All' : 'Deselect All'"
            @click="assignAll"
          />
        </div>
      </div>
    </div>

    <div class="col-11 q-pa-md">
      <q-scroll-area
        class="full-width"
        style="height: 60vh"
        v-if="list.length > 0"
      >
        <q-infinite-scroll @load="loadList" class="row" :offset="50">
          <q-list
            v-for="(item, index) in list"
            :key="index"
            class="col-6 q-gutter-sm"
          >
            <q-item
              @click="assignItem(item)"
              class="q-pa-md q-ma-md row cursor-pointer card"
              :class="
                selectMultiple.find((i) => i._id == item._id) ? 'selected' : ''
              "
              clickable
            >
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white">
                  {{
                    isCategory
                      ? categoryType == "CATEGORY"
                        ? item.category[0].name[0].toUpperCase()
                        : categoryType == "SUBCATEGORY"
                        ? item.subCategory[0].name[0].toUpperCase()
                        : item.brand[0].name[0].toUpperCase()
                      : item.productName[0].toUpperCase()
                  }}
                </q-avatar>
              </q-item-section>

              <q-item-section class="q-ml-md">
                <q-item-label lines="1" class="text-h6" v-if="!isCategory">
                  {{ item.productName }}
                </q-item-label>
                <q-tooltip v-if="!isCategory">
                  {{ item.productName }}
                </q-tooltip>
                <div class="row justify-between" v-else>
                  <div>
                    <q-item-label lines="1" class="text-h6">
                      {{
                        categoryType == "CATEGORY"
                          ? item.category[0].name
                          : categoryType == "SUBCATEGORY"
                          ? item.subCategory[0].name
                          : item.brand[0].name
                      }}
                    </q-item-label>
                    <q-tooltip>
                      {{
                        categoryType == "CATEGORY"
                          ? item.category[0].name
                          : categoryType == "SUBCATEGORY"
                          ? item.subCategory[0].name
                          : item.brand[0].name
                      }}
                    </q-tooltip>
                  </div>
                  <div v-if="item.assignedUsers.length > 0">
                    <span v-if="item.assignedUsers[0]">
                      {{ item.assignedUsers[0].name }}
                    </span>
                    <q-tooltip v-if="item.assignedUsers[0]">
                      <span
                        v-for="(user, index) in item.assignedUsers"
                        :key="index"
                      >
                        {{ user.name }}
                        <q-tooltip>
                          {{ user.name }}
                        </q-tooltip>
                      </span>
                    </q-tooltip>
                  </div>
                </div>
                <div class="row justify-between">
                  <div>
                    <div class="text-caption text-primary" v-if="isCategory">
                      <div
                        v-if="
                          categoryType == 'SUBCATEGORY' && item.category.length
                        "
                      >
                        <q-breadcrumbs>
                          <q-breadcrumbs-el :label="item.category[0].name" />
                        </q-breadcrumbs>
                      </div>
                      <div v-else-if="categoryType == 'BRAND'">
                        <q-breadcrumbs>
                          <q-breadcrumbs-el
                            v-if="item.category.length"
                            :label="item.category[0].name"
                          />
                          <q-breadcrumbs-el
                            v-if="item.subCategory.length"
                            :label="item.subCategory[0].name"
                          />
                        </q-breadcrumbs>
                      </div>
                    </div>
                    <div class="text-caption text-primary" v-else>
                      <q-breadcrumbs v-if="!item.breadCrumbs">
                        <q-breadcrumbs-el
                          v-if="item.category"
                          :label="item.category.name"
                        />
                        <q-breadcrumbs-el v-else label=" " />
                        <q-breadcrumbs-el
                          v-if="item.subCategory"
                          :label="item.subCategory.name"
                        />
                        <q-breadcrumbs-el v-else label=" " />
                        <q-breadcrumbs-el
                          v-if="item.brand"
                          :label="item.brand.name"
                        />
                        <q-breadcrumbs-el v-else label=" " />
                      </q-breadcrumbs>
                      <div v-else>
                        {{ item.breadCrumbs }}
                      </div>
                    </div>
                  </div>
                  <div v-if="isCategory">Total Products: {{ item.count }}</div>
                </div>
              </q-item-section>
              <q-item-section
                class="text-black"
                side
                v-if="!isCategory && item.assignedTo"
              >
                {{ item.assignedTo.name }}
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
      <div class="flex flex-center" v-else>No Items to show</div>
    </div>
  </q-card>
</template>

<script>
import { notify } from "src/functions/notify";
export default {
  props: {
    list: {
      type: Array,
      required: true,
      default: [],
    },
    property: {
      type: Object,
      required: true,
      default: null,
    },
    searchField: {
      type: String,
      required: true,
      default: "",
    },
    isCategory: {
      type: Boolean,
      default: true,
    },
    categoryType: {
      type: String,
      default: "CATEGORY",
    },
    authToken: {
      type: String,
      required: true,
      default: "",
    },
  },
  data() {
    return {
      search: "",
      currentSearchType: this.isCategory ? this.categoryType : "PRODUCT",
      selectedItem: null,
      selectMultiple: [],
      selectAll: false,
      filteredList: [],
    };
  },
  methods: {
    resetSearch() {
      if (this.search.length == 0) {
        this.selectAll = false;
        this.$emit("noSearch");
      }
    },
    selectSearchBy() {
      if (this.isCategory) {
        this.currentSearchType = this.categoryType;
      } else {
        this.currentSearchType = "PRODUCT";
      }
      this.$root.$emit("resetList", {
        type: this.isCategory ? this.categoryType : "PRODUCT",
      });
    },
    assignAll() {
      this.selectAll = !this.selectAll;
      if (!this.selectAll) this.selectMultiple = [];
      else {
        this.selectMultiple = [...this.selectMultiple, ...this.list];
      }
      this.$emit("assignAll", this.list);
    },
    searchList() {
      if (this.search.length == 0) {
        this.selectAll = false;
        this.$emit("noSearch");
      } else {
        this.$emit("search", {
          search: this.search,
          searchBy: this.currentSearchType,
        });
      }
    },
    assignItem(item) {
      this.selectedItem = item;
      if (this.selectMultiple.find((i) => i._id == item._id)) {
        let it = this.selectMultiple.find((i) => i._id == item._id);
        let index = this.selectMultiple.indexOf(it);
        this.selectMultiple.splice(index, 1);
      } else {
        this.selectMultiple.push(item);
      }
      this.$emit("assignItem", this.selectMultiple);
    },
    loadList(index, done) {
      const requestOptions = {
        method: this.isCategory ? "POST" : "GET",
        headers: {
          Authorization: "Bearer " + this.authToken,
          "Content-Type": "application/json",
        },
      };
      var page = this.property.page;
      var next = this.property.next;
      var productUrl = `${process.env.API}/products/all?page=${page + 1}`;
      var categoryUrl = `${process.env.API}/products/categoryUsers?type=${
        this.categoryType
      }&page=${page + 1}`;
      if (this.search.length > 0) {
        page = this.property.searchPage;
        next = this.property.nextSearch;
        if (this.property.searchByUser == true) {
          productUrl = `${process.env.API}/products/search?search=${
            this.search
          }&page=${page + 1}`;
          categoryUrl = `${process.env.API}/products/categoryUsers?type=${
            this.categoryType
          }&search=${this.search}&page=${page + 1}&searchByUser=${
            this.property.searchByUser
          }`;
        } else {
          productUrl = `${process.env.API}/products/searchProducts?search=${
            this.search
          }&page=${page + 1}`;
          categoryUrl = `${process.env.API}/products/categoryUsers?type=${
            this.categoryType
          }&search=${this.search}&page=${page + 1}`;
        }
      }
      fetch(this.isCategory ? categoryUrl : productUrl, requestOptions)
        .then((response) => response.json())
        .then((res) => {
          if (next) {
            this.$emit("loadMore", {
              data: res.data,
              page: page + 1,
              next: res.next,
              search: this.search ? this.search : "",
            });
            done();
          } else {
            done(true);
          }
        })
        .catch((error) => {
          notify("Failed", error.message);
        });
    },
    selectAllFalse() {
      this.selectAll = false;
      this.selectMultiple = [];
    },
    userAssigned(data) {
      this.selectMultiple = [];
    },
  },
  created() {
    this.$root.$on("selectAllFalse", this.selectAllFalse);
    this.$root.$on("userAssigned", this.userAssigned);
  },
  beforeDestroy() {
    this.$root.$off("selectAllFalse", this.selectAllFalse);
    this.$root.$off("userAssigned", this.userAssigned);
  },
};
</script>

<style lang="scss">
.selected {
  border: 2px solid $primary;
}
.card {
  box-shadow: 0 1px 5px rgb(0 0 0 / 20%), 0 2px 2px rgb(0 0 0 / 14%),
    0 3px 1px -2px rgb(0 0 0 / 12%) !important;
  border-radius: 8px;
  min-width: 400px;
  vertical-align: top;
  background: #fff;
  position: relative;
}
</style>
