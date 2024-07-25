<template>
    <v-card class="mt-6 pa-6">
        <v-row>
            <v-col cols="12" md="4">
                <v-card class="pa-4" outlined>
                    <v-icon size="48" color="primary" class="mb-4">mdi-shoe-print</v-icon>
                    <h2 class="subtitle-1 font-weight-bold mb-4">선호 신발 예측</h2>
                    <v-select
                        v-model="gender"
                        :items="genderOptions"
                        label="성별"
                        outlined
                        dense
                    ></v-select>
                    <v-text-field
                        v-model.number="birthYear"
                        label="출생 연도"
                        type="number"
                        outlined
                        dense
                    ></v-text-field>
                    <v-divider class="my-4"></v-divider>
                    <v-btn block color="primary" @click="trainModel" :loading="loading">
                        <v-icon left>mdi-brain</v-icon>
                        모델 학습
                    </v-btn>
                    <v-btn block color="success" class="mt-2" @click="predictPreferredProduct" :loading="loading">
                        <v-icon left>mdi-shoe-print"></v-icon>
                        선호 신발 예측
                    </v-btn>
                </v-card>
            </v-col>
            <v-col cols="12" md="8">
                <v-card class="pa-4" outlined>
                    <div v-if="trainResult || predictionResult || error">
                        <h3 class="subtitle-1 font-weight-bold mb-2">결과:</h3>
                        <v-alert v-if="trainResult" type="info" dense outlined>{{ trainResult }}</v-alert>
                        <v-alert v-if="error" type="error" dense outlined>{{ error }}</v-alert>
                        <div v-if="predictionResult">
                            <p><strong>선호 신발:</strong> {{ predictionResult.predicted_preferred_product }}</p>
                            <p><strong>선호 확률:</strong> {{ predictionResult.prefer_probability }}%</p>
                        </div>
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
            gender: null,
            birthYear: null,
            genderOptions: ["MALE", "FEMALE"],
            predictionResult: null,
            trainResult: null,
            error: null,
            loading: false,
        };
    },
    methods: {
        async trainModel() {
            this.executePostRequest("/train-preferred-product");
        },
        async predictPreferredProduct() {
            const data = {
                gender: this.gender,
                birth_year: this.birthYear,
            };
            this.executePostRequest("/predict-preferred-product", data, ["predicted_preferred_product", "prefer_probability"]);
        },
        async executePostRequest(url, data = {}, resultKeys = null) {
            this.resetState();
            this.loading = true;
            try {
                const response = await axiosInstance.fastapiAxiosInst.post(url, data, {
                    timeout: 60000,
                });
                if (resultKeys) {
                    this.predictionResult = {};
                    resultKeys.forEach(key => {
                        this.predictionResult[key] = response.data[key];
                    });
                } else {
                    this.trainResult = response.data.message;
                }
            } catch (err) {
                this.error = err.response ? err.response.data.error : err.message;
            } finally {
                this.loading = false;
            }
        },
        resetState() {
            this.predictionResult = null;
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