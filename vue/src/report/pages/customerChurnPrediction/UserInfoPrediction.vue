<template>
    <v-card class="mt-6 pa-6">
        <v-row>
            <v-col cols="12" md="4">
                <v-card class="pa-4" outlined>
                    <v-icon size="48" color="primary" class="mb-4">mdi-account-check</v-icon>
                    <h2 class="subtitle-1 font-weight-bold mb-4">특정 회원 이탈 예측</h2>
                    <v-text-field v-model.number="accountId" label="계정 ID" type="number" outlined dense></v-text-field>
                    <v-btn block color="info" class="mt-2" @click="fetchUserInfo" :loading="loading">
                        <v-icon left>mdi-account-search</v-icon>
                        사용자 정보 불러오기
                    </v-btn>
                    <v-divider class="my-4"></v-divider>
                    <v-btn block color="primary" @click="trainUserModel" :loading="loading" :disabled="!user.gender">
                        <v-icon left>mdi-brain</v-icon>
                        모델 학습
                    </v-btn>
                    <v-btn block color="success" class="mt-2" @click="predictUserWithdrawal" :loading="loading" :disabled="!user.gender">
                        <v-icon left>mdi-account-off</v-icon>
                        회원 이탈 예측
                    </v-btn>
                </v-card>
            </v-col>
            <v-col cols="12" md="8">
                <v-card class="pa-4" outlined>
                    <div v-if="trainResult || userResult || error">
                        <h3 class="subtitle-1 font-weight-bold mb-2">결과:</h3>
                        <v-alert v-if="trainResult" type="info" dense outlined>
                            {{ trainResult }}
                        </v-alert>
                        <div v-if="userResult">
                            <p>회원 이탈 예측: {{ userResult.predicted_user_withdraw ? 'Yes' : 'No' }}</p>
                            <p>이탈 확률: {{ userResult.withdraw_probability }}%</p>
                        </div>
                        <v-alert v-if="error" type="error" dense outlined>{{ error }}</v-alert>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
import axiosInstance from "@/utility/axiosInstance";

export default {
    data() {
        return {
            accountId: null,
            user: {
                gender: '',
                birth_year: null,
                num_logins: null,
                average_login_interval: null,
                days_from_last_login: null,
                member_maintenance: null,
                num_orders: null,
                average_order_interval: null,
                total_spent: null,
                total_quantity: null,
            },
            genderOptions: ['MALE', 'FEMALE'],
            userResult: null,
            trainResult: null,
            error: null,
            loading: false,
        };
    },
    methods: {
        async fetchUserInfo() {
            this.resetState();
            this.loading = true;
            try {
                const response = await axiosInstance.fastapiAxiosInst.post("/user-info", { account_id: this.accountId }, {
                    timeout: 60000,
                });
                console.log("User info response:", response.data);
                Object.assign(this.user, response.data);
                console.log("User object after fetching info:", this.user);
            } catch (err) {
                this.error = err.response ? err.response.data.error : err.message;
            } finally {
                this.loading = false;
            }
        },
        async trainUserModel() {
            const data = { ...this.user };
            this.executePostRequest("/train-user-withdraw", data, null, "모델 학습 완료");
        },
        async predictUserWithdrawal() {
            const data = { ...this.user };
            console.log("Data being sent to predict:", JSON.stringify(data));
            this.executePostRequest("/predict-user-withdraw", data, "predicted_user_withdraw");
        },
        async executePostRequest(url, data = {}, resultKey = null, successMessage = null) {
            this.resetState();
            this.loading = true;
            try {
                const response = await axiosInstance.fastapiAxiosInst.post(url, data, {
                    timeout: 60000,
                });
                console.log("Response from server:", response.data);
                if (resultKey) {
                    this.userResult = response.data;
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
            this.userResult = null;
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