// Simple record type for personal expense tracker
export interface Record {
  id: string
  type: 'income' | 'expense'
  amount: number
  date: string
}
