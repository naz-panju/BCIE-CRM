import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BarColorChartComponent = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    const colors = ['#e73f76', '#322fc8', '#ff9900', '#66b3ff', '#99ff99', '#ffcc99', '#c2c2f0', '#ff0000', '#00ff00', '#ffff00']; // Example color palette (10 colors)

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5', 'Label 6', 'Label 7', 'Label 8', 'Label 9', 'Label 10'], // 10 labels
        datasets: [
          {
            label: 'Leads',
            data: [80, 50, 70, 60, 90, 40, 100, 30, 20, 110], // 10 data points
            backgroundColor: colors.slice(0, 10), // Use the first 10 colors from the palette
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
            max: 120, // Adjust max value if your data requires it
            grid: {
              display: false, // Hide grid lines
            },
            ticks: {
              display: false, // Hide x-axis tick marks and labels
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
  }, []);

  return <canvas className='custom-height-bar-color' ref={chartRef}></canvas>;
};

export default BarColorChartComponent;
