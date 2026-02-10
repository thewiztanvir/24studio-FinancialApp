'use client'

import { useState, useEffect } from 'react'
import { Table } from '@/components/ui/Table'
import { Modal } from '@/components/ui/Modal'
import { Plus } from 'lucide-react'
import { createDonation, getDonors } from '@/app/actions/donors'
import { format } from 'date-fns'
import styles from '../revenue/RevenueForm.module.css'

export function DonationsList({ initialDonations }: { initialDonations: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [donations, setDonations] = useState(initialDonations)
    const [donors, setDonors] = useState<any[]>([])
    const [receiptPath, setReceiptPath] = useState('')

    useEffect(() => {
        getDonors().then(setDonors)
    }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        if (receiptPath) formData.set('receiptPath', receiptPath)
        const result = await createDonation(formData)
        if (result.success) {
            setIsModalOpen(false)
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
        { key: 'donor', label: 'Donor', render: (val: any) => val?.name },
        {
            key: 'amount',
            label: 'Amount',
            render: (val: any) => <strong style={{ color: 'var(--success-color)' }}>৳ {val.toLocaleString()}</strong>
        },
        { key: 'type', label: 'Type' },
        { key: 'purpose', label: 'Purpose' },
        {
            key: 'taxReceiptRequired',
            label: 'Tax Receipt',
            render: (val: boolean) => val ? '✓ Yes' : '✗ No'
        },
    ]

    return (
        <>
            <div style={{ marginBottom: '1.5rem' }}>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} /> Add Donation
                </button>
            </div>

            <Table columns={columns} data={donations} emptyMessage="No donations yet" />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Donation" size="lg">
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Donor *</label>
                            <select name="donorId" required>
                                <option value="">Select Donor</option>
                                {donors.map(d => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label>Date *</label>
                            <input type="date" name="date" required />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Amount (৳) *</label>
                            <input type="number" name="amount" step="0.01" required />
                        </div>
                        <div className={styles.field}>
                            <label>Type *</label>
                            <select name="type" required>
                                <option value="">Select Type</option>
                                <option value="One-time">One-time</option>
                                <option value="Recurring">Recurring</option>
                                <option value="In-kind">In-kind</option>
                            </select>
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
                            <label>Transaction ID (Optional)</label>
                            <input type="text" name="transactionId" placeholder="e.g., TXN123456" />
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label>Purpose</label>
                        <input type="text" name="purpose" placeholder="Optional" />
                    </div>

                    <div className={styles.field}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input type="checkbox" name="taxReceiptRequired" value="true" />
                            Tax Receipt Required
                        </label>
                    </div>

                    <div className={styles.field}>
                        <label>Receipt (Optional)</label>
                        <input type="file" onChange={handleFileUpload} accept=".jpg,.jpeg,.png,.pdf" />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Save Donation
                    </button>
                </form>
            </Modal>
        </>
    )
}
