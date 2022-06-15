<template>
    <div>
        <q-tabs
            v-model="tab"
            narrow-indicator
            dense
            no-caps
            class="bg-primary tabs text-bold q-py-xs"
            align="justify"
        >
            <q-tab class="text-white" name="category" label="Category" />
            <q-tab class="text-white" name="subcategory" label="Subcategory" />
            <q-tab class="text-white" name="brand" label="Brand" />
            <q-tab class="text-white" name="product" label="Product" />
        </q-tabs>    

        <q-tab-panels v-model="tab">
            <q-tab-panel name="category">
                <AssignmentTab 
                    :list="categories"
                    :property="category"
                    :authToken="authToken"
                    searchField="Search Categories"
                    @search="searchCategories"
                    @noSearch="$emit('noSearchCategories')"
                    @loadMore="loadCategories"
                    @assignItem="assignItem"
                    @assignAll="assignAll"
                />
            </q-tab-panel>
            <q-tab-panel name="subcategory">
                <AssignmentTab 
                    :list="subCategories"
                    :authToken="authToken"
                    :property="subCategory"
                    categoryType="SUBCATEGORY"
                    searchField="Search Subcategories"
                    @search="searchSubCategories"
                    @noSearch="$emit('noSearchSubcategories')"
                    @loadMore="loadSubCategories"
                    @assignItem="assignItem"
                    @assignAll="assignAll"
                />
            </q-tab-panel>
            <q-tab-panel name="brand">
                <AssignmentTab 
                    :list="brands"
                    :property="brand"
                    :authToken="authToken"
                    categoryType="BRAND"
                    searchField="Search Brands"
                    @search="searchBrands"
                    @noSearch="$emit('noSearchBrands')"
                    @loadMore="loadBrands"
                    @assignItem="assignItem"
                    @assignAll="assignAll"
                />
            </q-tab-panel>
            <q-tab-panel name="product">
                <AssignmentTab 
                    :list="products"
                    :property="product"
                    :authToken="authToken"
                    :isCategory="false"
                    searchField="Search Products"
                    @search="searchProducts"
                    @noSearch="$emit('noSearchProducts')"
                    @loadMore="loadProducts"
                    @assignItem="assignItem"
                    @assignAll="assignAll"
                />
            </q-tab-panel>
        </q-tab-panels>        
    </div>    
</template>

<script>
    import AssignmentTab from './AssignmentTab.vue'
    export default {
        components: { AssignmentTab },
        props: {
            categories: {
                type: Array,
                required: true,
                default: () => []
            },
            subCategories: {
                type: Array,
                required: true,
                default: () => []
            },
            products: {
                type: Array,
                required: true,
                default: () => []
            },
            brands: {
                type: Array,
                required: true,
                default: () => []
            },
            product: {
                type: Object,
                required: true,
                default: null
            },
            category: {
                type: Object,
                required: true,
                default: null
            },
            subCategory: {
                type: Object,
                required: true,
                default: null
            },
            brand: {
                type: Object,
                required: true,
                default: null
            },  
            authToken: {
                type: String,
                required: true,
                default: ''
            }          
        },
        data() {
            return {
                tab: 'category',
            }
        },
        methods: {
            searchCategories(value) {
                this.$emit('searchCategories', value);
            },
            searchSubCategories(value) {
                this.$emit('searchSubCategories', value);
            },
            searchBrands(value) {
                this.$emit('searchBrands', value);
            },
            searchProducts(value) {
                this.$emit('searchProducts', value);
            },
            loadCategories(value) {
                this.$emit('loadCategories', value);
            },
            loadSubCategories(value) {
                this.$emit('loadSubCategories', value);
            },
            loadBrands(value) {
                this.$emit('loadBrands', value);
            },
            loadProducts(value) {
                this.$emit('loadProducts', value);
            },
            assignItem(value) {
                this.$emit('assignItem', value);
            },
            assignAll(value) {
                this.$emit('assignAll', value);
            }
        }
    }
</script>

<style lang="scss">
    .tabs {
        border-radius: 8px !important;
    }   
    .q-tab__label {
        font-size: 18px;
        font-weight: bold;
    }
</style>