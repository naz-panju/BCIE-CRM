import React from 'react';
import { RadialBarChart, RadialBar, Legend, Tooltip } from 'recharts';

const data = [
  {
    name: '18-24',
    uv: 31.47,
    pv: 2400,
    fill: '#8884d8',
  },
];

const RadialBarChartComponent = () => {
  return (
    <RadialBarChart
      width={500}
      height={500}
      cx={250}
      cy={250}
      innerRadius={20}
      outerRadius={140}
      barSize={10}
      data={data}
    >
      <RadialBar
        minAngle={15} 
        label={{ position: 'insideStart', fill: '#fff' }}
        background
        clockWise
        dataKey="uv"
      />
      <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={style} />
      <Tooltip />
    </RadialBarChart>
  );
};

const style = {
  top: 0,
  left: 350,
  lineHeight: '24px',
};

export default RadialBarChartComponent;
