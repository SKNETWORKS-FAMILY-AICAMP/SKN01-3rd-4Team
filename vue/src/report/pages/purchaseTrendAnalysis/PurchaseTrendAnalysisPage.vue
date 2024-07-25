<template>
  <v-container class="chart-container">
    <div class="title-section">
      <text>런닝화 구매 동향 분석</text>
    </div>
    
    <v-row class="chart-row" style="margin-bottom: 5%">
        <v-col cols="6">
        <h2>전체 사용자 남녀비율</h2>
        <v-img
        src="@/assets/images/fixed/1.png"
        class="grey lighten-2"
        height="500"
        weight="500"
        />
        </v-col>
        <v-col cols="6">
            <h2>남녀별 판매량</h2>
            <v-img
            src="@/assets/images/fixed/2.png"
            class="grey lighten-2"
            height="500"
            weight="500"
            />
        </v-col>
    </v-row>    
    
    <h2>상품별 판매량</h2>
    <v-img
      src="@/assets/images/fixed/3.png"
      class="grey lighten-2"
      height="500"
      weight="2500"
    />
    <hr />
    <v-row class="chart-row" style="margin-bottom: 5%">
      <v-col cols="12">
        <timeseries-chart></timeseries-chart>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TimeseriesChart from "@/report/components/TimeseriesChart.vue";

import axiosInstance from "@/utility/axiosInstance";
import * as d3 from "d3";

export default {
  components: {
    TimeseriesChart,
  },
  data() {
    return {
      nDays: 30,
      result: null,
      trainResult: null,
      error: null,
      loading: false,
      chartTitle: "",
    };
  },
  methods: {
    async trainModel() {
      this.executePostRequest("/train-date-info", {}, null, "모델 학습 완료");
    },
    async predictTotalUser() {
      const data = { n_days: this.nDays };
      this.executePostRequest(
        "/predict-total-user",
        data,
        "predicted_total_user",
        `${this.nDays}일간의 총 가입자 수 예측량`
      );
    },
    async executePostRequest(url, data = {}, resultKey = null, title = "") {
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
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", 0 - margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text(this.chartTitle);

      const today = new Date();

      // Create an array of dates starting from today
      const dates = this.result.map(
        (d, i) => new Date(today.getTime() + i * 24 * 60 * 60 * 1000)
      );
      const formatDate = d3.timeFormat("%Y-%m-%d");

      const x = d3.scaleBand().range([0, width]).domain(dates).padding(0.1); // Added padding to ensure ticks are properly spaced

      const y = d3.scaleLinear().range([height, 0]);

      const line = d3
        .line()
        .x((d, i) => x(dates[i]) + x.bandwidth() / 2) // Adjusted to center the points
        .y((d) => y(d));

      y.domain([
        d3.min(this.result) - (d3.max(this.result) - d3.min(this.result)) * 0.1,
        d3.max(this.result),
      ]);

      // Calculate the indices for ticks at every 20% of the length of data
      const tickIndices = [];
      const numTicks = 5; // 20% increments (100% / 20% = 5 ticks)
      for (let i = 0; i <= numTicks; i++) {
        tickIndices.push(Math.round((i * (dates.length - 1)) / numTicks));
      }

      // Format the x-axis ticks
      svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(
          d3
            .axisBottom(x)
            .tickValues(tickIndices.map((i) => dates[i]))
            .tickFormat((d) => formatDate(d))
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

      const focus = svg.append("g").attr("class", "focus").style("display", "none");

      focus.append("circle").attr("r", 5).attr("fill", "green");

      const infoBox = focus.append("g").attr("class", "infoBox");

      infoBox
        .append("rect")
        .attr("width", 150)
        .attr("height", 50)
        .attr("rx", 10)
        .attr("ry", 10)
        .attr("fill", "rgba(255, 255, 255, 0.8)")
        .attr("stroke", "black")
        .attr("stroke-width", 1);

      const infoText = infoBox
        .append("text")
        .attr("x", 75) // Centering text horizontally
        .attr("y", 25) // Centering text vertically
        .attr("fill", "black")
        .style("font-size", "12px")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle");

      svg
        .append("rect")
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
        .on("mousemove", (event) =>
          this.mousemove(
            event,
            dates,
            x,
            y,
            focus,
            infoBox,
            infoText,
            formatDate,
            width,
            height
          )
        );

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
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap");

body {
  font-family: "Roboto", sans-serif;
  background-color: #f5f5f5;
  color: #333;
}

.chart-container {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-top: 24px;
}

.title-section {
  padding: 24px;
  font-weight: 700;
  font-size: 2rem;
  text-align: center;
  background-color: #07221f;
  color: #ffffff;
  border-radius: 8px 8px 0 0;
  margin-bottom: 24px;
}

h2 {
  font-size: 1.5rem;
  color: #038c7f;
  margin-bottom: 16px;
  text-align: center;
}

.chart-row {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}

.input-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  margin-top: 24px;
}

.input-field {
  width: 100%;
  padding: 12px;
  margin-top: 8px;
  border-radius: 4px;
  border: 1px solid #dcdcdc;
  transition: border-color 0.3s ease;
}

.input-field:focus {
  border-color: #038c7f;
  outline: none;
}

.button-container {
  margin-top: 32px;
  display: flex;
  justify-content: center;
  gap: 24px;
}

.btn {
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 500;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn.train {
  background-color: #038c7f;
}

.btn.train:hover {
  background-color: #026b5f;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn.predict {
  background-color: #04bf9d;
}

.btn.predict:hover {
  background-color: #03a085;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.v-img {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 32px;
}

@media (max-width: 768px) {
  .chart-container {
    padding: 16px;
  }

  .title-section {
    font-size: 1.5rem;
    padding: 16px;
  }

  h2 {
    font-size: 1.2rem;
  }

  .btn {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
}
</style>
