'use client'

import { useState } from 'react'
import { Table } from '@/components/ui/Table'
import { Modal } from '@/components/ui/Modal'
import { Plus } from 'lucide-react'
import { createDonor } from '@/app/actions/donors'
import styles from '../revenue/RevenueForm.module.css'

import Link from 'next/link'

export function DonorsList({ initialDonors }: { initialDonors: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [donors, setDonors] = useState(initialDonors)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const result = await createDonor(formData)
        if (result.success) {
            setIsModalOpen(false)
            window.location.reload()
        } else {
            alert(result.error)
        }
    }

    const columns = [
        {
            key: 'name',
            label: 'Name',
            render: (val: string, row: any) => (
                <Link href={`/donors/${row.id}`} style={{ fontWeight: '600', color: 'var(--primary-color)', textDecoration: 'none' }}>
                    {val}
                </Link>
            )
        },
        {
            key: 'status',
            label: 'Status',
            render: (val: string) => (
                <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    background: val === 'Internal' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                    color: val === 'Internal' ? 'rgb(59, 130, 246)' : 'rgb(107, 114, 128)'
                }}>
                    {val}
                </span>
            )
        },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        {
            key: 'totalDonated',
            label: 'Total Donated',
            render: (val: any) => <strong style={{ color: 'var(--success-color)' }}>৳ {val?.toLocaleString() || '0'}</strong>
        },
        {
            key: 'lastDonationDate',
            label: 'Last Donation',
            render: (val: any) => val ? new Date(val).toLocaleDateString('en-GB') : 'N/A'
        },
    ]

    return (
        <>
            <div style={{ marginBottom: '1.5rem' }}>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} /> Add Donor
                </button>
            </div>

            <Table columns={columns} data={donors} emptyMessage="No donors yet" />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Donor">
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label>Full Name *</label>
                        <input type="text" name="name" required placeholder="Enter full name" />
                    </div>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Email</label>
                            <input type="email" name="email" placeholder="email@example.com" />
                        </div>
                        <div className={styles.field}>
                            <label>Phone</label>
                            <input type="tel" name="phone" placeholder="+880..." />
                        </div>
                    </div>
                    <div className={styles.field}>
                        <label>Address</label>
                        <input type="text" name="address" placeholder="Optional" />
                    </div>
                    <div className={styles.field}>
                        <label>National ID</label>
                        <input type="text" name="nationalId" placeholder="Optional" />
                    </div>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Donor Status *</label>
                            <select name="status" required defaultValue="External" onChange={(e) => {
                                const form = e.target.closest('form');
                                const yearlyField = form?.querySelector('[name="yearlyContributionRequired"]') as HTMLInputElement;
                                if (yearlyField) {
                                    yearlyField.style.display = e.target.value === 'Internal' ? 'block' : 'none';
                                    const fieldWrapper = yearlyField.closest(`.${styles.field}`) as HTMLElement;
                                    if (fieldWrapper) fieldWrapper.style.display = e.target.value === 'Internal' ? 'block' : 'none';
                                }
                            }}>
                                <option value="External">External Donor</option>
                                <option value="Internal">Internal Donor</option>
                            </select>
                        </div>
                        <div className={styles.field} style={{ display: 'none' }}>
                            <label>Yearly Contribution Required (৳)</label>
                            <input type="number" name="yearlyContributionRequired" step="0.01" placeholder="e.g., 50000" />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Save Donor
                    </button>
                </form>
            </Modal>
        </>
    )
}
