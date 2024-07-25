<template>
  <v-container class="bg-white">
    <v-row>
      <v-col cols="12">
        <v-card class="elevation-2">
          <v-card-title class="text-h5 font-weight-bold pa-4 bg-black text-white">
            주문 상세 내역 보기
          </v-card-title>
          <v-card-text class="pa-4">
            <v-table v-if="order" class="border">
              <thead>
                <tr class="bg-grey-lighten-3">
                  <th class="text-left text-subtitle-1 font-weight-bold">주문 항목</th>
                  <th class="text-left text-subtitle-1 font-weight-bold">사이즈</th>
                  <th class="text-left text-subtitle-1 font-weight-bold">상품 가격</th>
                  <th class="text-left text-subtitle-1 font-weight-bold">개수</th>
                  <th class="text-left text-subtitle-1 font-weight-bold">총 상품 가격</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in order.order_items"
                  :key="item.productId"
                  class="hover-row"
                >
                  <td>{{ item.product_name }}</td>
                  <td>{{ item.size }}</td>
                  <td>{{ formatPrice(item.price) }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>{{ formatPrice(item.price * item.quantity) }}</td>
                </tr>
              </tbody>
            </v-table>
            <v-divider class="my-4"></v-divider>
            <v-row>
              <v-col class="text-right">
                <strong class="text-h6">결제 금액: {{ formatPrice(orderTotal) }}</strong>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="text-right">
                <v-btn color="black" @click="goToBack" class="text-white">
                  돌아가기
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
const orderModule = "orderModule";

export default {
  props: {
    orderId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      order: null,
    };
  },
  computed: {
    orderTotal() {
      if (
        !this.order ||
        !Array.isArray(this.order.order_items) ||
        this.order.order_items.length === 0
      ) {
        return 0;
      }
      return this.order.order_items.reduce((total, item) => {
        console.log("item.price:", item.price);
        console.log("item.size:", item.size);
        console.log("item.quantity:", item.quantity);
        const newTotal = total + item.price * item.quantity;
        console.log("total:", total);
        return newTotal;
      }, 0);
    },
  },
  methods: {
    ...mapActions("orderModule", ["requestReadOrderToDjango"]),
    async fetchOrderData() {
      const orderId = this.orderId;
      console.log("OrderReadPage orderId:", orderId);

      try {
        const response = await this.requestReadOrderToDjango({ orderId });
        this.order = response;
        console.log("ordersItemInfo:", this.order);
      } catch (error) {
        console.error("주문 내역 확인 중 에러:", error);
      }
    },
    goToBack() {
      this.$router.go(-1);
    },
    formatPrice(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
  created() {
    this.fetchOrderData();
  },
};
</script>

<style scoped>
.border {
  border: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
