<template>
  <q-page class="q-pa-md">
    <q-card class="productDetails q-pa-md main-card row" v-if="!loading">
      <div class="col-2 q-px-md">
        <div>
          <div class="search">
            <q-input
              v-model="search"
              placeholder="Search Product"
              @input="searchInput"
              @keyup.enter="searchProducts"
            >
              <template v-slot:append>
                <q-btn
                  flat
                  dense
                  rounded
                  color="primary"
                  icon="send"
                  @click="searchProducts"
                />
              </template>
            </q-input>
          </div>
          <q-scroll-area :style="`height: 100vh;`">
            <q-infinite-scroll
              @load="loadProducts"
              :offset="50"
              ref="infiniteScroll"
            >
              <q-list bordered separator>
                <q-item
                  v-for="(product, index) in filteredProducts"
                  :key="index"
                  class="q-pa-md"
                  clickable
                  @click="setCurrentProduct(product)"
                >
                  <q-item-section avatar>
                    <q-avatar
                      v-if="product.status == 'APPROVED'"
                      color="positive"
                      text-color="white"
                    >
                      <q-icon name="eva-checkmark-outline" />
                    </q-avatar>
                    <q-avatar
                      v-else-if="product.status == 'REJECTED'"
                      color="negative"
                      text-color="white"
                    >
                      <q-icon name="eva-close-outline" />
                    </q-avatar>
                    <q-avatar
                      v-else-if="product.status == 'DUPLICATE'"
                      color="warning"
                      text-color="white"
                    >
                      <q-icon name="eva-alert-triangle-outline" />
                    </q-avatar>
                    <q-avatar v-else color="info" text-color="white">
                      P
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label lines="1">{{
                      product.productName
                    }}</q-item-label>
                    <q-tooltip>
                      {{ product.productName }}
                    </q-tooltip>
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
      </div>
      <div class="column col-10">
        <Callouts
          @Callout1="addProductDialog = true"
          @Callout2="statusChanged('APPROVED')"
          @Callout3="statusChanged('REJECTED')"
          @Callout4="statusChanged('DUPLICATE')"
          @filterProduct="filterProductsByStatus"
          :isFilter="true"
          :label1="'Add Product'"
          :label2="'Accept'"
          :label3="'Reject'"
          :label4="'Mark Duplicate'"
          :icon1="'eva-checkmark-outline'"
          :icon2="'eva-close-outline'"
          :icon3="'eva-alert-triangle-outline'"
        />
        <div
          class="row product-details-card q-gutter-x-md"
          v-if="!loadSingleProduct"
        >
          <div class="images col-4">
            <div class="column">
              <div>
                <q-btn
                  @click="removeImage(slide)"
                  icon="eva-trash-2-outline"
                  flat
                  dense
                  class="float-right"
                  color="red-7"
                  no-caps
                />
                <q-btn
                  @click="editImagedialog = true"
                  icon="eva-crop-outline"
                  flat
                  dense
                  class="float-right"
                  color="primary"
                  no-caps
                />
                <q-file
                  @input="getImage"
                  v-show="false"
                  ref="file"
                  accept="image/*"
                  v-model="imagesUpload"
                  multiple
                  clearable
                ></q-file>
                <q-btn
                  @click="pickFile()"
                  icon="eva-plus-outline"
                  flat
                  dense
                  class="float-right"
                  color="primary"
                  no-caps
                />

                <q-dialog v-model="editImagedialog" persistent>
                  <EditImageDialog
                    :showDialog="editImagedialog"
                    :authToken="authToken"
                    :currentProduct="currentProduct"
                    :currentImageIndex="slide"
                    :images="
                      currentProduct.imageUrls ? currentProduct.imageUrls : []
                    "
                    @closeDialog="editImagedialog = false"
                  />
                </q-dialog>
                <q-input
                  outlined
                  v-model="image"
                  type="file"
                  style="display: none"
                  bg-color="brand"
                  label="Select Image"
                  ref="image"
                  @input="convertImage"
                />
              </div>
              <div style="width: 400px" v-if="currentProduct">
                <q-carousel
                  v-if="currentProduct.imageUrls"
                  swipeable
                  animated
                  v-model="slide"
                  thumbnails
                  infinite
                >
                  <q-carousel-slide
                    v-for="(image, index) in currentProduct.imageUrls"
                    :key="index"
                    :img-src="image"
                    :name="index"
                  ></q-carousel-slide>
                </q-carousel>
                <div v-else class="text-center">No images to display</div>
              </div>
            </div>
          </div>
          <div class="details col-7" v-if="currentProduct">
            <ProductCard :product="currentProduct" @editProduct="editProduct" />
          </div>
        </div>
        <div class="similarProducts q-px-md q-mt-md" v-if="!loadSingleProduct">
          <div class="row">
            <div class="text-h6 text-bold">Similar Products</div>
          </div>
          <div class="search row">
            <q-input
              v-model="searchSimilar"
              placeholder="Search Similar Product"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <q-carousel
            v-model="latest_slide"
            transition-prev="slide-right"
            transition-next="slide-left"
            swipeable
            animated
            control-color="primary"
            padding
            arrows
            height="260px"
            class="rounded-borders full-width"
          >
            <q-carousel-slide v-for="(val, idx) in [1]" :name="val" :key="idx">
              <q-list
                class="row items-center q-gutter-xs"
                v-if="filteredSimilarProduct"
              >
                <div
                  clickable
                  v-for="(product, index) in filteredSimilarProduct"
                  class="q-pa-sm q-mr-md col cursor-pointer"
                  :key="index"
                  @click="setCurrentProduct(product.product)"
                >
                  <div class="row justify-around">
                    <q-avatar
                      size="100px"
                      square
                      v-if="product.product.imageUrls.length"
                    >
                      <img :src="product.product.imageUrls[0]" />
                    </q-avatar>
                    <q-avatar
                      size="100px"
                      square
                      color="primary"
                      text-color="white"
                      v-else
                    >
                      <div class="text-caption text-wrap text-center">
                        No Image Found
                      </div>
                    </q-avatar>
                  </div>

                  <div class="q-mt-sm q-pa-sm text-center">
                    <q-item-label class="text-subtitle1 text-bold">{{
                      product.product.productName
                    }}</q-item-label>
                    <q-item-label class="text-caption"
                      >Similarity: {{ product.score * 100 }}%</q-item-label
                    >
                    <q-item-label lines="1" class="text-caption">
                      Status:
                      <span
                        v-if="product.product.status == 'APPROVED'"
                        class="text-positive"
                      >
                        {{ product.product.status }}
                      </span>
                      <span
                        v-else-if="product.product.status == 'REJECTED'"
                        class="text-negative"
                      >
                        {{ product.product.status }}
                      </span>
                      <span
                        v-else-if="product.product.status == 'DUPLICATE'"
                        class="text-warning"
                      >
                        {{ product.product.status }}
                      </span>
                      <span v-else class="text-info">
                        {{ product.product.status }}
                      </span>
                    </q-item-label>
                  </div>
                </div>
              </q-list>
              <div class="text-h6 text-bold text-center" v-else>
                <div v-if="currentProduct">
                  No Similar Products for {{ currentProduct.productName }}
                </div>
                <div v-else>No Products Assigned to you!!</div>
              </div>
            </q-carousel-slide>
          </q-carousel>
        </div>
      </div>
    </q-card>
    <AddProductDialog
      :showDialog="addProductDialog"
      @closeDialog="addProductDialog = false"
      @addProduct="addProduct"
    />
  </q-page>
