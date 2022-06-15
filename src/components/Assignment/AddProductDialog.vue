<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="dialog-card">
      <q-card-section class="header row justify-between bg-primary text-white">
        <div class="text-h6 text-bold">Add Product</div>
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

      <q-scroll-area style="height: 60vh">
        <q-card-section class="form">
          <div>
            <div class="text-subtitle1">Enter Product Name *</div>
            <div>
              <q-input
                v-model.trim="product.productName"
                placeholder="Product Name"
                :rules="[(val) => !!val || 'Field is Required']"
                outlined
                lazy-rules
              />
            </div>

            <div class="text-subtitle1">Enter Category *</div>
            <div>
              <q-input
                v-model.trim="product.category"
                placeholder="Category Name"
                :rules="[(val) => !!val || 'Field is Required']"
                outlined
                lazy-rules
              />
            </div>

            <div class="text-subtitle1">Enter Subcategory *</div>
            <div>
              <q-input
                v-model.trim="product.subCategory"
                placeholder="Subcategory Name"
                :rules="[(val) => !!val || 'Field is Required']"
                outlined
                lazy-rules
              />
            </div>

            <div class="text-subtitle1">Enter Brand *</div>
            <div>
              <q-input
                v-model.trim="product.brand"
                placeholder="Brand Name"
                :rules="[(val) => !!val || 'Field is Required']"
                outlined
                lazy-rules
              />
            </div>

            <div class="text-subtitle1">Enter Price *</div>
            <div>
              <q-input
                v-model.trim="product.price"
                placeholder="Price"
                type="number"
                :rules="[(val) => !!val || 'Field is Required']"
                outlined
                lazy-rules
              />
            </div>

            <div class="text-subtitle1">Enter Discounted Price *</div>
            <div>
              <q-input
                v-model.trim="product.discountedPrice"
                placeholder="Price"
                type="number"
                :rules="[(val) => !!val || 'Field is Required']"
                outlined
                lazy-rules
              />
            </div>

            <div class="text-subtitle1">Enter Quantity *</div>
            <div>
              <q-input
                v-model.trim="product.quantity"
                placeholder="Quantity"
                type="number"
                :rules="[(val) => !!val || 'Field is Required']"
                outlined
                lazy-rules
              />
            </div>

            <div class="text-subtitle1">Select Unit *</div>
            <div>
              <q-select
                v-model.trim="product.unit.name"
                label="Unit"
                @input="selectUnit"
                :options="units"
                behavior="menu"
                :rules="[(val) => !!val || 'Field is Required']"
                outlined
                lazy-rules
              />
            </div>

            <div class="text-subtitle1">Enter Description</div>
            <div>
              <q-input
                v-model.trim="product.description"
                placeholder="Description"
                outlined
              />
            </div>

            <div class="text-subtitle1 q-mt-md">Enter Long Description</div>
            <div>
              <q-input
                v-model.trim="product.longDescription"
                placeholder="Long Description"
                outlined
              />
            </div>
          </div>
          <div class="row justify-end q-mt-md">
            <q-btn
              label="Submit"
              :disable="
                !product.productName ||
                !product.category ||
                !product.subCategory ||
                !product.brand ||
                !product.price ||
                !product.discountedPrice ||
                !product.unit
              "
              class="q-px-sm"
              color="primary"
              @click="submitForm"
              no-caps
            />
          </div>
        </q-card-section>
      </q-scroll-area>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    showDialog: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      product: {
        productName: "",
        category: "",
        subCategory: "",
        brand: "",
        price: 0,
        discountedPrice: 0,
        quantity: 0,
        unit: {
          name: "",
          type: 0,
        },
        description: "",
        longDescription: "",
      },
      units: [
        "FIXED",
        "MINUTE",
        "HOUR",
        "DAY",
        "WEEK",
        "MONTH",
        "YEAR",
        "KILOGRAM",
        "POUND",
        "PERSON",
        "KILOMETER",
      ],
    };
  },
  methods: {
    selectUnit() {
      this.product.unit.type = this.units.indexOf(this.product.unit.name);
    },
    submitForm() {
      this.$emit("addProduct", this.product);
      this.product = {
        productName: "",
        category: {
          name: "",
        },
        subCategory: {
          name: "",
        },
        brand: "",
        price: 0,
        discountedPrice: 0,
        unit: "",
        description: "",
        longDescription: "",
      };
    },
    closeDialog() {
      this.$emit("closeDialog");
      this.product = {
        productName: "",
        category: {
          name: "",
        },
        subCategory: {
          name: "",
        },
        brand: "",
        price: 0,
        discountedPrice: 0,
        unit: "",
        description: "",
        longDescription: "",
      };
    },
  },
};
</script>

<style lang="scss"></style>
