'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import styles from '../revenue/RevenueForm.module.css'

export function BudgetForm({ currentYear, existingBudgets }: { currentYear: number, existingBudgets: any[] }) {
    const [showForm, setShowForm] = useState(false)

    const categories = [
        'Salaries', 'Rent', 'Materials', 'Equipment', 'Marketing', 'Admin', 'Transport', 'Misc'
    ]

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        // Simple API call
        const res = await fetch('/api/budgets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                year: currentYear,
                category: formData.get('category'),
                allocatedAmount: parseFloat(formData.get('allocatedAmount') as string)
            })
        })

        if (res.ok) {
            setShowForm(false)
            window.location.reload()
        } else {
            alert('Failed to create budget')
        }
    }

    if (!showForm) {
        return (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                <Plus size={18} /> Add Budget Category
            </button>
        )
    }

    return (
        <div className="card" style={{ maxWidth: '500px' }}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                    <label>Category *</label>
                    <select name="category" required>
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat} disabled={existingBudgets.some(b => b.category === cat)}>
                                {cat} {existingBudgets.some(b => b.category === cat) ? '(Already set)' : ''}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.field}>
                    <label>Allocated Amount (৳) *</label>
                    <input type="number" name="allocatedAmount" step="0.01" required placeholder="0.00" />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                        Save Budget
                    </button>
                    <button type="button" className="btn" onClick={() => setShowForm(false)} style={{ flex: 1, background: 'var(--bg-color)' }}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}
