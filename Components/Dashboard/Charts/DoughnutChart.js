import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const DoughnutChartComponent = ({ data }) => {
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
            data: [data?.achievement, data?.target],
            backgroundColor: ['#e73f76', '#322fc8'], // Example colors for each slice
            borderWidth: 10, // Adjust border width as desired
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
            display: false, // Disable title display
          },
          tooltip: {
            enabled: true, // Enable tooltips
            callbacks: {
              labelColor: function () {
                return {
                  borderColor: 'transparent',
                  backgroundColor: 'transparent',
                };
              },
              labelTextColor: function () {
                return 'white'; // Set text color for labels
              },
              // label: function (tooltipItem) {
              //   // Customize the tooltip label to only show text without any color box
              //   let label = tooltipItem.label || '';
              //   if (label) {
              //     label += ': ';
              //   }
              //   label += tooltipItem.raw;
              //   return label;
              // },
            },
            displayColors: false, // Disable color boxes in tooltips
          },
          hover: {
            mode: null, // Disable hover effects
          },
        },
      },
    });

    // Cleanup on unmount
    return () => {
      chart.destroy();
    };
  }, [data]);

  return <canvas ref={chartRef}></canvas>;
};

export default DoughnutChartComponent;
