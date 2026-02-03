import { getExpenses } from '@/app/actions/expenses'
import { ExpensesList } from './ExpensesList'

export default async function ExpensesPage() {
    const expenses = await getExpenses()

    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Expense Management</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Track and approve all expenses</p>

            <ExpensesList initialExpenses={expenses} />
        </div>
    )
}
