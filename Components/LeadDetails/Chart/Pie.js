import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

export default function BasicPie() {
  return (
    <PieChart
      series={[
        {
          data: [
            { id: 0, value: 40, },
            { id: 1, value: 50, },
          ],
          innerRadius: 10,
          // cx: 50,
          // cy: 50,
          
        },
      ]}
      width={180}
      height={180}
    />
  );
}
