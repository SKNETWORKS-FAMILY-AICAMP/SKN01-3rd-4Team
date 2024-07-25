<template>
  <v-card class="mt-6 pa-6">
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="pa-4" outlined>
          <v-icon size="48" color="primary" class="mb-4">mdi-cash</v-icon>
          <h2 class="subtitle-1 font-weight-bold mb-4">사용자 지출 예측</h2>
          <v-text-field
            v-model.number="accountId"
            label="계정 ID"
            type="number"
            outlined
            dense
          ></v-text-field>
          <v-btn
            block
            color="info"
            class="mt-2"
            @click="fetchUserInfo"
            :loading="loading"
          >
            <v-icon left>mdi-account-search</v-icon>
            사용자 정보 불러오기
          </v-btn>
          <v-divider class="my-4"></v-divider>
          <v-btn
            block
            color="primary"
            @click="trainModel"
            :loading="loading"
            :disabled="!form.gender"
          >
            <v-icon left>mdi-brain</v-icon>
            모델 학습
          </v-btn>
          <v-btn
            block
            color="success"
            class="mt-2"
            @click="predictSpent"
            :loading="loading"
            :disabled="!form.gender"
          >
            <v-icon left>mdi-cash-usd</v-icon>
            지출 예측
          </v-btn>
        </v-card>
      </v-col>
      <v-col cols="12" md="8">
        <v-card class="pa-4" outlined>
          <div v-if="trainResult || result || error">
            <h3 class="subtitle-1 font-weight-bold mb-2">결과:</h3>
            <v-alert v-if="trainResult" type="info" dense outlined>{{
              trainResult
            }}</v-alert>
            <v-alert v-if="error" type="error" dense outlined>{{ error }}</v-alert>
            <div v-if="result">
              <p>예상 지출: {{ result.expected_spent }}</p>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-card>

  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title class="headline">알림</v-card-title>
      <v-card-text>사용자 정보를 불러왔습니다.</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="closeDialog">확인</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axiosInstance from "@/utility/axiosInstance";

export default {
  data() {
    return {
      dialog: false,
      accountId: null,
      form: {
        gender: "",
        birth_year: null,
        num_logins: null,
        average_login_interval: null,
        days_from_last_login: null,
        member_maintenance: null,
        num_orders: null,
        average_order_interval: null,
      },
      genderOptions: ["MALE", "FEMALE"], // Added gender options
      result: null,
      trainResult: null,
      error: null,
      loading: false,
    };
  },
  methods: {
    closeDialog() {
      this.dialog = false;
    },
    async fetchUserInfo() {
      this.resetState();
      this.loading = true;
      try {
        const response = await axiosInstance.fastapiAxiosInst.post(
          "/user-info",
          { account_id: this.accountId },

          {
            timeout: 60000,
          }
        );
        console.log("User info response:", response.data); // Debugging
        Object.assign(this.form, response.data);
        console.log("Form object after fetching info:", this.form); // Debugging
        this.dialog = true;
      } catch (err) {
        this.error = err.response ? err.response.data.error : err.message;
      } finally {
        this.loading = false;
      }
    },
    async trainModel() {
      // const data = JSON.parse(JSON.stringify(this.form)); // Convert Proxy to regular object
      const data = this.form;
      this.executePostRequest("/train-user-spent", data, null, "모델 학습 완료");
    },
    async predictSpent() {
      const data = JSON.parse(JSON.stringify(this.form)); // Convert Proxy to regular object
      // const data = this.form; // Convert Proxy to regular object
      console.log("Data being sent to predict:", JSON.stringify(data)); // Debugging
      this.executePostRequest("/predict-user-spent", data, "expected_spent");
    },
    async executePostRequest(url, data = {}, resultKey = null, successMessage = null) {
      this.resetState();
      this.loading = true;
      try {
        const response = await axiosInstance.fastapiAxiosInst.post(url, data, {
          timeout: 60000,
        });
        console.log("Response from server:", response.data); // Debugging
        if (resultKey) {
          this.result = response.data;
        } else if (successMessage) {
          this.trainResult = successMessage;
        }
      } catch (err) {
        this.error = err.response ? err.response.data.error : err.message;
      } finally {
        this.loading = false;
      }
    },
    resetState() {
      this.result = null;
      this.trainResult = null;
      this.error = null;
    },
  },
};
</script>

<style scoped>
.v-card {
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.v-btn {
  border-radius: 8px;
}

.v-alert {
  margin-bottom: 1rem;
}
</style>
