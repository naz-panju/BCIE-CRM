import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BarChartComponent = () => {
    const chartRef = useRef(null);

    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'Leads',
                        data: [80, 80, 80, 50, 50, 40, 103],
                        backgroundColor: '#29cc39', // Green color without alpha
                        borderWidth: 0, // Remove border
                        barThickness: 9, // Adjust this value for narrower bars
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
                        max: 120,
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

export default BarChartComponent;
