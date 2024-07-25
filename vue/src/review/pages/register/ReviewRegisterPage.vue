<template>
  <v-container class="container">
    <v-row justify="center" align="center" class="full-height">
      <v-col cols="12" md="8">
        <h2 v-if="step === 1" class="rating-text">
          {{ displayedText }}<span v-if="showCursor" class="cursor">|</span>
        </h2>
        <div v-if="step === 1" class="rating-section">
          <div class="stars-wrapper">
            <v-icon
              v-for="n in 5"
              :key="n"
              :style="{
                visibility: n <= showStars ? 'visible' : 'hidden',
                color: n <= hoverRating ? '#FFD700' : '#C0C0C0',
              }"
              class="star"
              @click="rating = n"
              @mouseover="hoverRating = n"
              @mouseleave="hoverRating = rating"
            >
              mdi-star
            </v-icon>
          </div>
        </div>
        <div v-if="step === 2">
          <v-row justify="center">
            <v-col cols="12" class="d-flex justify-center">
              <v-text-field
                v-model="title"
                label="제목"
                :rules="[(v) => v.length <= 30 || '제목은 최대 30글자까지 가능합니다.']"
                maxlength="30"
              />
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="12" class="d-flex justify-center">
              <v-textarea
                v-model="content"
                label="내용"
                auto-grow
                outlined
                dense
                class="input-custom mt-3"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-file-input
                v-model="reviewImage"
                label="이미지 파일"
                prepend-icon="mdi-camera"
                class="input-custom mt-3"
              />
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="12" class="d-flex justify-center">
              <p v-if="uploadedFileName">이미지 파일 이름 {{ uploadedFileName }}</p>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
    <v-icon class="left-arrow" @click="previousStep" v-if="step > 1"
      >mdi-chevron-left</v-icon
    >
    <v-icon class="right-arrow" @click="handleNextClick">
      {{ step === 2 ? "mdi-check" : "mdi-chevron-right" }}
    </v-icon>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

const accountModule = "accountModule";
const reviewModule = "reviewModule";

export default {
  data() {
    return {
      title: "",
      writer: "",
      content: "",
      rating: 0,
      reviewImage: null,
      uploadedFileName: "",
      hoverRating: 0,
      step: 1,
      fullText: "별점을 선택해 주세요.",
      displayedText: "",
      showCursor: true,
      showStars: 0,
      starsDisplayed: false,
    };
  },
  mounted() {
    if (this.step === 1) {
      this.typeText();
    }
    setInterval(() => {
      this.showCursor = !this.showCursor;
    }, 500);
  },
  methods: {
    ...mapActions(reviewModule, ["requestCreateReviewToDjango"]),
    ...mapActions(accountModule, ["requestNicknameToDjango"]),
    typeText() {
      if (this.starsDisplayed) {
        return;
      }

      this.displayedText = "";
      let index = 0;
      const typingInterval = setInterval(() => {
        if (index < this.fullText.length) {
          this.displayedText += this.fullText.charAt(index);
          index++;
        } else {
          clearInterval(typingInterval);
          this.showStarIncrementally();
        }
      }, 100);
    },
    showStarIncrementally() {
      if (this.starsDisplayed) {
        return;
      }

      let starCount = 0;
      const starInterval = setInterval(() => {
        if (starCount < 5) {
          starCount++;
          this.showStars = starCount;
        } else {
          clearInterval(starInterval);
          this.starsDisplayed = true; // 별이 모두 표시되었음을 추적
        }
      }, 200);
    },
    nextStep() {
      if (this.step === 1) {
        this.showStars = 0;
        this.starsDisplayed = false;
      }
      this.step++;
      if (this.step === 1) {
        this.typeText();
      }
      if (this.step === 2) {
        this.showStars = 0;
      }
    },
    previousStep() {
      this.step--;
      if (this.step === 1) {
        this.starsDisplayed = false; // step 변경 시 별 표시 상태 초기화
        this.showStars = 0; // 별의 표시 상태 초기화
        this.typeText(); // 별점 텍스트와 별을 다시 표시
      }
    },
    async onSubmit() {
      try {
        if (this.title.length > 30) {
          alert("제목은 최대 30글자까지 가능합니다.");
          return;
        }
        const nickname = await this.requestNicknameToDjango();
        console.log("nickname:", nickname);
        if (this.reviewImage) {
          const imageFormData = new FormData();
          imageFormData.append("title", this.title);
          imageFormData.append("writer", nickname);
          imageFormData.append("content", this.content);
          imageFormData.append("rating", this.rating);
          imageFormData.append("reviewImage", this.reviewImage);

          const response = await this.requestCreateReviewToDjango(imageFormData);
          this.uploadedFileName = response.data.imageName;
          await this.$router.push({ name: "ReviewListPage" });
          window.location.reload(true);
        } else {
          console.log("이미지 파일을 선택하세요");
        }
      } catch (error) {
        console.log("파일 처리 과정에서 에러 발생:", error);
      }
    },
    handleNextClick() {
      if (this.step === 2) {
        this.onSubmit();
      } else {
        this.nextStep();
      }
    },
  },
};
</script>

<style scoped>
.container {
  position: relative;
  height: 100vh;
}

.full-height {
  height: 100%;
}

.card-custom {
  background-color: #2c2c2c;
  color: #fff;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.input-custom {
  background-color: #ffffff;
  color: #000000;
  border-radius: 4px;
  width: 100%;
  margin: 0;
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
  left: 16px;
}

.right-arrow {
  right: 16px;
}

.left-arrow:hover,
.right-arrow:hover {
  color: #4caf50;
}

.icon-green {
  color: #4caf50;
}

.rating-text {
  color: #000000;
  margin-bottom: 16px;
  font-size: 1.5em;
  text-align: center;
}

.cursor {
  display: inline-block;
  background-color: #000;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.stars-wrapper {
  display: flex;
  justify-content: center;
}

.star {
  font-size: 2rem;
  margin: 0 15px; /* 별 사이 간격 조절 */
  cursor: pointer;
  transition: color 0.3s;
}
</style>
