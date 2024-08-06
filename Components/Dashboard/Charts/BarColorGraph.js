import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BarColorChartComponent = ({ leadStage }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    // const colors = ['#e73f76', '#322fc8', '#ff9900', '#66b3ff', '#99ff99', '#ffcc99', '#c2c2f0', '#ff0000', '#00ff00', '#ffff00']; // Example color palette (10 colors)

    const labels = leadStage?.data?.map(item => item.name);
    const data = leadStage?.data?.map(item => item.lead_count);
    const colors = leadStage?.data?.map(item => item.colour);

    // console.log(labels, data, colors);

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels, // 10 labels
        datasets: [
          {
            label: '',
            data: data, // 10 data points
            backgroundColor: colors, // Use the first 10 colors from the palette
            borderWidth: 0, // Remove border
            barThickness: 16, // Adjust this value for narrower bars
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false, // Hide legend by default
          },
          title: {
            display: false, // Hide title by default
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            // Adjust the minimum value to add space between bars and top of the chart
            suggestedMin: 0, // This can be adjusted if you want more padding
            suggestedMax: Math.max(...data) * 1.1, // Optional: increases the max value to ensure space at the top
            grid: {
                display: false,
            },
            ticks: {
                display: false,
            },
        },
          x: {
            grid: {
              display: false, // Hide grid lines
            },
            ticks: {
              display: false, // Hide x-axis tick marks and labels
            },
          },
        },
      },
    });

    // Cleanup on unmount
    return () => {
      chart.destroy();
    };
  }, [leadStage]);

  return <canvas className='custom-height-bar-color' ref={chartRef}></canvas>;
};

export default BarColorChartComponent;
