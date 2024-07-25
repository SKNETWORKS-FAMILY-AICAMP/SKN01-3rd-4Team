<template>
  <v-app-bar color="black" app dark height="64">
    <v-toolbar-title class="navbar-title">
      <v-btn text @click="goToHome" class="navbar-title-btn">
        <span> IT, SHOE</span>
      </v-btn>
    </v-toolbar-title>
    <v-spacer></v-spacer>

    <v-btn text @click="goToProductList" class="btn-text">
      <span>PRODUCTS</span>
    </v-btn>

    <v-btn text @click="goToCommunityList" class="btn-text">
      <span>COMMUNITY</span>
    </v-btn>

    <v-btn text @click="goToReviewList" class="btn-text">
      <span>REVIEW</span>
    </v-btn>

    <v-btn v-if="isAuthenticated" text @click="goToCart" class="btn-text">
      <span>Cart</span>
    </v-btn>

    <v-btn v-if="isAuthenticated" text @click="goToOrder" class="btn-text">
      <span>Order</span>
    </v-btn>

    <v-menu close-on-content-click>
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" class="btn-text">
          <b>Report</b>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, index) in reportItems"
          :key="index"
          @click="item.action"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-menu v-if="isAuthenticated" close-on-content-click>
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" class="btn-text" style="margin-right: 16px">
          <b>My Page</b>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, index) in myPageItems"
          :key="index"
          @click="item.action"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-btn v-if="!isAuthenticated" text @click="signIn" class="btn-text">
      <v-icon left>mdi-login</v-icon>
      <span>LOGIN</span>
    </v-btn>
  </v-app-bar>
</template>

<script>
import "@mdi/font/css/materialdesignicons.css";
import router from "@/router";
import { mapActions, mapState } from "vuex";
const authenticationModule = "authenticationModule";

export default {
  data() {
    return {
      reportItems: [
        {
          title: "구매 동향",
          action: () => {
            this.goToPurchaseTrendAnalysisPage();
          },
        },
        {
          title: "관리자",
          action: () => {
            this.goToCustomerChurnPredictionPage();
          },
        },
      ],
      myPageItems: [
        {
          title: "MY PAGE",
          action: () => {
            this.goToMyPage();
          },
        },
        {
          title: "LOGOUT",
          action: () => {
            this.signOut();
          },
        },
      ],
    };
  },
  computed: {
    ...mapState(authenticationModule, ["isAuthenticated"]),
  },
  methods: {
    ...mapActions(authenticationModule, ["requestLogoutToDjango"]),
    goToHome() {
      router.push("/");
    },
    goToReport() {
      router.push("/report");
    },
    goToProductList() {
      router.push("/product/list");
    },
    goToCommunityList() {
      router.push("/community/list");
    },
    goToReviewList() {
      router.push("/review/list");
    },
    signIn() {
      router.push("/account/login");
    },
    signOut() {
      this.requestLogoutToDjango();
      router.push("/");
    },
    goToCart() {
      router.push("/cart/list");
    },
    goToOrder() {
      router.push("/order/list");
    },
    goToMyPage() {
      router.push("/account/mypage");
    },
    goToPurchaseTrendAnalysisPage() {
      router.push("/report/purchase-trend-analysis");
    },
    goToCustomerChurnPredictionPage() {
      router.push("/report/customer-churn-prediction");
    },
  },
  mounted() {
    console.log("navigation bar mounted()");
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      console.log("You already has a userToken!");
      this.$store.state.authenticationModule.isAuthenticated = true;
    }
  },
};
</script>

<style scoped>
.navbar-title {
  font-size: 24px;
  font-weight: bold;
  color: white;
}

.navbar-title-btn {
  color: white;
}

.mdi-icon {
  font-size: 32px;
  margin-right: 8px;
}

.btn-text {
  font-size: 14px;
  margin-right: 16px;
  color: white;
}

.v-btn {
  text-transform: uppercase;
}

.v-btn:hover {
  background-color: rgba(170, 255, 0, 0.233);
}

.v-btn:hover .btn-text {
  color: white;
}

.v-btn:focus {
  background-color: rgba(170, 255, 0, 0.233); /* 클릭해서 선택되었을시 표시 */
  color: white;
}

.v-btn:focus .btn-text {
  color: white;
}

.v-menu > .v-overlay__content > .v-card,
.v-menu > .v-overlay__content > .v-sheet,
.v-menu > .v-overlay__content > .v-list {
  background-color: #0000008a;
  color: white;
}

.v-list-item:hover {
  background-color: rgba(170, 255, 0, 0.233);
}
</style>
