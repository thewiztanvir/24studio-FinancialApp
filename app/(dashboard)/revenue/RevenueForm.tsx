'use client'

import { useState, useEffect } from 'react'
import { createRevenue } from '@/app/actions/revenue'
import { prisma } from '@/lib/prisma'
import styles from './RevenueForm.module.css'

export function RevenueForm({ onSuccess }: { onSuccess: () => void }) {
    const [uploading, setUploading] = useState(false)
    const [receiptPath, setReceiptPath] = useState('')

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })
            const data = await res.json()
            if (data.success) {
                setReceiptPath(data.path)
            } else {
                alert(data.error)
            }
        } catch (error) {
            alert('Upload failed')
        }
        setUploading(false)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        if (receiptPath) formData.set('receiptPath', receiptPath)

        const result = await createRevenue(formData)
        if (result.success) {
            onSuccess()
        } else {
            alert(result.error)
        }
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
                <div className={styles.field}>
                    <label>Date *</label>
                    <input type="date" name="date" required />
                </div>
                <div className={styles.field}>
                    <label>Amount (৳) *</label>
                    <input type="number" name="amount" step="0.01" required placeholder="0.00" />
                </div>
            </div>

            <div className={styles.row}>
                <div className={styles.field}>
                    <label>Category *</label>
                    <select name="category" required>
                        <option value="">Select Category</option>
                        <option value="Course Fees">Course Fees</option>
                        <option value="Training">Training Programs</option>
                        <option value="Grants">Grants</option>
                        <option value="Corporate">Corporate Training</option>
                        <option value="Other">Other Income</option>
                    </select>
                </div>
                <div className={styles.field}>
                    <label>Status *</label>
                    <select name="status" required defaultValue="Received">
                        <option value="Pending">Pending</option>
                        <option value="Received">Received</option>
                        <option value="Partially Paid">Partially Paid</option>
                    </select>
                </div>
            </div>

            <div className={styles.field}>
                <label>Source (Who Paid) *</label>
                <input type="text" name="source" required placeholder="Individual or Organization" />
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
                        <option value="Card">Credit/Debit Card</option>
                    </select>
                </div>
                <div className={styles.field}>
                    <label>Transaction ID (Optional)</label>
                    <input type="text" name="transactionId" placeholder="e.g., TXN123456" />
                </div>
            </div>

            <div className={styles.field}>
                <label>Program Name</label>
                <input type="text" name="programName" placeholder="Optional" />
            </div>

            <div className={styles.field}>
                <label>Description</label>
                <textarea name="description" rows={3} placeholder="Optional notes..."></textarea>
            </div>

            <div className={styles.field}>
                <label>Receipt (JPG, PNG, PDF - Max 5MB)</label>
                <input type="file" onChange={handleFileUpload} accept=".jpg,.jpeg,.png,.pdf" disabled={uploading} />
                {uploading && <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Uploading...</p>}
                {receiptPath && <p style={{ fontSize: '0.875rem', color: 'var(--success-color)' }}>✓ Uploaded</p>}
            </div>

            <div className={styles.field}>
                <label>Receipt Link (Optional)</label>
                <input type="url" name="receiptLink" placeholder="https://..." />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Save Revenue
            </button>
        </form>
    )
}
