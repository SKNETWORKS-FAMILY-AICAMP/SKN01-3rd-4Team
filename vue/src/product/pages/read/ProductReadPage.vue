<template>
  <v-container v-if="product">
    <v-row>
      <v-col cols="12" md="6">
        <v-carousel v-if="hasProductImages" hide-delimiters height="500">
          <v-carousel-item v-for="(image, i) in productImages" :key="i">
            <v-img :src="getProductImageUrl(product.productImage)" height="500" contain />
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey lighten-5" />
              </v-row>
            </template>
          </v-carousel-item>
        </v-carousel>
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular indeterminate color="grey lighten-5" />
          </v-row>
        </template>
        <v-row v-if="hasProductImages" class="mt-2">
          <v-col v-for="(image, i) in productImages" :key="i" cols="2"> </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="1"> </v-col>
      <v-col cols="12" md="5">
        <h1 class="text-h4 font-weight-bold mb-2">{{ product.productName }}</h1>
        <p class="text-subtitle-1 mb-2">{{ product.productDescription }}</p>
        <p class="text-h5 font-weight-bold mb-4">
          {{ formatPrice(product.productPrice) }} 원
        </p>

        <v-alert type="warning" class="mb-4" dense text icon="mdi-clock-fast">
          품절임박! 서둘러 주문하세요.
        </v-alert>

        <v-row class="mb-4">
          <v-col cols="6">
            <h3 class="text-subtitle-1 mb-2">사이즈 선택</h3>
          </v-col>
          <v-col cols="6" class="text-right">
            <span class="text-caption">사이즈 가이드</span>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col v-for="size in sizes" :key="size" cols="3" sm="2">
            <v-btn
              outlined
              :color="selectedSize === size ? '#FB8C00' : ''"
              @click="selectSize(size)"
              block
              class="size-btn"
            >
              {{ size }}
            </v-btn>
          </v-col>
        </v-row>

        <v-btn
          block
          x-large
          color="black"
          class="white--text mt-6"
          @click="onAddToCart"
          height="50"
        >
          장바구니
        </v-btn>

        <v-btn block x-large outlined class="mt-4" @click="goToBack" height="50">
          목록으로 돌아가기
        </v-btn>
      </v-col>
    </v-row>
  </v-container>

  <v-container v-else>
    <v-alert type="info"> 상품 정보를 불러오는 중입니다... </v-alert>
  </v-container>
  <div v-if="isAuthenticated" class="floating-menu-container">
    <v-btn class="floating-button" :class="{ bounce: isBouncing }" @click="goToCart">
      <v-icon color="white">mdi-cart</v-icon>
      <v-badge
        v-if="totalQuantity > 0"
        :content="totalQuantity.toString()"
        color="red"
        overlap
        offset-x="-7"
        offset-y="-23"
      ></v-badge>
    </v-btn>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
const authenticationModule = "authenticationModule";
const productModule = "productModule";
const cartModule = "cartModule";

export default {
  props: {
    productId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      selectedSize: null,
      sizes: [
        "220",
        "225",
        "230",
        "235",
        "240",
        "245",
        "250",
        "255",
        "260",
        "265",
        "270",
        "275",
        "280",
        "285",
        "290",
      ],
      isBouncing: false,
      totalQuantity: 0,
    };
  },
  computed: {
    ...mapState(productModule, ["product"]),
    ...mapState(authenticationModule, ["isAuthenticated"]),
    ...mapState(cartModule, ["cartItemList"]),
    hasProductImages() {
      return (
        this.product && this.product.productImage && this.product.productImage.length > 0
      );
    },
    productImages() {
      return this.hasProductImages ? this.product.productImage : [];
    },
  },
  async created() {
    await this.requestProductToDjango(this.productId);
    await this.incrementProductViewCount(this.productId);
    await this.loadCartItems();
  },

  methods: {
    ...mapActions(productModule, ["requestProductToDjango", "incrementProductViewCount"]),
    ...mapActions(cartModule, ["requestAddCartToDjango", "requestCartListToDjango"]),
    async onPurchase() {
      console.log("장바구니 버튼 눌렀음");
    },
    async onAddToCart() {
      console.log("장바구니에 추가 버튼 눌렀음");
      try {
        const cartData = {
          productId: this.product.productId,
          productName: this.product.productName,
          productPrice: this.product.productPrice,
          quantity: 1,
          productSize: this.selectedSize,
        };
        await this.requestAddCartToDjango(cartData);
        await this.loadCartItems();
        this.bounceCartIcon();
      } catch (error) {
        console.log("장바구니 추가 과정에서 에러 발생:", error);
      }
    },
    bounceCartIcon() {
      this.isBouncing = true;
      setTimeout(() => {
        this.isBouncing = false;
      }, 1000);
    },
    goToCart() {
      this.$router.push({ name: "CartListPage" });
    },
    goToBack() {
      this.$router.go(-1);
    },
    getProductImageUrl(imageName) {
      console.log("imageName:", imageName);
      if (imageName) {
        return require(`@/assets/images/uploadImages/${imageName}`);
      }
      return null;
    },
    selectSize(size) {
      this.selectedSize = size;
    },
    async loadCartItems() {
      try {
        const response = await this.requestCartListToDjango();
        let totalQuantity = 0;
        response.forEach((item, index) => {
          console.log(`Item ${index} quantity:`, item.quantity);
          totalQuantity += item.quantity;
        });
        this.totalQuantity = totalQuantity;
        console.log("Sum of all quantities:", totalQuantity);
      } catch (error) {
        console.error("Error loading cart items:", error);
      }
    },
    formatPrice(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
};
</script>

<style scoped>
.v-btn {
  text-transform: none;
}
.size-btn {
  min-width: 0;
  width: 100%;
  height: 40px;
}

.floating-menu-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-end;
}

.floating-button {
  background-color: #000;
  color: #fff;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  margin-right: 13px;
}

.floating-button:hover {
  background-color: #333;
}

.floating-menu {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

@keyframes doubleBounce {
  0%,
  50%,
  100% {
    transform: translateY(0);
  }
  25%,
  75% {
    transform: translateY(-50px);
  }
}

.bounce {
  animation: doubleBounce 1s ease;
}
</style>