</template>

<script>
import { notify } from "src/functions/notify";
import { dialog } from "src/functions/dialogs";
import getCurrentUser from "../functions/getCurrentUser";
import Callouts from "src/components/Callouts.vue";
import ProductCard from "src/components/Assignment/ProductCard.vue";
import AddProductDialog from "src/components/Assignment/AddProductDialog.vue";
import "tui-color-picker/dist/tui-color-picker.css";
import "tui-image-editor/dist/tui-image-editor.css";
import { ImageEditor } from "@toast-ui/vue-image-editor";
import EditImageDialog from "src/components/Assignment/EditImageDialog.vue";
import { Loading } from "quasar";

export default {
  components: {
    Callouts,
    ProductCard,
    AddProductDialog,
    "tui-image-editor": ImageEditor,
    EditImageDialog,
  },
  data() {
    return {
      imagesUpload: [],
      useDefaultUI: true,
      loading: true,
      options: {
        // for tui-image-editor component's "options" prop
        cssMaxWidth: 700,
        cssMaxHeight: 500,
      },
      page: 1,
      filterPage: 1,
      filterSearchPage: 1,
      searchPage: 1,
      size: 10,
      isFilter: false,
      status: "",
      next: true,
      filterNext: true,
      filterSearchNext: true,
      searchNext: true,
      authToken: "",
      latest_slide: 1,
      currentProduct: {},
      loadSingleProduct: true,
      filteredProducts: [],
      addProductDialog: false,
      editImagedialog: false,
      search: "",
      isSearch: false,
      searchSimilar: "",
      image: null,
      finalImage: null,
      slide: 0,
      products: [],
      columns: [],
      data: [],
      user: {},
      images: [
        "https://cdn.quasar.dev/img/mountains.jpg",
        "https://cdn.quasar.dev/img/parallax1.jpg",
        "https://cdn.quasar.dev/img/parallax2.jpg",
        "https://cdn.quasar.dev/img/quasar.jpg",
        null,
      ],
    };
  },
  computed: {
    filteredSimilarProduct() {
      if (this.currentProduct.similarProducts) {
        return this.currentProduct.similarProducts.filter((product) => {
          return product.product.productName
            .toLowerCase()
            .match(this.searchSimilar.toLowerCase());
        });
      } else {
        return null;
      }
    },
  },
  methods: {
    searchInput() {
      if (!this.search.length) {
        this.filteredProducts = this.products;
        this.$root.$emit("noSearchFilter");
      }
    },
    async setCurrentProduct(product) {
      Loading.show();
      this.loadSingleProduct = true;
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: "Bearer " + this.authToken,
          "Content-Type": "application/json",
        },
      };
      fetch(`${process.env.API}/products/${product._id}`, requestOptions)
        .then((response) => response.json())
        .then((response) => {
          if (response.product) {
            this.currentProduct = response.product;
            if (response.similarProducts)
              this.currentProduct.similarProducts = response.similarProducts;
            this.slide = 0;
            Loading.hide();
            this.loadSingleProduct = false;
          } else {
            throw new Error("Product not assigned to you");
          }
        })
        .catch((err) => {
          Loading.hide();
          this.loadSingleProduct = false;
          notify("Failed", "Product not assigned to you");
        });
    },
    convertImage() {
      let that = this;
      if (this.image) {
        let file = this.image[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        let fileType = file.type.split("/")[0];
        if (fileType == "image") {
          var kBytes = file.size / 1024;
          var mBytes = kBytes / 1024;
          if (mBytes < 2) {
            reader.onload = () => {
              that.finalImage = reader.result;
            };
            this.images.push(this.finalImage);
          } else {
            notify("Warning", "Image size should be less than 2 MB");
          }
        } else {
          notify("Warning", "Only image file is allowed");
        }
      }
    },
    removeImage(slide) {
      let input = {
        title: "Confirm Delete",
        message: "This image will be deleted",
      };
      dialog(input)
        .onOk(() => {
          var temp = JSON.parse(JSON.stringify(this.currentProduct.imageUrls));
          temp.splice(slide, 1);
          const axios = require("axios");
          axios
            .put(
              `${process.env.API}/products/deleteImage/${this.currentProduct._id}`,
              {
                imageUrls: temp,
              }
            )
            .then((response) => {
              this.currentProduct.imageUrls = response.data.imageUrls;
              this.slide = 0;
            })
            .catch((error) => {
              notify("Failed", error.message);
              console.log(error);
            });
        })
        .onCancel(() => {
          this.slide = 0;
        });
    },
    pickFile() {
      this.$refs.file.pickFiles();
    },
    async getImage(imagesUpload) {
      let that = this;
      Loading.show();
      imagesUpload.forEach((element) => {
        var reader = new FileReader();
        reader.readAsDataURL(element);
        reader.onload = async function () {
          const axios = require("axios");
          await axios
            .post(`${process.env.API}/products/uploadImage`, {
              imageUrl: reader.result,
              imageName: `${
                that.currentProduct.productName
              }_${Date.now()}.jpeg`,
              productId: that.currentProduct._id,
            })
            .then(function (response) {
              that.currentProduct.imageUrls.unshift(response.data.image);
            })
            .catch(function (error) {
              console.log(error);
            });
        };
      });
      Loading.hide();
      this.imagesUpload = [];
    },
    addProduct(val) {
      this.addProductDialog = false;
      var requestBody = {
        product: {
          productName: val.productName,
          price: val.price,
          quantity: val.quantity,
          description: val.description,
          longDescription: val.longDescription,
          discountedPrice: val.discountedPrice,
          insertedBy: this.user.name,
          createdBy: this.user.name,
          imageUrls: [],
        },
        unit: {
          sourceName: val.unit.name,
          unitName: val.unit.name,
          type: val.unit.type,
        },
        category: {
          name: val.category,
          type: "CATEGORY",
        },
        subCategory: {
          name: val.subCategory,
          type: "SUBCATEGORY",
        },
        brand: {
          name: val.brand,
          type: "BRAND",
        },
      };
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: "Bearer " + this.authToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      };
      Loading.show();
      fetch(`${process.env.API}/products/addProducts`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          this.products.unshift(data);
          notify("Success", "Product Added Successfully");
          this.addProductDialog = false;
          Loading.hide();
        })
        .catch((error) => {
          Loading.hide();
          notify("Failed", error.message);
        });
    },
    async listProducts() {
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: "Bearer " + this.authToken,
          "Content-Type": "application/json",
        },
      };
      try {
        var response = await fetch(
          `${process.env.API}/products?page=${this.page}&size=${this.size}`,
          requestOptions
        );
        response = await response.json();
        this.products = response.data;
      } catch (error) {
        console.log(error);
        notify("Failed", error.message);
      }
    },
    statusChanged(status) {
      var index = this.products.indexOf(this.currentProduct);
      const body = {
        status: status,
        statusChangedBy: this.user,
      };
      const requestOptions = {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + this.authToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      };
      fetch(
        `${process.env.API}/products/${this.currentProduct._id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          this.currentProduct.status = status;
          var prod = this.products.find(
            (p) => p._id == this.currentProduct._id
          );
          index = this.products.indexOf(prod);
          this.products[index].status = status;
          notify("Success", "Status Changed Successfully");
        })
        .catch((error) => {
          notify("Failed", error.message);
        });
    },
    async loadProducts(index, done) {
      Loading.show();
      var requestOptions = {
        method: "POST",
        headers: {
          Authorization: "Bearer " + this.authToken,
          "Content-Type": "application/json",
        },
      };
      if (!this.search.length) {
        if (!this.isFilter) {
          fetch(
            `${process.env.API}/products?page=${this.page + 1}&size=${
              this.size
            }`,
            requestOptions
          )
            .then((response) => response.json())
            .then((res) => {
              if (this.next) {
                this.products.push(...res.data);
                this.filteredProducts = this.products;
                this.page += 1;
                this.next = res.next;
                done();
              } else {
                done(true);
              }
            });
        } else {
          await this.loadFilterProducts(index, done);
        }
      } else {
        if (!this.isFilter) {
          requestOptions = {
            method: "GET",
            headers: {
              Authorization: "Bearer " + this.authToken,
              "Content-Type": "application/json",
            },
          };
          fetch(
            `${process.env.API}/products/searchProducts?search=${
              this.search
            }&page=${this.searchPage + 1}`,
            requestOptions
          )
            .then((response) => response.json())
            .then((res) => {
              if (this.searchNext) {
                this.filteredProducts.push(...res.data);
                this.searchPage += 1;
                this.searchNext = res.next;
                done();
              } else {
                done(true);
              }
            });
        } else {
          await this.loadFilterProducts(index, done);
        }
      }
      Loading.hide();
    },
    async searchProducts() {
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.authToken}`,
          "Content-Type": "application/json",
        },
      };
      if (this.search.length) {
        Loading.show();
        if (this.status.length) {
          this.filterSearchPage = 1;
          this.filterSearchNext = true;
        }
        var response = await fetch(
          `${process.env.API}/products/searchProducts?search=${
            this.search
          }&status=${this.status.length ? this.status : ""}`,
          requestOptions
        );
        response = await response.json();
        this.filteredProducts = response.data;
        if (this.status.length) this.filterSearchNext = response.next;
        else this.searchNext = response.next;
        Loading.hide();
      }
    },
    editProduct(val) {
      var requestBody = {
        product: {
          productName: val.productName,
          price: val.price,
          quantity: val.quantity,
          weight: val.weight,
          discountedPrice: val.discountPrice,
          description: val.description,
          longDescription: val.longDescription,
        },
        unit: {
          sourceName: val.unit.name,
          unitName: val.unit.name,
          type: val.unit.type,
        },
        category: {
          name: val.category,
        },
        subCategory: {
          name: val.subCategory,
        },
        brand: {
          name: val.brand,
        },
      };
      const requestOptions = {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + this.authToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      };
      Loading.show();
      fetch(
        `${process.env.API}/products/${this.currentProduct._id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          let similarProducts = this.currentProduct.similarProducts;
          let product = this.products.find((prod) => prod._id == data._id);
          let index = this.products.indexOf(product);
          this.currentProduct = data;
          this.currentProduct.similarProducts = similarProducts;
          this.products.splice(index, 1);
          this.products.unshift(data);
          Loading.hide();
          notify("Success", "Product Edited Successfully");
        })
        .catch((error) => {
          notify("Failed", error.message);
        });
    },
    slideUpdate({ x, y }) {
      let index = this.currentProduct.imageUrls.indexOf(y);
      this.currentProduct.imageUrls[index] = x;
    },
    async filterProductsByStatus(status) {
      this.status = status;
      this.filterPage = 1;
      this.filterNext = true;
      this.filterSearchPage = 1;
      this.filterSearchNext = true;
      this.search = "";
      Loading.show();
      this.isFilter = true;
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: "Bearer " + this.authToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: this.status }),
      };
      try {
        var response = await fetch(
          `${process.env.API}/products`,
          requestOptions
        );
        response = await response.json();
        this.filteredProducts = response.data;
        this.filterNext = response.next;
        Loading.hide();
      } catch (err) {
        console.log(err);
        notify("Failed", err.message);
        this.isFilter = false;
        Loading.hide();
      }
    },
    async loadFilterProducts(index, done) {
      Loading.show();
      if (this.search.length) {
        try {
          var requestOptions = {
            method: "GET",
            headers: {
              Authorization: "Bearer " + this.authToken,
              "Content-Type": "application/json",
            },
          };
          var response = await fetch(
            `${process.env.API}/products/searchProducts?search=${
              this.search
            }&status=${this.status}&page=${this.filterSearchPage + 1}`,
            requestOptions
          );
          response = await response.json();
          if (this.filterSearchNext) {
            this.filteredProducts = [
              ...this.filteredProducts,
              ...response.data,
            ];
            this.filterSearchNext = response.next;
            this.filterSearchPage += 1;
            done();
          } else {
            done(true);
          }
        } catch (err) {
          console.log(err);
          notify("Failed", err.message);
          this.isFilter = false;
          Loading.hide();
        }
      } else {
        requestOptions = {
          method: "POST",
          headers: {
            Authorization: "Bearer " + this.authToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: this.status }),
        };
        try {
          var response = await fetch(
            `${process.env.API}/products?page=${this.filterPage + 1}`,
            requestOptions
          );
          response = await response.json();
          console.log(this.filterNext);
          if (this.filterNext) {
            this.filteredProducts = [
              ...this.filteredProducts,
              ...response.data,
            ];
            this.filterNext = response.next;
            this.filterPage += 1;
            done();
          } else {
            done(true);
          }
          Loading.hide();
        } catch (err) {
          console.log(err);
          notify("Failed", err.message);
          this.isFilter = false;
          Loading.hide();
        }
      }
    },
  },
  async created() {
    Loading.show();
    this.authToken = localStorage.getItem("authToken");
    this.user = await getCurrentUser();
    await this.listProducts();
    await this.setCurrentProduct(this.products[0]);
    this.filteredProducts = this.products;
    this.loading = false;
    Loading.hide();
    this.$root.$on("cropImageEvent", this.slideUpdate);
  },
  beforeDestroy() {
    this.$root.$off("cropImageEvent", this.slideUpdate);
  },
};
</script>

<style lang="scss">
.product-details-card {
  width: 100%;
}
</style>
