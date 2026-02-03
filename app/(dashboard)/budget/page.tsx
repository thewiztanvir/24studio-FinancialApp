import { prisma } from '@/lib/prisma'
import { BudgetForm } from './BudgetForm'

export default async function BudgetPage() {
    const currentYear = new Date().getFullYear()
    const budgets = await prisma.budget.findMany({
        where: { year: currentYear },
        orderBy: { category: 'asc' }
    })

    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Budget Management</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Manage yearly budgets by category ({currentYear})</p>

            <BudgetForm currentYear={currentYear} existingBudgets={budgets} />

            <div style={{ marginTop: '3rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Current Budgets</h2>

                {budgets.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                        No budgets set for {currentYear}. Add your first budget above.
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {budgets.map(budget => {
                            const percentage = (Number(budget.spentAmount) / Number(budget.allocatedAmount)) * 100
                            const isOverBudget = percentage > 100
                            const isWarning = percentage > 80

                            return (
                                <div key={budget.id} className="card">
                                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>{budget.category}</h3>

                                    <div style={{ marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                            <span>Allocated:</span>
                                            <strong>৳ {Number(budget.allocatedAmount).toLocaleString()}</strong>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                            <span>Spent:</span>
                                            <strong style={{ color: isOverBudget ? 'var(--danger-color)' : 'var(--text-primary)' }}>
                                                ৳ {Number(budget.spentAmount).toLocaleString()}
                                            </strong>
                                        </div>
                                    </div>

                                    <div style={{
                                        background: 'var(--bg-color)',
                                        borderRadius: 'var(--radius-sm)',
                                        height: '8px',
                                        overflow: 'hidden',
                                        marginBottom: '0.5rem'
                                    }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${Math.min(percentage, 100)}%`,
                                            background: isOverBudget ? 'var(--danger-color)' : isWarning ? 'var(--warning-color)' : 'var(--success-color)',
                                            transition: 'width 0.3s ease'
                                        }} />
                                    </div>

                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'right' }}>
                                        {percentage.toFixed(1)}% used
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
