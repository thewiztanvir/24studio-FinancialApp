'use client'

import { useState, useEffect } from 'react'
import { Table } from '@/components/ui/Table'
import { Modal } from '@/components/ui/Modal'
import { Plus, Check, X } from 'lucide-react'
import { createExpense, approveExpense, rejectExpense } from '@/app/actions/expenses'
import { format } from 'date-fns'
import styles from '../revenue/RevenueForm.module.css'

export function ExpensesList({ initialExpenses }: { initialExpenses: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [expenses, setExpenses] = useState(initialExpenses)
    const [accounts, setAccounts] = useState<any[]>([])
    const [receiptPath, setReceiptPath] = useState('')

    useEffect(() => {
        fetch('/api/accounts').then(r => r.json()).then(setAccounts)
    }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        if (receiptPath) formData.set('receiptPath', receiptPath)
        const result = await createExpense(formData)
        if (result.success) {
            setIsModalOpen(false)
            window.location.reload()
        } else {
            alert(result.error)
        }
    }

    const handleApprove = async (id: number) => {
        if (!confirm('Approve this expense?')) return
        const result = await approveExpense(id)
        if (result.success) {
            window.location.reload()
        } else {
            alert(result.error)
        }
    }

    const handleReject = async (id: number) => {
        if (!confirm('Reject and delete this expense?')) return
        const result = await rejectExpense(id)
        if (result.success) {
            window.location.reload()
        } else {
            alert(result.error)
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const fd = new FormData()
        fd.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const data = await res.json()
        if (data.success) setReceiptPath(data.path)
    }

    const columns = [
        { key: 'date', label: 'Date', render: (val: any) => format(new Date(val), 'dd/MM/yyyy') },
        { key: 'vendor', label: 'Vendor' },
        { key: 'category', label: 'Category' },
        {
            key: 'amount',
            label: 'Amount',
            render: (val: any) => <strong style={{ color: 'var(--danger-color)' }}>৳ {val.toLocaleString()}</strong>
        },
        { key: 'paymentMethod', label: 'Payment Method' },
        {
            key: 'status',
            label: 'Status',
            render: (val: string) => (
                <span style={{
                    color: val === 'Approved' ? 'var(--success-color)' : val === 'Pending' ? 'var(--warning-color)' : 'inherit'
                }}>
                    {val}
                </span>
            )
        },
        {
            key: 'id',
            label: 'Actions',
            render: (id: number, row: any) => {
                if (row.status !== 'Pending') return <span style={{ color: 'var(--text-secondary)' }}>—</span>
                return (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={() => handleApprove(id)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--success-color)',
                                cursor: 'pointer',
                                padding: '0.25rem'
                            }}
                            title="Approve"
                        >
                            <Check size={18} />
                        </button>
                        <button
                            onClick={() => handleReject(id)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--danger-color)',
                                cursor: 'pointer',
                                padding: '0.25rem'
                            }}
                            title="Reject"
                        >
                            <X size={18} />
                        </button>
                    </div>
                )
            }
        },
    ]

    return (
        <>
            <div style={{ marginBottom: '1.5rem' }}>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} /> Add Expense
                </button>
            </div>

            <Table columns={columns} data={expenses} emptyMessage="No expenses yet" />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Expense" size="lg">
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Date *</label>
                            <input type="date" name="date" required />
                        </div>
                        <div className={styles.field}>
                            <label>Amount (৳) *</label>
                            <input type="number" name="amount" step="0.01" required />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Category *</label>
                            <select name="category" required>
                                <option value="">Select Category</option>
                                <option value="Salaries">Staff Salaries</option>
                                <option value="Rent">Rent & Utilities</option>
                                <option value="Materials">Educational Materials</option>
                                <option value="Equipment">Equipment & Technology</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Admin">Administrative</option>
                                <option value="Transport">Transportation</option>
                                <option value="Misc">Miscellaneous</option>
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label>Vendor</label>
                            <input type="text" name="vendor" placeholder="Who was paid" />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Payment Method *</label>
                            <select name="paymentMethod" required>
                                <option value="">Select Method</option>
                                <option value="Cash">Cash</option>
                                <option value="bKash">bKash</option>
                                <option value="Nagad">Nagad</option>
                                <option value="Rocket">Rocket</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                                <option value="Cheque">Cheque</option>
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label>Account *</label>
                            <select name="accountId" required>
                                <option value="">Select Account</option>
                                {accounts.map(acc => (
                                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label>Description</label>
                        <textarea name="description" rows={3} placeholder="Optional notes..."></textarea>
                    </div>

                    <div className={styles.field}>
                        <label>Receipt (Optional)</label>
                        <input type="file" onChange={handleFileUpload} accept=".jpg,.jpeg,.png,.pdf" />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Save Expense (Pending Approval)
                    </button>
                </form>
            </Modal>
        </>
    )
}
