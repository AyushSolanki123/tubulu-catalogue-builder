<template>
  <q-page>
    <div class="q-pa-md">
      <q-card class="bg-white column main-card" v-if="!loading">
        <div class="assignment row">
          <UserList
            class="col-2 q-px-md"
            title="Manage Team"
            searchField="Search User"
            :users="filteredUsers"
            :authToken="authToken"
            :page="user.page"
            :next="user.next"
            :showDelete="true"
            :showEmail="true"
            @noSearch="filteredUsers = users"
            @deleteUser="deleteUser"
            @loadUsers="loadUsers"
            @search="searchUsers"
          />
          <div class="col-10 q-px-md">
            <Callouts
              v-if="userType == 'root'"
              :label1="'Add User'"
              :label4="'Export CSV'"
              :needButton1="false"
              :needButton2="false"
              :icon3="'eva-download-outline'"
              @Callout1="showRegisterUser = true"
              @Callout4="showExportCsv = true"
            />
            <div class="category">
              <div>
                <q-btn
                  v-if="userType == 'root'"
                  label="Assign"
                  color="primary"
                  @click="assign = true"
                  no-caps
                  class="btn float-right"
                />
                <div class="text-h6 text-bold q-ma-md text-center">
                  Manage Assignment
                </div>
                <AssignmentTabs
                  :authToken="authToken"
                  :product="product"
                  :category="category"
                  :subCategory="subCategory"
                  :brand="brand"
                  :products="filteredProducts"
                  :categories="filteredCategories"
                  :subCategories="filteredSubCategories"
                  :brands="filteredBrands"
                  @assignAll="assignAll"
                  @assignItem="assignItem"
                  @loadProducts="loadProducts"
                  @loadCategories="loadCategories"
                  @loadSubCategories="loadSubCategories"
                  @loadBrands="loadBrands"
                  @searchCategories="searchCategories"
                  @searchSubCategories="searchSubCategories"
                  @searchBrands="searchBrands"
                  @searchProducts="searchProducts"
                  @noSearchCategories="
                    filteredCategories = categories;
                    category.currentlySearch = false;
                  "
                  @noSearchSubcategories="
                    filteredSubCategories = subCategories;
                    subCategory.currentlySearch = false;
                  "
                  @noSearchBrands="
                    filteredBrands = brands;
                    brand.currentlySearch = false;
                  "
                  @noSearchProducts="filteredProducts = products"
                />
              </div>
            </div>
          </div>
        </div>
      </q-card>
    </div>
    <q-dialog v-model="assign" persistent>
      <AssignUserDialog
        :users="users"
        :authToken="authToken"
        @assignUser="assignUser"
        @close="assign = false"
      />
    </q-dialog>
    <RegisterUserDialog
      :showDialog="showRegisterUser"
      @closeDialog="showRegisterUser = false"
      @register="registerUser"
    />
    <ExportCsvDialog
      :showDialog="showExportCsv"
      @closeDialog="showExportCsv = false"
      @exportCsv="exportCsv"
    />
  </q-page>
</template>

