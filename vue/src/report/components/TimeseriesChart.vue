<template>
    <div>
      <h2 style="text-align: center;">월별 판매량 예측</h2>
      <div style="display: flex; justify-content: center; margin-bottom: 20px;">
        <button
          @click="trainModel"
          style="background-color: lightgrey; border: 3px solid grey; margin: 10px; height: 50px;"
        >
          시계열 모델 훈련
        </button>
        <button
          @click="getForecastData"
          style="background-color: lightgrey; border: 3px solid grey; margin: 10px; height: 50px;"
        >
          구매동향 시계열 그래프 그리기
        </button>
      </div>
      <div id="bar-chart"></div>
    </div>
</template>
  
<script>
  import axiosInstance from "@/utility/axiosInstance";
  import * as d3 from "d3";
  
  export default {
    data() {
      return {
        chartData: null,
      };
    },
    methods: {
      async trainModel() {
        try {
          console.log("Training timeseries model...");
          await axiosInstance.fastapiAxiosInst.post("/train-timeseries");
          alert("시계열 모델 훈련이 완료되었습니다.");
        } catch (error) {
          console.error("Error training timeseries model:", error);
          alert("모델 훈련 중 오류가 발생했습니다.");
        }
      },
      async getForecastData() {
        try {
          console.log("Fetching forecast data...");
          const response = await axiosInstance.fastapiAxiosInst.get(
            "/timeseries-forecast",
            { params: { steps: 12 } }
          );
          console.log("Forecast data:", response.data.forecast);
          this.chartData = response.data.forecast;
          this.renderChart();
        } catch (error) {
          console.error("Error fetching forecast data:", error);
          alert("예측 데이터 가져오는 중 오류가 발생했습니다.");
        }
      },
      renderChart() {
        const data = this.chartData;
        d3.select("#bar-chart").select("svg").remove(); // 기존 차트를 제거하여 중복 생성 방지
  
        const svgWidth = document.getElementById('bar-chart').clientWidth; // 부모 요소의 너비를 가져옴
        const svgHeight = 400;
  
        const svg = d3
          .select("#bar-chart")
          .append("svg")
          .attr("width", "100%")
          .attr("height", svgHeight)
          .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`) // viewBox 속성으로 비율 유지
          .attr("preserveAspectRatio", "xMidYMid meet"); // 비율 유지
  
        const margin = { top: 20, right: 20, bottom: 30, left: 50 };
        const width = svgWidth - margin.left - margin.right;
        const height = svgHeight - margin.top - margin.bottom;
        const g = svg
          .append("g")
          .attr("transform", `translate(${margin.left},${margin.top})`);
  
        // 그라데이션 정의
        const gradient = svg
          .append("defs")
          .append("linearGradient")
          .attr("id", "barGradient")
          .attr("x1", "0%")
          .attr("y1", "0%")
          .attr("x2", "0%")
          .attr("y2", "100%");
  
        gradient
          .append("stop")
          .attr("offset", "0%")
          .attr("stop-color", "greenyellow")
          .attr("stop-opacity", 1);
  
        gradient
          .append("stop")
          .attr("offset", "100%")
          .attr("stop-color", "green")
          .attr("stop-opacity", 1);
  
        const x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
        const y = d3.scaleLinear().rangeRound([height, 0]);
  
        x.domain(data.map((d, i) => i + 1)); // 1부터 시작하도록 인덱스 변경
        y.domain([0, d3.max(data, (d) => d)]);
  
        g.append("g")
          .attr("transform", `translate(0,${height})`)
          .call(d3.axisBottom(x));
  
        g.append("g").call(d3.axisLeft(y));
  
        g.selectAll(".bar")
          .data(data)
          .enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", (d, i) => x(i + 1))
          .attr("y", height) // 초기 y 위치를 height로 설정하여 막대가 아래에서 시작하도록 함
          .attr("width", x.bandwidth())
          .attr("height", 0) // 초기 높이를 0으로 설정하여 애니메이션 시작
          .attr("fill", "url(#barGradient)") // 막대 색상을 그라데이션으로 설정
          .transition() // 애니메이션 시작
          .duration(3000) // 애니메이션 지속 시간 (3초)
          .attr("y", (d) => y(d)) // 최종 y 위치
          .attr("height", (d) => height - y(d)); // 최종 높이
      },
    },
  };
</script>
  
<style scoped>
#bar-chart {
width: 100%;
height: 400px;
}

.bar {
fill: url(#barGradient);
}

h2 {
font-size: 1.5rem;
color: #038c7f;
margin-bottom: 16px;
text-align: center;
}
</style>
  