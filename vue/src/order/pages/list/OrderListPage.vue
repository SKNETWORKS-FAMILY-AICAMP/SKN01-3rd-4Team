<template>
  <v-container class="bg-grey-lighten-4">
    <v-row>
      <v-col cols="12">
        <v-card class="elevation-2">
          <v-card-title class="text-h5 font-weight-bold pa-4 bg-black text-white">
            전체 주문 리스트
          </v-card-title>
          <v-card-text class="pa-4">
            <v-table v-if="orderList && orderList.length" class="bg-white">
              <thead>
                <tr>
                  <th class="text-left text-subtitle-1 font-weight-bold">주문 번호</th>
                  <th class="text-left text-subtitle-1 font-weight-bold">주문 일자</th>
                  <th class="text-left text-subtitle-1 font-weight-bold">주문 항목</th>
                  <th class="text-left text-subtitle-1 font-weight-bold">
                    전체 주문 가격
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="order in orderList"
                  :key="order.orderId"
                  @click="goToOrderReadPage(order.orderId)"
                  class="hover-row"
                  style="cursor: pointer"
                >
                  <td>{{ order.orderId }}</td>
                  <td>{{ order.orderDate }}</td>
                  <td>{{ truncateOrderName(order.orderName) }}</td>
                  <td>{{ formatPrice(order.ordersItemTotalPrice) }}</td>
                </tr>
              </tbody>
            </v-table>
            <v-divider class="my-4"></v-divider>
            <v-pagination
              v-if="totalPageNumber > 1"
              v-model="currentPageNumber"
              :length="totalPageNumber"
              @update:model-value="onPageChange"
              class="mt-4"
              color="grey-darken-3"
            ></v-pagination>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="end" class="mt-4">
      <v-btn color="black" @click="goToHome" class="text-white"> 홈으로 돌아가기 </v-btn>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";

const orderModule = "orderModule";

export default {
  computed: {
    ...mapGetters(orderModule, ["orderList", "currentPageNumber", "totalPageNumber"]),
  },
  methods: {
    ...mapActions(orderModule, ["requestOrderListToDjango"]),
    ...mapMutations(orderModule, ["SET_CURRENT_PAGE_NUMBER"]),
    async fetchOrderList() {
      const accountId = this.$route.params.accountId;
      console.log("currentPageNumber:", this.currentPageNumber);
      await this.requestOrderListToDjango({ accountId, page: this.currentPageNumber });
    },
    async onPageChange(page) {
      console.log("is it operate ? onPageChange():", page);
      this.SET_CURRENT_PAGE_NUMBER(page);
      await this.fetchOrderList();
      this.$router.push({ name: "OrderListPage", query: { page } });
    },
    goToOrderReadPage(orderId) {
      this.$router.push({
        name: "OrderReadPage",
        params: { orderId },
        query: { page: this.currentPageNumber },
      });
    },
    goToHome() {
      this.$router.push({ name: "HomeView" });
    },
    truncateOrderName(orderName) {
      const maxLength = 50;
      return orderName.length > maxLength
        ? orderName.substring(0, maxLength) + "..."
        : orderName;
    },
    formatPrice(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
  watch: {
    currentPageNumber: "fetchOrderList",
  },
  created() {
    const page = this.$route.query.page ? parseInt(this.$route.query.page) : 1;
    this.SET_CURRENT_PAGE_NUMBER(page);
    this.fetchOrderList();
  },
};
</script>

<style scoped>
.hover-row:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
