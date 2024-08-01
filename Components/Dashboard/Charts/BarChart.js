import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BarChartComponent = ({ data, from }) => {
    const chartRef = useRef(null);

    const getDayOfWeek = (dateString) => {
        const date = new Date(dateString);
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[date.getDay()];
    };

    // Initialize an object to store the counts for each day of the week



    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: from == 'app' ? 'Applications' : 'Leads',
                        data: data,
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

    return <canvas className='custom-height' ref={chartRef}></canvas>;
};

export default BarChartComponent;
