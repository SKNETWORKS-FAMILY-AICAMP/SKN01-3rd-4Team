<template>
  <v-container>
    <div class="navigation-container">
      <v-icon v-if="previousReviewExists" class="left-arrow" @click="navigateToPrevious"
        >mdi-chevron-left</v-icon
      >
      <v-icon v-if="nextReviewExists" class="right-arrow" @click="navigateToNext"
        >mdi-chevron-right</v-icon
      >
      <v-card v-if="review && !isLoading" class="question-card">
        <v-card-title class="title-section" style="text-align: center">
          {{ review.title }}
        </v-card-title>
        <v-card-subtitle class="subtitle-section">
          {{ review.writer }}
        </v-card-subtitle>
        <v-img
          :src="getReviewImageUrl(review.reviewImage)"
          aspect-ratio="1"
          class="image-placeholder"
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="grey lighten-5" />
            </v-row>
          </template>
        </v-img>
        <v-card-text class="content-section">
          {{ review.content }}
        </v-card-text>
      </v-card>
      <v-progress-circular v-if="isLoading" indeterminate color="primary">
      </v-progress-circular>
    </div>

    <div
      v-if="isAuthor"
      class="floating-menu-container"
      @mouseover="showMenu"
      @mouseleave="hideMenu"
    >
      <v-btn class="floating-button" @mouseover="showMenu" @mouseleave="hideMenu">
        <v-icon>{{ menuOpen ? "mdi-close" : "mdi-menu" }}</v-icon>
      </v-btn>
      <div v-if="menuOpen" class="floating-menu">
        <v-btn
          class="menu-item"
          @click="$router.push({ name: 'ReviewModifyPage', params: { reviewId } })"
        >
          수정
        </v-btn>
        <v-btn class="menu-item" @click="showDeleteDialog = true"> 삭제 </v-btn>
        <v-btn class="menu-item" @click="copyUrlToClipboard"> 공유하기 </v-btn>
        <v-btn class="menu-item" @click="$router.push({ name: 'ReviewListPage' })">
          돌아가기
        </v-btn>
      </div>
    </div>
    <div v-if="!isAuthor" class="floating-menu-container">
      <v-btn
        class="floating-button"
        @mouseover="showMenu"
        @mouseleave="hideMenu"
        @click="$router.push({ name: 'ReviewListPage' })"
      >
        <v-icon color="white">mdi-undo</v-icon>
      </v-btn>
    </div>
    <v-dialog v-model="showDeleteDialog" max-width="500px">
      <v-card class="black-white-dialog">
        <v-card-text>정말로 삭제하시겠습니까?</v-card-text>
        <v-card-actions>
          <v-btn color="green" text @click="showDeleteDialog = false">취소</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="confirmDelete">확인</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showShareDialog" max-width="300px">
      <v-card class="share-dialog">
        <v-card-text>
          <v-icon color="green">mdi-check-circle</v-icon>
          주소가 복사되었습니다.
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import "@mdi/font/css/materialdesignicons.css";

const reviewModule = "reviewModule";
const authenticationModule = "authenticationModule";
const accountModule = "accountModule";

export default {
  props: {
    reviewId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      menuOpen: false,
      showDeleteDialog: false,
      showShareDialog: false,
      currentUserNickname: "",
      previousReviewExists: false,
      nextReviewExists: false,
      isLoading: true,
    };
  },
  computed: {
    ...mapState("reviewModule", ["review"]),
    ...mapState("authenticationModule", ["isAuthenticated"]),
    isAuthor() {
      return this.review && this.review.writer === this.currentUserNickname;
    },
  },
  methods: {
    ...mapActions(reviewModule, ["requestReviewToDjango", "incrementReviewViewCount"]),
    ...mapActions(accountModule, ["requestNicknameToDjango"]),

    async checkAdjacentReviews() {
      this.isLoading = true;
      const currentId = Number(this.reviewId);

      this.nextReviewExists = currentId > 1;

      try {
        await this.requestReviewToDjango(currentId + 1);
        this.previousReviewExists = true;
      } catch (error) {
        this.previousReviewExists = false;
      }

      await this.requestReviewToDjango(currentId);
      this.isLoading = false;
    },

    navigateToPrevious() {
      if (this.previousReviewExists) {
        this.$router.push(`/review/read/${Number(this.reviewId) + 1}`);
      }
    },

    navigateToNext() {
      if (this.nextReviewExists) {
        this.$router.push(`/review/read/${Number(this.reviewId) - 1}`);
      }
    },

    getReviewImageUrl(imageName) {
      return imageName ? require(`@/assets/images/reviewImages/${imageName}`) : null;
    },

    copyUrlToClipboard() {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          this.showShareDialog = true;
          setTimeout(() => (this.showShareDialog = false), 2000);
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
          alert("주소 복사 실패");
        });
    },

    showMenu() {
      this.menuOpen = true;
    },

    hideMenu() {
      this.menuOpen = false;
    },
  },
  async created() {
    await this.checkAdjacentReviews();
    await this.incrementReviewViewCount(this.reviewId);
    this.currentUserNickname = await this.requestNicknameToDjango();
  },
  watch: {
    async reviewId() {
      await this.checkAdjacentReviews();
    },
  },
};
</script>

<style scoped>
.navigation-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin: 40px auto;
}

.question-card {
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.image-placeholder {
  height: 300px;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
}

.title-section {
  padding: 16px;
  font-weight: bold;
  font-size: 1.5rem;
  text-align: left;
  background-color: #fafafa;
  border-bottom: 1px solid #eeeeee;
}

.subtitle-section {
  padding: 8px 16px;
  color: #000000;
  font-weight: bold;
  font-size: 1rem;
  text-align: center;
  background-color: #fafafa;
  border-bottom: 1px solid #eeeeee;
}

.content-section {
  padding: 16px;
  color: #333333;
  font-size: 1rem;
  line-height: 1.5;
  background-color: #ffffff;
  text-align: left;
}

.left-arrow,
.right-arrow {
  font-size: 3rem;
  cursor: pointer;
  color: #000000;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.left-arrow {
  left: 100px;
}

.right-arrow {
  right: 100px;
}

.left-arrow:hover,
.right-arrow:hover {
  color: #4caf50;
}

.share {
  color: #000000;
  cursor: pointer;
  position: absolute;
  margin-top: 590px;
  right: 310px;
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

.menu-item {
  margin-bottom: 10px;
  background-color: #000;
  color: #fff;
}
.menu-item:hover {
  background-color: #333;
  color: #4caf50;
}

.mdi-icon-white {
  color: #ffffff;
}

.question-card:hover {
  transform: scale(1.15);
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s, box-shadow 0.3s;
}
.v-icon:hover {
  color: #4caf50;
}
</style>