<script>
import { notify } from "src/functions/notify";
import { dialog } from "src/functions/dialogs";
import { Loading } from "quasar";
import Callouts from "src/components/Callouts.vue";
import UserList from "src/components/UserList.vue";
import AssignUserDialog from "src/components/Admin/AssignUserDialog.vue";
import RegisterUserDialog from "src/components/Admin/RegisterUserDialog.vue";
import AssignmentTabs from "src/components/Admin/AssignmentTabs.vue";
import ExportCsvDialog from "src/components/Admin/ExportCsvDialog.vue";
export default {
  components: {
    Callouts,
    UserList,
    AssignUserDialog,
    RegisterUserDialog,
    AssignmentTabs,
    ExportCsvDialog,
  },
  data() {
    return {
      users: [],
      brands: [],
      userType: "",
      products: [],
      categories: [],
      subCategories: [],
      filteredUsers: [],
      filteredBrands: [],
      filteredProducts: [],
      filteredCategories: [],
      filteredSubCategories: [],
      assign: false,
      authToken: "",
      loading: true,
      selectedItem: null,
      selectedItems: null,
      showRegisterUser: false,
      showExportCsv: false,
      user: {
        next: true,
        nextSearch: true,
        searchPage: 1,
        page: 1,
        size: 10,
        search: "",
      },
      product: {
        next: true,
        nextSearch: true,
        searchByUser: false,
        searchPage: 1,
        page: 1,
        size: 10,
        search: "",
      },
      category: {
        next: true,
        nextSearch: true,
        currentlySearch: false,
        searchByUser: false,
        searchPage: 1,
        page: 1,
        size: 10,
        search: "",
      },
      brand: {
        next: true,
        nextSearch: true,
        currentlySearch: false,
        searchByUser: false,
        searchPage: 1,
        page: 1,
        size: 10,
        search: "",
      },
      subCategory: {
        next: true,
        nextSearch: true,
        currentlySearch: false,
        searchByUser: false,
        searchPage: 1,
        page: 1,
        size: 10,
        search: "",
      },
    };
  },
  methods: {
    exportCsv(email) {
      this.showExportCsv = false;
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail: email }),
      };
      fetch(`${process.env.API}/products/exportCsv`, requestOptions)
        .then((response) => response.json())
        .then((response) => {
          notify(
            "Success",
            "Importing in progress. Notify you via email when done"
          );
        })
        .catch((err) => {
          notify("Failed", err.message);
        });
    },
    async searchUsers(value) {
      this.user.search = value;
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.authToken}`,
          "Content-Type": "application/json",
        },
      };
      if (value.length) {
        Loading.show();
        var response = await fetch(
          `${process.env.API}/users/search?search=${value}`,
          requestOptions
        );
        response = await response.json();
        this.filteredUsers = response.filteredUsers;
        Loading.hide();
      }
    },
    async searchCategories(value) {
      this.category.search = value.search;
      this.category.searchByUser = value.searchBy == "USERS";
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.authToken}`,
          "Content-Type": "application/json",
        },
      };
      if (value.search.length) {
        Loading.show();
        var response = await fetch(
          `${process.env.API}/products/categoryUsers?search=${value.search}&type=CATEGORY&searchByUser=${this.category.searchByUser}`,
          requestOptions
        );
        response = await response.json();

        this.category.nextSearch = response.next;
        this.category.currentlySearch = true;
        this.filteredCategories = response.data;
        Loading.hide();
      }
    },
    async searchProducts(value) {
      this.product.search = value.search;
      this.product.searchByUser = value.searchBy == "USERS";
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.authToken}`,
          "Content-Type": "application/json",
        },
      };
      if (value.search.length) {
        Loading.show();
        let url = `${process.env.API}/products/searchProducts?search=${value.search}`;
        if (this.product.searchByUser)
          url = `${process.env.API}/products/search?search=${value.search}`;
        var response = await fetch(url, requestOptions);
        response = await response.json();
        this.filteredProducts = response.data;
        this.product.nextSearch = response.next;
        Loading.hide();
      }
    },
    async searchSubCategories(value) {
      this.subCategory.search = value.search;
      this.subCategory.searchByUser = value.searchBy == "USERS";
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.authToken}`,
          "Content-Type": "application/json",
        },
      };
      if (value.search.length) {
        Loading.show();
        var response = await fetch(
          `${process.env.API}/products/categoryUsers?search=${value.search}&type=SUBCATEGORY&searchByUser=${this.subCategory.searchByUser}`,
          requestOptions
        );
        response = await response.json();
        this.subCategory.nextSearch = response.next;
        this.filteredSubCategories = response.data;
        this.subCategory.currentlySearch = true;
        Loading.hide();
      }
    },
    async searchBrands(value) {
      this.brand.search = value.search;
      this.brand.searchByUser = value.searchBy == "USERS";
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.authToken}`,
          "Content-Type": "application/json",
        },
      };
      if (value.search.length) {
        Loading.show();
        var response = await fetch(
          `${process.env.API}/products/categoryUsers?search=${value.search}&type=BRAND&searchByUser=${this.brand.searchByUser}`,
          requestOptions
        );
        response = await response.json();
        this.brand.nextSearch = response.next;
        this.brand.currentlySearch = true;
        this.filteredBrands = response.data;
        Loading.hide();
      }
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
          `${process.env.API}/users?page=${this.user.page}`,
          requestOptions
        );
        data = await data.json();
        this.users = data.data;
        this.userType = localStorage.getItem("userType");
        this.filteredUsers = this.users;
      } catch (err) {
        notify("Failed", err.message);
      }
    },
    async listProducts() {
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: "Bearer " + this.authToken,
          "Content-Type": "application/json",
        },
      };
      try {
        var data = await fetch(
          `${process.env.API}/products/all`,
          requestOptions
        );
        data = await data.json();
        this.products = data.data;
        this.product.next = data.next;
        this.filteredProducts = this.products;
      } catch (error) {
        notify("Failed", error.message);
      }
    },
    async listCategories() {
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: "Bearer " + this.authToken,
          "Content-Type": "application/json",
        },
      };
      try {
        var data = await fetch(
          `${process.env.API}/products/categoryUsers?type=CATEGORY`,
          requestOptions
        );
        data = await data.json();
        this.categories = data.data;
        this.category.next = data.next;
        this.filteredCategories = this.categories;
      } catch (error) {
        notify("Failed", error.message);
      }
    },
    async listSubCategories() {
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: "Bearer " + this.authToken,
          "Content-Type": "application/json",
        },
      };
      try {
        var data = await fetch(
          `${process.env.API}/products/categoryUsers?type=SUBCATEGORY`,
          requestOptions
        );
        data = await data.json();
        this.subCategories = data.data;
        this.subCategory.next = data.next;
        this.filteredSubCategories = this.subCategories;
      } catch (error) {
        notify("Failed", error.message);
      }
    },
    async listBrands() {
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: "Bearer " + this.authToken,
          "Content-Type": "application/json",
        },
      };
      try {
        var data = await fetch(
          `${process.env.API}/products/categoryUsers?type=BRAND`,
          requestOptions
        );
        data = await data.json();
        this.brands = data.data;
        this.brand.next = data.next;
        this.filteredBrands = this.brands;
      } catch (error) {
        notify("Failed", error.message);
      }
    },
    deleteUser(user) {
      try {
        let input = {
          title: "Confirm Delete",
          message: "This user will be deleted",
        };
        dialog(input).onOk(() => {
          user.isDeleted = true;
          let index = this.users.indexOf(user);
          const requestOptions = {
            method: "DELETE",
            headers: {
              Authorization: "Bearer " + this.authToken,
              "Content-Type": "application/json",
            }
          };
          fetch(`${process.env.API}/users/${user._id}`, requestOptions)
            .then((response) => response.json())
            .then(() => {
              this.users.splice(index, 1);
              notify("Success", "User Deleted Successfully");
            })
            .catch((error) => {
              notify("Failed", error.message);
            });
        });
      } catch (err) {
        notify("Failed", err.message);
      }
    },
    registerUser(user) {
      this.showRegisterUser = false;
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      };
      fetch(`${process.env.API}/auth/register`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (!data.err) {
            this.users.unshift(data);
            notify("Success", "User Registered Successfully");
          } else
            throw new Error("Registration failed");
        })
        .catch((error) => {
          notify("Failed", error.message);
        });
    },
    loadUsers(value) {
      this.user.page = value.page;
      value.data.forEach((value) => {
        this.users.push(value);
      });
      this.user.next = value.next;
    },
    loadProducts(value) {
      if (value.search.length) {
        this.product.searchPage = value.page;
        this.product.nextSearch = value.next;
      } else {
        this.product.page = value.page;
        this.product.next = value.next;
      }
      value.data.forEach((product) => {
        if (value.search.length) {
          let prod = this.filteredProducts.find((p) => p._id == product._id);
          if (!prod) this.filteredProducts.push(product);
        }
        let prod = this.products.find((p) => p._id == product._id);
        if (!prod) this.products.push(product);
      });
      if (!value.search.length) this.filteredProducts = this.products;
    },
    loadBrands(value) {
      if (value.search.length) {
        this.brand.searchPage = value.page;
        this.brand.nextSearch = value.next;
      } else {
        this.brand.page = value.page;
        this.brand.next = value.next;
      }
      value.data.forEach((brand) => {
        if (value.search.length) this.filteredBrands.push(brand);
        this.brands.push(brand);
      });
      if (!value.search.length) this.filteredBrands = this.brands;
    },
    loadSubCategories(value) {
      if (value.search.length > 0) {
        this.subCategory.searchPage = value.page;
        this.subCategory.nextSearch = value.next;
      } else {
        this.subCategory.page = value.page;
        this.subCategory.next = value.next;
      }
      value.data.forEach((subCategory) => {
        if (value.search.length) this.filteredSubCategories.push(subCategory);
        this.subCategories.push(subCategory);
      });
      if (!value.search.length) this.filteredSubCategories = this.subCategories;
    },
    loadCategories(value) {
      if (value.search.length) {
        this.category.searchPage = value.page;
        this.category.nextSearch = value.next;
      } else {
        this.category.page = value.page;
        this.category.next = value.next;
      }
      value.data.forEach((category) => {
        if (value.search.length) this.filteredCategories.push(category);
        this.categories.push(category);
      });
      if (!value.search.length) this.filteredCategories = this.categories;
    },
    assignItem(value) {
      this.selectedItems = value;
      if (this.selectedItems.length == 1) this.selectedItem = value[0];
    },
    assignAll(value) {
      this.selectedItems = value;
    },
    async assignUser(user) {
      const requestOptions = {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + this.authToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ assignedTo: user }),
      };
      if (this.selectedItems.length > 1) {
        try {
          Loading.show();
          this.selectedItems.forEach(async (item) => {
            var type, id;
            if (item.count) {
              if (item.brand) {
                id = item.brand[0]._id;
                type = "BRAND";
                if (!this.brand.currentlySearch) {
                  var i = this.brands.find((brand) => brand._id == id);
                  var index = this.brands.indexOf(i);
                  this.brands[index].assignedUsers[0] = user;
                  this.filteredBrands = this.brands;
                } else {
                  var i = this.filteredBrands.find((brand) => brand._id == id);
                  var index = this.filteredBrands.indexOf(i);
                  this.filteredBrands[index].assignedUsers[0] = user;
                  index = this.brands.indexOf(
                    this.brands.find((brand) => brand._id == id)
                  );
                  this.brands[index].assignedUsers[0] = user;
                }
              } else if (item.subCategory) {
                id = item.subCategory[0]._id;
                type = "SUBCATEGORY";
                if (!this.subCategory.currentlySearch) {
                  var i = this.subCategories.find(
                    (subCategory) => subCategory._id == id
                  );
                  var index = this.subCategories.indexOf(i);
                  this.subCategories[index].assignedUsers[0] = user;
                  this.filteredSubCategories = this.subCategories;
                } else {
                  var i = this.filteredSubCategories.find(
                    (subCategory) => subCategory._id == id
                  );
                  var index = this.filteredSubCategories.indexOf(i);
                  this.filteredSubCategories[index].assignedUsers[0] = user;
                  i = this.subCategories.find(
                    (subCategory) => subCategory._id == id
                  );
                  index = this.subCategories.indexOf(i);
                  this.subCategories[index].assignedUsers[0] = user;
                }
              } else if (item.category) {
                id = item.category[0]._id;
                type = "CATEGORY";
                if (!this.category.currentlySearch) {
                  var i = this.categories.find(
                    (category) => category._id == id
                  );
                  var index = this.categories.indexOf(i);
                  this.categories[index].assignedUsers[0] = user;
                  this.filteredCategories = this.categories;
                } else {
                  var i = this.filteredCategories.find(
                    (category) => category._id == id
                  );
                  var index = this.filteredCategories.indexOf(i);
                  this.filteredCategories[index].assignedUsers[0] = user;
                  i = this.categories.find((category) => category._id == id);
                  index = this.categories.indexOf(i);
                  this.categories[index].assignedUsers[0] = user;
                }
              }
            }
            let productUrl = `${process.env.API}/products/${item._id}`;
            let categoryUrl = `${process.env.API}/productCategory/${id}`;
            var response = await fetch(
              item.count ? categoryUrl : productUrl,
              requestOptions
            );
            response = await response.json();
            if (!item.count) item.assignedTo = response.assignedTo;
            if (item.count) {
              // IF ITEM IS A CATEGORY / BRAND / SUBCATEGORY
              var options = {
                method: "POST",
                headers: {
                  Authorization: "Bearer " + this.authToken,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  type: type,
                  typeId: id,
                }),
              };
              response = await fetch(`${process.env.API}/products?size=0`, options); // FIND ALL PRODUCTS IN CATEGORY
              response = await response.json();
              response.data.forEach(async (product) => {
                var res = await fetch(
                  `${process.env.API}/products/${product._id}`,
                  requestOptions
                ); // UPDATE EACH PRODUCT
                res = await res.json();
                let prod = this.products.find(
                  (product) => product._id == res._id
                );
                let index = this.products.indexOf(prod);
                this.products.splice(index, 1);
                this.products.unshift(res);
              });
            }
          });
          Loading.hide();
          notify("Success", "User Assigned Successfully");
          this.$root.$emit("selectAllFalse", user);
        } catch (err) {
          console.log(err);
          Loading.hide();
          this.$root.$emit("selectAllFalse");
          notify("Failed", err.message);
        }
      } else {
        Loading.show();
        var type, id;
        if (this.selectedItem.count) {
          if (this.selectedItem.brand) {
            id = this.selectedItem.brand[0]._id;
            type = "BRAND";
            if (!this.brand.currentlySearch) {
              var i = this.brands.find((brand) => brand._id == id);
              var index = this.brands.indexOf(i);
              this.brands[index].assignedUsers[0] = user;
              this.filteredBrands = this.brands;
            } else {
              var i = this.filteredBrands.find((brand) => brand._id == id);
              var index = this.filteredBrands.indexOf(i);
              this.filteredBrands[index].assignedUsers[0] = user;
              index = this.brands.indexOf(
                this.brands.find((brand) => brand._id == id)
              );
              this.brands[index].assignedUsers[0] = user;
            }
          } else if (this.selectedItem.subCategory) {
            id = this.selectedItem.subCategory[0]._id;
            type = "SUBCATEGORY";
            if (!this.subCategory.currentlySearch) {
              var i = this.subCategories.find(
                (subCategory) => subCategory._id == id
              );
              var index = this.subCategories.indexOf(i);
              this.subCategories[index].assignedUsers[0] = user;
              this.filteredSubCategories = this.subCategories;
            } else {
              var i = this.filteredSubCategories.find(
                (subCategory) => subCategory._id == id
              );
              var index = this.filteredSubCategories.indexOf(i);
              this.filteredSubCategories[index].assignedUsers[0] = user;
              i = this.subCategories.find(
                (subCategory) => subCategory._id == id
              );
              index = this.subCategories.indexOf(i);
              this.subCategories[index].assignedUsers[0] = user;
            }
          } else if (this.selectedItem.category) {
            id = this.selectedItem.category[0]._id;
            type = "CATEGORY";
            if (!this.category.currentlySearch) {
              var i = this.categories.find((category) => category._id == id);
              var index = this.categories.indexOf(i);
              this.categories[index].assignedUsers[0] = user;
              this.filteredCategories = this.categories;
            } else {
              var i = this.filteredCategories.find(
                (category) => category._id == id
              );
              var index = this.filteredCategories.indexOf(i);
              this.filteredCategories[index].assignedUsers[0] = user;
              i = this.categories.find((category) => category._id == id);
              index = this.categories.indexOf(i);
              this.categories[index].assignedUsers[0] = user;
            }
          }
        }
        let productUrl = `${process.env.API}/products/${this.selectedItem._id}`;
        let categoryUrl = `${process.env.API}/productCategory/${id}`;
        try {
          var response = await fetch(
            this.selectedItem.count ? categoryUrl : productUrl,
            requestOptions
          );
          response = await response.json();
          if (!this.selectedItem.count) {
            let product = this.products.find(
              (product) => product._id == response._id
            );
            let index = this.products.indexOf(product);
            this.products.splice(index, 1);
            this.products.unshift(response);
            Loading.hide();
            this.$root.$emit("userAssigned", user);
            notify("Success", "User Assigned Successfully");
          } else {
            var options = {
              method: "POST",
              headers: {
                Authorization: "Bearer " + this.authToken,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                type: type,
                typeId: id,
              }),
            };
            response = await fetch(`${process.env.API}/products?size=0`, options); // FIND ALL PRODUCTS IN CATEGORY
            response = await response.json();
            var updatedProducts = [];
            response.data.forEach(async (product) => {
              var res = await fetch(
                `${process.env.API}/products/${product._id}`,
                requestOptions
              );
              res = await res.json();
              console.log(res)
              let prod = this.products.find(
                (product) => product._id == res._id
              );
              let index = this.products.indexOf(prod);
              this.products.splice(index, 1);
              this.products.unshift(res);
              updatedProducts.push(res);
            });
            Loading.hide();
            this.$root.$emit("userAssigned", user);
            notify("Success", "User Assigned Successfully");
          }
        } catch (err) {
          console.log(err);
          Loading.hide();
          this.$root.$emit("userAssigned", user);
          notify("Failed", err.message);
        }
      }
    },
    resetList(value) {
      if (value == "CATEGORY") this.filteredCategories = this.categories;
      else if (value == "SUBCATEGORY")
        this.filteredSubCategories = this.subCategories;
      else if (value == "BRAND") this.filteredBrands = this.brands;
      else this.filteredProducts = this.products;
    },
  },
  async created() {
    Loading.show();
    this.authToken = localStorage.getItem("authToken");
    await this.listUsers();
    await this.listProducts();
    await this.listCategories();
    await this.listSubCategories();
    await this.listBrands();
    Loading.hide();
    this.loading = false;
    this.$root.$on("resetList", this.resetList);
  },
  beforeDestroy() {
    this.$root.$off("resetList", this.resetList);
  },
};
</script>

<style lang="scss"></style>
