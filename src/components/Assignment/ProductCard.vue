<template>
  <q-card class="product-card q-mt-md" flat bordered>
    <q-card-section class="row justify-between">
      <div class="text-h5 text-bold">{{ product.productName }}</div>
      <div class="row text-subtitle1">
        <div class="row">
          <div class="text-weight-bold">Source:</div>
          <div class="q-ml-md">{{ product.source }}</div>
        </div>
      </div>
    </q-card-section>

    <div class="row justify-between">
      <q-card-section class="q-gutter-sm text-subtitle1 justify-between">
        <div>
          <div class="row">
            <div class="text-weight-bold">Category:</div>
            <div class="q-ml-md">{{ product.category ? product.category.name : '' }}</div>
          </div>
          <div class="row">
            <div class="text-weight-bold">Sub Category:</div>
            <div class="q-ml-md">{{ product.subCategory ? product.subCategory.name : '' }}</div>
          </div>
          <div class="row">
            <div class="text-weight-bold">Brand:</div>
            <div class="q-ml-md">{{ product.brand ? product.brand.name : '' }}</div>
          </div>
        </div>
        <div>
          <div class="row">
            <div class="text-weight-bold">Price:</div>
            <div class="q-ml-md">{{ product.price }}</div>
          </div>
          <div class="row">
            <div class="text-weight-bold">Discounted Price:</div>
            <div class="q-ml-md">{{ product.discountedPrice }}</div>
          </div>
          <div class="row">
            <div class="text-weight-bold">Unit:</div>
            <div class="q-ml-md" v-if="product.unit">{{ product.unit.unitName }}</div>
          </div>
          <div class="row">
            <div class="text-weight-bold">Quantity:</div>
            <div class="q-ml-md">{{ product.quantity }}</div>
          </div>
          <div class="row">
            <div class="text-weight-bold">Weight:</div>
            <div class="q-ml-md">{{ product.weight }}</div>
          </div>
        </div>
      </q-card-section>
      <div class="row text-subtitle1">
        <div class="text-weight-bold">Status:</div>
        <div
          class="q-mx-md"
          :class="
            product.status == 'APPROVED'
              ? 'text-positive'
              : product.status == 'REJECTED'
              ? 'text-negative'
              : product.status == 'DUPLICATE'
              ? 'text-warning'
              : 'text-info'
          "
        >
          {{ product.status }}
        </div>
      </div>
    </div>

    <q-card-section class="q-gutter-sm text-subtitle1">
      <div>
        <div class="row">
          <div class="text-weight-bold">Description:</div>
          <div class="q-ml-md">{{ product.description }}</div>
        </div>
        <div class="row">
          <div class="text-weight-bold">Long Description:</div>
          <div class="q-ml-md">{{ product.longDescription }}</div>
        </div>
        <div class="row">
          <div class="text-weight-bold">Bread Crumbs:</div>
          <div class="q-ml-md">{{ product.breadCrumbs }}</div>
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-actions align="right" class="q-pa-md">
      <q-btn
        dense
        no-caps
        push
        label="Edit"
        icon="edit"
        @click="showEditProductDialog = true"
        color="primary"
        class="q-pa-xs"
      />
    </q-card-actions>

    <EditProductDialog
      :showDialog="showEditProductDialog"
      :productToEdit="product"
      @closeDialog="showEditProductDialog = false"
      @editProduct="editProduct"
    />
  </q-card>
</template>

<script>
import EditProductDialog from "./EditProductDialog.vue";
export default {
  components: {
    EditProductDialog,
  },
  props: {
    product: {
      type: Object,
      default: {}
    },
  },
  data() {
    return {
      showEditProductDialog: false,
    };
  },
  methods: {
    editProduct(product) {
      this.$emit("editProduct", product);
      this.showEditProductDialog = false;
    },
  },
};
</script>

<style lang="scss">
.product-card {
  border-radius: 16px;
}
</style>
