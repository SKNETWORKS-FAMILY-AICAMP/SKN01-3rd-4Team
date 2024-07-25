import { MutationTree } from "vuex";
import { ReviewState, Review } from "./states";
import { 
    REQUEST_REVIEW_TO_DJANGO,
    REQUEST_REVIEW_LIST_TO_DJANGO,
    INCREMENT_REVIEW_VIEW_COUNT
} from "./mutation-types";

export interface ReviewMutations extends MutationTree<ReviewState> {
    [REQUEST_REVIEW_TO_DJANGO] (state: ReviewState, receivedData: Review): void
    [REQUEST_REVIEW_LIST_TO_DJANGO](state: ReviewState, receivedData: Review[]): void
    [INCREMENT_REVIEW_VIEW_COUNT](state: ReviewState, newViewCount: number): void
}

const mutations: MutationTree<ReviewState> = {
    [REQUEST_REVIEW_TO_DJANGO] (state: ReviewState, receivedData: Review): void {
        state.review = receivedData
    },
    [REQUEST_REVIEW_LIST_TO_DJANGO] (state: ReviewState, receivedData: Review[]): void {
        state.reviewList = receivedData
    },
    [INCREMENT_REVIEW_VIEW_COUNT](state: ReviewState, newViewCount: number): void {
        if (state.review) {
            state.review.viewCount = newViewCount;
        }
    }
}
export default mutations as ReviewMutations