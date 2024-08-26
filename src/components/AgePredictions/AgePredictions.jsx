// src/components/AgePieChart/AgePieChart.js

import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import "./AgePredictions.css";
ChartJS.register(Title, Tooltip, Legend, ArcElement);

function AgePredictions({ agePredictions }) {
  // Prepare the data for the pie chart
  const data = {
    labels: agePredictions.map((concept) => concept.name),
    datasets: [
      {
        data: agePredictions.map((concept) => concept.value * 100, "%"),

        backgroundColor: [
          "rgba(0, 128, 0, 0.7)", // Dark green
          "rgba(255, 180, 50, 0.7)", // Darker yellow
          "rgba(200, 50, 90, 0.7)", // Darker pink
        ],

        borderWidth: 1,
      },
    ],
  };

  return (
    <div
      className=" age-predictions "
      style={{ width: "300px", height: "300px" }}
    >
      <h3>Top 3 Age Predictions:</h3>
      <Pie data={data} />
    </div>
  );
}

export default AgePredictions;
