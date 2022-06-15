<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="dialog-card">
      <q-card-section class="header row justify-between bg-primary text-white">
        <div class="text-h6 text-bold">Edit Product</div>
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
                placeholder="Discount Price"
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

            <div class="text-subtitle1">Enter Weight</div>
            <div>
              <q-input
                v-model.trim="product.weight"
                label="Weight"
                outlined
                lazy-rules
              />
            </div>

            <div class="text-subtitle1">Enter Description</div>
            <div>
              <q-input
                type="textarea"
                v-model.trim="product.description"
                placeholder="Description"
                outlined
              />
            </div>

            <div class="text-subtitle1 q-mt-md">Enter Long Description</div>
            <div>
              <q-input
                type="textarea"
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
    productToEdit: {
      type: Object,
      default: null,
      required: true,
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
        quantity: 0,
        weight: "",
        discountPrice: 0,
        unit: {
          name: "",
          type: 0,
        },
        description: "",
        longDescription: "",
        breadcrumb: "",
      },
      closeProduct: {},
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
      this.$emit("editProduct", this.product);
    },
    resetData() {
      this.product = {
        productName: this.productToEdit.productName,
        category: this.productToEdit.category
          ? this.productToEdit.category.name
          : "",
        subCategory: this.productToEdit.subCategory
          ? this.productToEdit.subCategory.name
          : "",
        brand: this.productToEdit.brand ? this.productToEdit.brand.name : "",
        price: this.productToEdit.price,
        quantity: this.productToEdit.quantity,
        unit: {
          name: this.productToEdit.unit ? this.productToEdit.unit.unitName : "",
          type: this.productToEdit.unit ? this.productToEdit.unit.type : "",
        },
        discountedPrice: this.productToEdit.discountedPrice,
        weight: this.productToEdit.weight,
        description: this.productToEdit.description,
        longDescription: this.productToEdit.longDescription,
      };
      this.closeProduct = Object.assign(this.closeProduct, this.product);
    },
    closeDialog() {
      this.resetData();
      this.$emit("closeDialog");
    },
  },
  mounted() {
    this.resetData();
  },
};
</script>

<style lang="scss"></style>
