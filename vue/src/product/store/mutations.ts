import { MutationTree } from "vuex";
import { ProductState, Product } from "./states";
import { 
    REQUEST_PRODUCT_LIST_TO_DJANGO,
    REQUEST_PRODUCT_TO_DJANGO,
    INCREMENT_PRODUCT_VIEW_COUNT
} from "./mutation-types";

export interface ProductMutations extends MutationTree<ProductState> {
    [REQUEST_PRODUCT_LIST_TO_DJANGO] (state: ProductState, receivedData: Product[]): void
    [REQUEST_PRODUCT_TO_DJANGO](state: ProductState, receivedData: Product): void
    [INCREMENT_PRODUCT_VIEW_COUNT](state: ProductState, newViewCount: number): void
}

const mutations: MutationTree<ProductState> = {
    [REQUEST_PRODUCT_LIST_TO_DJANGO] (state: ProductState, receivedData: Product[]): void {
        state.productList = receivedData
    },
    [REQUEST_PRODUCT_TO_DJANGO] (state: ProductState, receivedData: Product): void {
        state.product = receivedData
    },
    [INCREMENT_PRODUCT_VIEW_COUNT](state: ProductState, newViewCount: number): void {
        if (state.product) {
            state.product.viewCount = newViewCount;
        }
    }
}

export default mutations as ProductMutations