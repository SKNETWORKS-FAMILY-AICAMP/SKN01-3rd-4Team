<template>
    <v-card class="mt-6 pa-6">
        <v-row>
            <v-col cols="12" md="4">
                <v-card class="pa-4" outlined>
                    <v-icon size="48" color="primary" class="mb-4">mdi-calendar</v-icon>
                    <h2 class="subtitle-1 font-weight-bold mb-4">날짜 데이터를 통한 이탈 정보 예측</h2>
                    <v-text-field v-model.number="nDays" label="예측할 일 수 (오늘부터)" type="number" outlined dense
                        append-outer-icon="mdi-calendar-range"></v-text-field>
                    <v-divider class="my-4"></v-divider>
                    <v-btn block color="primary" @click="trainModel" :loading="loading">
                        <v-icon left>mdi-brain</v-icon>
                        모델 학습
                    </v-btn>
                    <v-btn block color="success" class="mt-2" @click="predictTotalUser" :loading="loading">
                        <v-icon left>mdi-account-group</v-icon>
                        총 사용자 예측
                    </v-btn>
                    <v-btn block color="warning" class="mt-2" @click="predictProfit" :loading="loading">
                        <v-icon left>mdi-cash</v-icon>
                        수익 예측
                    </v-btn>
                </v-card>
            </v-col>
            <v-col cols="12" md="8">
                <v-card class="pa-4" outlined>
                    <div v-if="trainResult || result || error">
                        <h3 class="subtitle-1 font-weight-bold mb-2">결과:</h3>
                        <v-alert v-if="trainResult" type="info" dense outlined>{{ trainResult }}</v-alert>
                        <v-alert v-if="error" type="error" dense outlined>{{ error }}</v-alert>
                        <div v-if="result" ref="chart" class="chart-container"></div>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
import axiosInstance from "@/utility/axiosInstance";
import * as d3 from "d3";

