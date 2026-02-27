export const formatCurrency = (amount: number): string => {
  // format in Indian rupees
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount)
}

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export const formatDateInput = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const getMonthName = (month: number): string => {
  const date = new Date(2000, month - 1)
  return new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date)
}

export type RecordItem = { type: 'income' | 'expense'; amount: number | string; date: string }

export const groupRecordsByMonth = (records: RecordItem[]) => {
  // Months labels Jan..Dec
  const labels = Array.from({ length: 12 }, (_, i) => new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(2000, i)))
  const income = Array(12).fill(0)
  const expense = Array(12).fill(0)

  records.forEach((r) => {
    const d = new Date(r.date)
    if (isNaN(d.getTime())) return
    const m = d.getMonth()
    const amt = Math.abs(Number(r.amount) || 0)
    if (r.type === 'income') income[m] += amt
    else if (r.type === 'expense') expense[m] += amt
  })

  const savings = labels.map((_, i) => income[i] - expense[i])

  return { labels, income, expense, savings }
}
