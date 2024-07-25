<template>
  <div class="analysis-container">
    <h2 class="title">시계열 분석 결과</h2>
    <div class="button-group">
      <button @click="trainModel" class="btn btn-train">
        <i class="fas fa-cogs"></i> 시계열 모델 훈련
      </button>
      <button @click="getForecastData" class="btn btn-forecast">
        <i class="fas fa-chart-line"></i> 구매동향 그래프 그리기
      </button>
    </div>
    <div id="bar-chart" class="chart-container"></div>
  </div>
</template>

<script>
import axiosInstance from "@/utility/axiosInstance";
// npm install d3 --legacy-peer-deps
import * as d3 from "d3";

export default {
  data() {
    return {
      accuracy: 0,
      X: [],
      y: [],
      x_values: [],
      y_values: [],
      svgWidth: 0,
      svgHeight: 0,
      margin: { top: 20, right: 50, bottom: 50, left: 50 },
      resizeTimer: null,
    };
  },
  mounted() {
    this.fetchLogisticRegressionData();
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    async fetchLogisticRegressionData() {
      try {
        const response = await axiosInstance.fastapiAxiosInst.get("/logistic-regression");
        const data = response.data;
        console.log("result:", data);

        this.accuracy = data.accuracy;
        this.X = data.data_point.X;
        this.y = data.data_point.y;
        this.x_values = data.decision_boundary.x_values;
        this.y_values = data.decision_boundary.y_values;

        this.createChart();
      } catch (error) {
        console.error("로지스틱 회귀 분석 중 에러 발생:", error);
      }
    },
    createChart() {
      if (
        !this.X.length ||
        !this.y.length ||
        !this.x_values.length ||
        !this.y_values.length
      ) {
        console.warn("데이터가 제대로 처리되지 않고 있습니다!");
        return;
      }

      // svg 컨테이너 크기 설정
      const chartContainer = this.$refs.chartContainer;
      this.svgWidth = chartContainer.clientWidth;
      this.svgHeight = chartContainer.clientHeight;

      // d3 플롯팅 목적으로 사용할 template에 있는 ref svg 요소를 초기화
      d3.select(this.$refs.svg).selectAll("*").remove();

      // svg 요소 크기 지정
      const svg = d3
        .select(this.$refs.svg)
        .attr("width", this.svgWidth)
        .attr("height", this.svgHeight);

      // 마진 설정 및 그룹 요소 추가
      const g = svg
        .append("g")
        .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

      const x = d3
        .scaleLinear()
        .domain(d3.extent(this.X, (d) => d[0]))
        .range([0, this.svgWidth - this.margin.left - this.margin.right]);

      const y = d3
        .scaleLinear()
        .domain(d3.extent(this.X, (d) => d[1]))
        .range([this.svgHeight - this.margin.top - this.margin.bottom, 0]);

      g.append("g")
        .attr(
          "transform",
          `translate(0, ${this.svgHeight - this.margin.top - this.margin.bottom})`
        )
        .call(d3.axisBottom(x));

      g.append("g").call(d3.axisLeft(y));

      g.selectAll("circle")
        .data(this.X)
        .enter()
        .append("circle")
        .attr("cx", (d) => x(d[0]))
        .attr("cy", (d) => y(d[1]))
        .attr("r", 5)
        .style("fill", (d, i) => (this.y[i] === 1 ? "green" : "blue"));

      // 결정 경계를 그리는 코드 추가
      const line = d3
        .line()
        .x((d) => x(d[0]))
        .y((d) => y(d[1]));

      const decisionBoundary = this.x_values.map((x_value, i) => [
        x_value,
        this.y_values[i],
      ]);

      g.append("path")
        .datum(decisionBoundary)
        .attr("d", line)
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("fill", "none");
    },
    handleResize() {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        const chartContainer = this.$refs.chartContainer;
        this.svgWidth = chartContainer.clientWidth;
        this.svgHeight = chartContainer.clientHeight;

        d3.select(this.$refs.svg).attr(
          "viewBox",
          `0 0 ${this.svgWidth} ${this.svgHeight}`
        );

        this.createChart();
      }, 200);
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css");

.analysis-container {
  font-family: "Roboto", sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-weight: 700;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-train {
  background-color: #3498db;
}

.btn-forecast {
  background-color: #2ecc71;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.chart-container {
  background-color: #fff;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

#bar-chart {
  width: 100%;
  height: 400px;
}

.bar {
  fill: url(#barGradient);
}
</style>
