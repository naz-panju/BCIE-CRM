import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BarColorChartComponent = ({ leadStage }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    const labels = leadStage?.data?.map(item => item.name);
    const data = leadStage?.data?.map(item => item.lead_count);
    const colors = leadStage?.data?.map(item => item.lead_count > 0 ? item.colour : 'rgba(0, 0, 0, 0)');

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: '',
            data: data,
            backgroundColor: colors,
            borderWidth: 0,
            barThickness: 16,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            min: 0, // Ensure bars start at 0
            grace: '5%', // Adds padding at the top of the chart
            grid: {
              display: false,
            },
            ticks: {
              display: false,
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              display: false,
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