export default {
    data() {
        return {
            nDays: 30, // Set default value to 30
            result: null,
            trainResult: null,
            error: null,
            loading: false,
            chartTitle: '', // Added chartTitle to the data
        };
    },
    methods: {
        async trainModel() {
            this.executePostRequest("/train-date-info", {}, null, "모델 학습 완료");
        },
        async predictTotalUser() {
            const data = { n_days: this.nDays };
            this.executePostRequest("/predict-total-user", data, "predicted_total_user", `${this.nDays}일간의 총 가입자 수 예측량`);
        },
        async predictProfit() {
            const data = { n_days: this.nDays };
            this.executePostRequest("/predict-profit", data, "predicted_profit", `${this.nDays}일간 일별 수익 예측량`);
        },
        async executePostRequest(url, data = {}, resultKey = null, title = '') {
            this.resetState();
            this.loading = true;
            this.chartTitle = title; // Set the chart title
            try {
                const response = await axiosInstance.fastapiAxiosInst.post(url, data, {
                    timeout: 60000,
                });
                if (resultKey) {
                    this.result = response.data[resultKey];
                    this.$nextTick(() => this.drawChart());
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
            this.result = null;
            this.trainResult = null;
            this.error = null;
        },
        drawChart() {
            if (!this.result) {
                this.error = "Invalid data format received";
                return;
            }

            const margin = { top: 30, right: 30, bottom: 60, left: 70 }; // Increased bottom and left margins
            const width = 600 - margin.left - margin.right;
            const height = 400 - margin.top - margin.bottom;

            // Clear previous chart
            d3.select(this.$refs.chart).selectAll("*").remove();

            const svg = d3
                .select(this.$refs.chart)
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            // Add title to the chart
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", 0 - margin.top / 2)
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .style("font-weight", "bold")
                .text(this.chartTitle);

            const today = new Date();

            // Create an array of dates starting from today
            const dates = this.result.map((d, i) => new Date(today.getTime() + i * 24 * 60 * 60 * 1000));
            const formatDate = d3.timeFormat("%Y-%m-%d");

            const x = d3.scaleBand()
                .range([0, width])
                .domain(dates)
                .padding(0.1); // Added padding to ensure ticks are properly spaced

            const y = d3.scaleLinear().range([height, 0]);

            const line = d3
                .line()
                .x((d, i) => x(dates[i]) + x.bandwidth() / 2) // Adjusted to center the points
                .y((d) => y(d));

            y.domain([d3.min(this.result) - (d3.max(this.result) - d3.min(this.result)) * 0.1, d3.max(this.result)]);

            // Calculate the indices for ticks at every 20% of the length of data
            const tickIndices = [];
            const numTicks = 5; // 20% increments (100% / 20% = 5 ticks)
            for (let i = 0; i <= numTicks; i++) {
                tickIndices.push(Math.round((i * (dates.length - 1)) / numTicks));
            }

            // Format the x-axis ticks
            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x)
                    .tickValues(tickIndices.map(i => dates[i]))
                    .tickFormat(d => formatDate(d))
                )
                .selectAll("text")
                .attr("transform", "rotate(-45)")
                .style("text-anchor", "end");

            svg.append("g").call(d3.axisLeft(y));

            svg
                .append("path")
                .datum(this.result)
                .attr("fill", "none")
                .attr("stroke", "#038C7F")
                .attr("stroke-width", 2)
                .attr("d", line);

            const focus = svg.append("g")
                .attr("class", "focus")
                .style("display", "none");

            focus.append("circle")
                .attr("r", 5)
                .attr("fill", "green");

            const infoBox = focus.append("g")
                .attr("class", "infoBox");

            infoBox.append("rect")
                .attr("width", 150)
                .attr("height", 50)
                .attr("rx", 10)
                .attr("ry", 10)
                .attr("fill", "rgba(255, 255, 255, 0.8)")
                .attr("stroke", "black")
                .attr("stroke-width", 1);

            const infoText = infoBox.append("text")
                .attr("x", 75) // Centering text horizontally
                .attr("y", 25) // Centering text vertically
                .attr("fill", "black")
                .style("font-size", "12px")
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle");

            svg.append("rect")
                .attr("class", "overlay")
                .attr("width", width)
                .attr("height", height)
                .style("fill", "none")
                .style("pointer-events", "all")
                .on("mouseover", () => {
                    focus.style("display", null);
                    infoBox.style("display", null);
                })
                .on("mouseout", () => {
                    focus.style("display", "none");
                    infoBox.style("display", "none");
                })
                .on("mousemove", (event) => this.mousemove(event, dates, x, y, focus, infoBox, infoText, formatDate, width, height));

            const bisectDate = d3.bisector((d, i) => dates[i]).left;
        },
        mousemove(event, dates, x, y, focus, infoBox, infoText, formatDate, width, height) {
            const [x0] = d3.pointer(event);
            const dateIndex = Math.floor(x0 / x.step());
            const date = dates[dateIndex];
            const value = this.result[dateIndex];
            if (dateIndex >= 0 && dateIndex < dates.length) {
                const focusX = x(date) + x.bandwidth() / 2;
                const focusY = y(value);
                focus.attr("transform", `translate(${focusX},${focusY})`);
                infoText.text(`${formatDate(date)}: ${value}`);
                // Adjust infoBox position to ensure it fits within the chart area
                let infoBoxX = focusX - 75;
                let infoBoxY = focusY - 60;
                if (infoBoxX < 0) infoBoxX = 0;
                if (infoBoxY < 0) infoBoxY = 0;
                if (infoBoxX + 150 > width) infoBoxX = width - 150;
                if (infoBoxY + 50 > height) infoBoxY = height - 50;
                infoBox.attr("transform", `translate(${infoBoxX},${infoBoxY})`);
            }
        },
        getChartTitle() {
            return this.$route.path.includes("profit") 
                ? `${this.nDays}일간 일별 수익 예측량` 
                : `${this.nDays}일간의 총 가입자 수 예측량`;
        }
    },
};
</script>

<style scoped>
.chart-container {
    width: 100%;
    height: 400px;
}

.v-card {
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.v-btn {
    border-radius: 8px;
}

.v-alert {
    margin-bottom: 1rem;
}

.infoBox rect {
    filter: url(#drop-shadow);
}

svg {
    font-family: Arial, sans-serif;
}

.infoBox text {
    font-size: 12px;
}
</style>