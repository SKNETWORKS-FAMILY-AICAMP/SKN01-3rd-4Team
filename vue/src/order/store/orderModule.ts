import actions, { OrderActions } from "./actions"
import getters, { OrderGetters } from "./getters"
import mutations, { OrderMutations } from "./mutations"
import state, { OrderState } from "./states"

export interface OrderModule {
    namespaced: true
    state: OrderState
    actions: OrderActions
    mutations: OrderMutations
    getters: OrderGetters
}

const orderModule: OrderModule = {
    namespaced: true,
    state,
    actions,
    mutations,
    getters,
}

export default orderModule