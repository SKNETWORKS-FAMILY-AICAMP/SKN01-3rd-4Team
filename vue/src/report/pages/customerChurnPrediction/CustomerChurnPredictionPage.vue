<template>
  <v-container class="membership-prediction">
    <h1 class="title">회원 예측</h1>
    <v-row>
      <v-col cols="12">
        <DatePredictionCard />
      </v-col>
      <v-col cols="12">
        <UserWithdrawalPredictionCard />
      </v-col>
      <v-col cols="12">
        <PreferredProductPrediction />
      </v-col>
      <v-col cols="12">
        <UserSpentPredictionCard />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DatePredictionCard from "@/report/pages/customerChurnPrediction/DateInfoPrediction.vue";
import UserWithdrawalPredictionCard from "@/report/pages/customerChurnPrediction/UserInfoPrediction.vue";
import PreferredProductPrediction from "@/report/pages/customerChurnPrediction/PreferredProductPrediction.vue";
import UserSpentPredictionCard from "@/report/pages/customerChurnPrediction/UserSpentPrediction.vue";

export default {
  components: {
    DatePredictionCard,
    UserWithdrawalPredictionCard,
    PreferredProductPrediction,
    UserSpentPredictionCard,
  },
};
</script>

<style scoped>
.membership-prediction {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
}
</style>