import { createStore } from 'vuex'

import reviewModule from "@/review/store/reviewModule"
import authenticationModule from '@/authentication/store/authenticationModule'
import productModule from "@/product/store/productModule"
import cartModule from "@/cart/store/cartModule"
import orderModule from "@/order/store/orderModule";
import accountModule from '@/account/store/accountModule'
import communityModule from '@/community/store/communityModule'


export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    reviewModule,
    authenticationModule,
    productModule,
    cartModule,
    orderModule,
    accountModule,
    communityModule,
  }
})