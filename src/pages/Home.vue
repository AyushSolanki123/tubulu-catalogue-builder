<template>
  <q-page class="q-pa-md">
    <q-card class="main-card column" v-if="!loading">
      <div class="text-h6 text-bold q-mt-md q-pa-md">
        Welcome, {{ user.name }}
      </div>
      <div class="column">
        <div class="row justify-around q-pa-md col">
          <div class="column col">
            <div class="text-h6 text-bold text-center q-pa-md">Source 1</div>
            <DoughnutChart :data="chartData.source1" />
          </div>
          <div class="column col">
            <div class="text-h6 text-bold text-center q-pa-md">Source 2</div>
                        <DoughnutChart :data="chartData.source2" />
          </div>
          <div class="column col">
            <div class="text-h6 text-bold text-center q-pa-md">Source 3</div>
            <DoughnutChart :data="chartData.source3" />

          </div>
          <div class="column col">
            <div class="text-h6 text-bold text-center q-pa-md">Manual</div>
            <DoughnutChart :data="chartData.manual" />

          </div>
        </div>
        <ProductSummary
          class="col"
          :users="users"
          :authToken="authToken"
          :property="userProperty"
        />
      </div>
    </q-card>
  </q-page>
</template>

<script>
import DoughnutChart from "../components/doughnutChart/Doughnut.vue";
import getCurrentUser from "../functions/getCurrentUser";
import { notify } from "src/functions/notify";
import ProductSummary from "src/components/Home/ProductSummary.vue";
import { Loading } from "quasar";
export default {
  name: "Home",
  components: {
    DoughnutChart,
    ProductSummary,
  },
  data() {
    return {
      user: {},
      products: [],
      chartData: {
        source1: [],
        source2: [],
        source3: [],
        manual: []
      },
      users: [],
      userProperty: {
        next: true,
        page: 1,
        size: 10,
      },
      authToken: "",
      loading: true,
    };
  },
  methods: {
    async listUsers() {
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: "Bearer " + this.authToken,
          "Content-Type": "application/json",
        },
      };
      try {
        var data = await fetch(`${process.env.API}/users`, requestOptions);
        data = await data.json();
        this.users = data.data;
      } catch (error) {
        notify("Failed", error.message);
      }
    },
    async getChartData() {
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: "Bearer " + this.authToken,
          "Content-Type": "application/json",
        },
      };
      var response = await fetch(`${process.env.API}/products/status`,requestOptions);
      response = await response.json();
      this.chartData.source1 = response[0].data;
      this.chartData.source2 = response[1].data;
      this.chartData.source3 = response[2].data;
      this.chartData.manual = response[3].data;
    },
    async addProductsToUsers() {
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: "Bearer " + this.authToken,
          "Content-Type": "application/json",
        },
      };
      var response = await fetch(`${process.env.API}/products/userProducts`, requestOptions);
      response = await response.json();
      this.users = response;
    },
  },
  async created() {
    Loading.show();
    this.user = await getCurrentUser();
    this.authToken = localStorage.getItem("authToken");
    await this.getChartData();
    await this.addProductsToUsers();
    this.loading = false;
    Loading.hide();
  },
};
</script>
