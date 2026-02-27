import React from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface Props {
  labels: string[]
  income: number[]
  expense: number[]
}

const MonthlyChart: React.FC<Props> = ({ labels, income, expense }) => {
  const data = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: income,
        backgroundColor: 'rgba(34,197,94,0.8)',
      },
      {
        label: 'Expense',
        data: expense,
        backgroundColor: 'rgba(239,68,68,0.85)',
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: false },
    },
    animation: false,
    scales: {
      y: { beginAtZero: true },
    },
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <Bar data={data} options={options} />
    </div>
  )
}

export default MonthlyChart
