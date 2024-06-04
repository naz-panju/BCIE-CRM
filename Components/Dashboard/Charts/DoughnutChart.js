import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const DoughnutChartComponent = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Achieved', 'Targets'],
        datasets: [
          {
            label: '',
            data: [25, 45],
            backgroundColor: ['#e73f76', '#322fc8'], // Example colors for each slice (not used on hover)
            borderWidth: 20, // Adjust border width as desired
            borderColor: '#fff', // Set white border color
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
            display: false, // Enable title display
            // text: 'Targets and Achievement', // Set title text
            // position: '', // Center the title
          },
          tooltip: {
            // Configure tooltip options
            enabled: false, // Enable tooltips
          },
          hover: { // Disable hover effects
            mode: null,
          },
        },
      },
    });

    // Cleanup on unmount
    return () => {
      chart.destroy();
    };
  }, []);

  return <canvas ref={chartRef}></canvas>;
};

export default DoughnutChartComponent;
