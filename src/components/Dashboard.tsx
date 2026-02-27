import React, { useState, useEffect } from 'react'
import { addRecord, fetchAll, deleteRecord, fetchSummary } from '../lib/api'
import { formatCurrency, groupRecordsByMonth } from '../lib/utils'
import MonthlyChart from './MonthlyChart'

interface RecordItem {
  id: string
  type: 'income' | 'expense'
  amount: number
  date: string
}

interface Summary {
  income: number
  expense: number
  savings: number
}

const Dashboard: React.FC = () => {
  const [records, setRecords] = useState<RecordItem[]>([])
  const [summary, setSummary] = useState<Summary>({ income: 0, expense: 0, savings: 0 })
  // initialize with zeros for each month to avoid rendering issues
  const [monthlyExpenses, setMonthlyExpenses] = useState<number[]>(Array(12).fill(0)) // 0..11
  const [monthlyExpenseCounts, setMonthlyExpenseCounts] = useState<number[]>(Array(12).fill(0))
  const [monthlyIncome, setMonthlyIncome] = useState<number[]>(Array(12).fill(0))
  const [monthlySavings, setMonthlySavings] = useState<number[]>(Array(12).fill(0))
  const [monthLabels, setMonthLabels] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    date: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [allRes, sumRes] = await Promise.all([fetchAll(), fetchSummary()])
      if (allRes.error) setError(allRes.error)
      else if (allRes.data) {
        setRecords(allRes.data)
        // compute monthly totals (income, expense, savings) for current year
        const now = new Date()
        const year = now.getFullYear()
        const filtered = allRes.data.filter((r: any) => new Date(r.date).getFullYear() === year)
        const grouped = groupRecordsByMonth(filtered)
        // grouped.income / grouped.expense / grouped.savings are arrays length 12
        setMonthlyExpenses(grouped.expense)
        setMonthlyIncome(grouped.income)
        setMonthlySavings(grouped.savings)
        setMonthLabels(grouped.labels)
        // compute expense counts per month
        const counts = Array(12).fill(0)
        filtered.forEach((r: any) => {
          if (r.type !== 'expense') return
          const m = new Date(r.date).getMonth()
          counts[m] += 1
        })
        setMonthlyExpenseCounts(counts)
        // also update summary savings from grouped if needed (summary already comes from /summary)
      }
      if (sumRes.error) setError(sumRes.error)
      else if (sumRes.data) setSummary(sumRes.data)
    } catch (e) {
      console.error(e)
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.amount || !form.date) {
      setError('Amount and date are required')
      return
    }

    setSubmitting(true)
    try {
      const res = await addRecord({
        type: form.type as 'income' | 'expense',
        amount: parseFloat(form.amount),
        date: form.date,
      })
      if (res.error) setError(res.error)
      else if (res.data) {
        setRecords([res.data, ...records])
        await loadData() // refresh summary and monthly stats
        setForm({ type: 'expense', amount: '', date: new Date().toISOString().split('T')[0] })
      }
    } catch (e) {
      console.error(e)
      setError('Failed to add record')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this record?')) return
    try {
      const res = await deleteRecord(id)
      if (res.error) setError(res.error)
      else {
        setRecords(records.filter((r) => r.id !== id))
        await loadData()
      }
    } catch (e) {
      console.error(e)
      setError('Failed to delete record')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-slate-600"></div>
          <p className="mt-4 text-slate-600">Loading…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-slate-900">💰 Personal Expense Tracker</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-800">
            {error}
          </div>
        )}

        {/* summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-slate-600">Income</p>
            <p className="text-xl font-bold text-green-600">
              {formatCurrency(summary.income)}
            </p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-slate-600">Expense</p>
            <p className="text-xl font-bold text-red-600">
              {formatCurrency(summary.expense)}
            </p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-slate-600">Savings</p>
            <p className="text-xl font-bold text-slate-900">
              {formatCurrency(summary.savings)}
            </p>
          </div>
        </div>
        {/* monthly graph */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">This Year - Monthly Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="bg-white p-3 rounded shadow">
              <p className="text-xs text-slate-600">This Month Income</p>
              <p className="text-lg font-bold text-green-600">{formatCurrency((monthlyIncome[new Date().getMonth()]) || 0)}</p>
            </div>
            <div className="bg-white p-3 rounded shadow">
              <p className="text-xs text-slate-600">This Month Expense</p>
              <p className="text-lg font-bold text-red-600">{formatCurrency((monthlyExpenses[new Date().getMonth()]) || 0)}</p>
            </div>
            <div className="bg-white p-3 rounded shadow">
              <p className="text-xs text-slate-600">This Month Savings</p>
              <p className="text-lg font-bold text-slate-900">{formatCurrency((monthlySavings[new Date().getMonth()]) || 0)}</p>
            </div>
          </div>
          <MonthlyChart labels={monthLabels.length? monthLabels : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']} income={monthlyIncome} expense={monthlyExpenses} />
          <div className="flex justify-between text-xs text-slate-600 mt-2">
            {monthlyExpenseCounts.map((c, i) => (
              <span key={i} className="w-6 text-center">{c}</span>
            ))}
          </div>
        </div>

        {/* add form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              title="Type"
              aria-label="record-type"
              className="border rounded px-2 py-1"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <input
              title="Amount"
              aria-label="amount"
              type="number"
              step="0.01"
              placeholder="Amount"
              className="border rounded px-2 py-1"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
            />

            <input
              title="Date"
              aria-label="date"
              type="date"
              className="border rounded px-2 py-1"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />


          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-800"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : 'Add'}
          </button>
        </form>

        {/* record list */}
        <div>
          {records.length === 0 ? (
            <p className="text-center text-slate-600">No records yet.</p>
          ) : (
            <div className="space-y-2">
              {records.map((r) => (
                <div
                  key={r.id}
                  className="flex justify-between items-center bg-white p-3 rounded shadow"
                >
                  <div>
                    <p className="text-sm text-slate-800">
                      {r.type === 'income' ? '💵' : '💸'} {formatCurrency(r.amount)}
                    </p>
                    <p className="text-xs text-slate-500">{new Date(r.date).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard
