<template>
    <div class="row justify-between q-pa-md">
        <div>
            <div class="row q-gutter-md">
                <q-btn-dropdown color="primary" :label="filterType" flat v-if="isFilter">
                    <q-list style="min-width: 100px">
                        <q-item clickable @click="filterBy('ALL')" v-close-popup>
                            <q-item-section>ALL</q-item-section>                            
                        </q-item>
                        <q-item v-close-popup @click="filterBy('PENDING')" clickable>
                            <q-item-section>PENDING</q-item-section>
                        </q-item>
                        <q-item v-close-popup @click="filterBy('APPROVED')" clickable>
                            <q-item-section>APPROVED</q-item-section>
                        </q-item>
                        <q-item v-close-popup @click="filterBy('REJECTED')" clickable>
                            <q-item-section>REJECTED</q-item-section>
                        </q-item>
                        <q-item v-close-popup @click="filterBy('DUPLICATE')" clickable>
                            <q-item-section>DUPLICATE</q-item-section>
                        </q-item>
                    </q-list>
                </q-btn-dropdown>

                <q-btn 
                    no-caps
                    :label="label1"
                    color="primary"
                    icon="add"
                    @click="$emit('Callout1')"
                    class="btn"
                />
            </div>   
        </div>
        <div>
            <div class="row q-gutter-md">
                <q-btn 
                    v-if="needButton1"
                    no-caps
                    :label="label2"
                    color="positive"
                    :icon="icon1"
                     class="btn"
                    @click="$emit('Callout2')"
                />
                <q-btn 
                    v-if="needButton2"
                    no-caps
                    :label="label3"
                    color="negative"
                    :icon="icon2"
                     class="btn"
                    @click="$emit('Callout3')"
                />
                <q-btn 
                    v-if="needButton3"
                    no-caps
                    :label="label4"
                    color="warning"
                    :icon="icon3"
                     class="btn"
                    @click="$emit('Callout4')"
                />
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            label1: {
                type: String,
                default: ''
            },
            label2: {
                type: String,
                default: ''
            },
            label3: {
                type: String,
                default: ''
            },
            label4: {
                type: String,
                default: ''
            },
            icon1: {
                type: String,
                default: ''
            },
            icon2: {
                type: String,
                default: ''
            },
            icon3: {
                type: String,
                default: ''
            },
            isFilter: {
                type: Boolean,
                default: false
            },
            needButton1: {
                type: Boolean,
                default: true
            },
            needButton2: {
                type: Boolean,
                default: true
            },
            needButton3: {
                type: Boolean,
                default: true
            },
        },
        data() {
            return {
                filterType: "ALL"
            }
        },   
        methods: {
            filterBy(status) {
                this.filterType = status
                if (status == "ALL")
                    this.$emit("filterProduct", "");
                else 
                    this.$emit("filterProduct", status);       
            },
            noSearchFilter() {
                this.filterType = "ALL";
            }
        },
        created() {
            this.$root.$on("noSearchFilter", this.noSearchFilter);
        },
        beforeDestroy() {
            this.$root.$off("noSearchFilter", this.noSearchFilter);
        }
    }
</script>