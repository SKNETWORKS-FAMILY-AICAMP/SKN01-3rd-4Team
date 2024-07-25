<template>
  <v-container>
    <v-row class="my-5" justify="center">
      <v-col cols="12" class="text-center">
        <h2>PHOTO REVIEW</h2>
        <router-link
          v-if="isAuthenticated"
          class="floating-button"
          :to="{ name: 'ReviewRegisterPage' }"
        >
          <v-icon left>mdi-pencil</v-icon>
        </router-link>
      </v-col>
      <v-col cols="12" class="d-flex justify-center mb-4">
        <v-select
          :items="sortOptions"
          v-model="selectedSort"
          label="정렬"
          class="mr-4"
          hide-details
        ></v-select>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="검색"
          single-line
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-row v-if="filteredReviews.length > 0">
          <v-col
            v-for="(review, index) in sortedReviews"
            :key="index"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card class="review-card" @click="goToReviewReadPage(review.reviewId)">
              <div class="image-container">
                <v-img :src="getReviewImageUrl(review.reviewImage)" class="review-image">
                  <template v-slot:placeholder>
                    <v-row class="fill-height ma-0" align="center" justify="center">
                      <v-progress-circular indeterminate color="grey lighten-5" />
                    </v-row>
                  </template>
                </v-img>
              </div>
              <v-card-title>
                {{ review.title }}
              </v-card-title>
              <v-card-subtitle>
                <v-icon left style="margin-right: 4px">mdi-account</v-icon
                >{{ review.writer }}
              </v-card-subtitle>
              <v-card-subtitle>
                <v-icon left style="margin-right: 4px">mdi-eye</v-icon
                >{{ review.viewCount }}
              </v-card-subtitle>
              <v-card-actions>
                <v-rating
                  v-model="review.rating"
                  dense
                  readonly
                  half-increments
                ></v-rating>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col cols="12" class="text-center">
            <v-alert type="info">등록된 리뷰가 없습니다!</v-alert>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
const reviewModule = "reviewModule";
const authenticationModule = "authenticationModule";

export default {
  data() {
    return {
      search: "",
      sortOptions: ["최신순", "오래된순", "평점 높은 순", "조회수 높은 순"],
      selectedSort: "최신순",
    };
  },
  computed: {
    ...mapState(reviewModule, ["reviewList"]),
    ...mapState(authenticationModule, ["isAuthenticated"]),
    filteredReviews() {
      return this.reviewList.filter(
        (review) =>
          review.title.includes(this.search) || review.writer.includes(this.search)
      );
    },
    sortedReviews() {
      let sorted = this.filteredReviews.slice();
      if (this.selectedSort === "최신순") {
        sorted.sort((a, b) => new Date(b.regDate) - new Date(a.regDate));
      } else if (this.selectedSort === "오래된순") {
        sorted.sort((a, b) => new Date(a.regDate) - new Date(b.regDate));
      } else if (this.selectedSort === "평점 높은 순") {
        sorted.sort((a, b) => b.rating - a.rating);
      } else if (this.selectedSort === "조회수 높은 순") {
        sorted.sort((a, b) => b.viewCount - a.viewCount);
      }
      return sorted;
    },
  },
  mounted() {
    this.requestReviewListToDjango();
  },
  methods: {
    ...mapActions(reviewModule, ["requestReviewListToDjango"]),
    getReviewImageUrl(imageName) {
      return require(`@/assets/images/reviewImages/${imageName}`);
    },
    goToReviewReadPage(reviewId) {
      this.$router.push({
        name: "ReviewReadPage",
        params: { reviewId: reviewId },
      });
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}. ${month}. ${day}`;
    },
  },
};
</script>

<style scoped>
h2 {
  font-family: "Arial", sans-serif;
  font-weight: bold;
}

.v-btn-toggle .v-btn {
  font-family: "Arial", sans-serif;
  color: #555;
  background-color: white;
  border: 1px solid #ccc;
  margin: 0 5px;
  border-radius: 25px;
  min-width: 120px;
}

.v-btn-toggle .v-btn--active,
.v-btn-toggle .active-btn {
  background-color: black;
  color: white;
}

.v-select,
.v-text-field {
  max-width: 250px;
}

.v-card-title {
  font-family: "Arial", sans-serif;
  font-weight: bold;
  text-align: center;
}

.v-card-subtitle {
  font-family: "Arial", sans-serif;
  font-weight: normal;
  text-align: center;
}

.v-rating {
  color: #ffbf00;
}

.review-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  margin: 0;
}

.floating-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #000;
  color: #fff;
  padding: 10px 20px;
  border-radius: 50%;
  text-align: center;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
}

.floating-button:hover {
  background-color: #333;
  color: #4caf50;
}
</style>
