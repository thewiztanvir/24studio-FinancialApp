'use client'

import { useState } from 'react'
import { Table } from '@/components/ui/Table'
import { Modal } from '@/components/ui/Modal'
import { Plus } from 'lucide-react'
import { createDonor } from '@/app/actions/donors'
import styles from '../revenue/RevenueForm.module.css'

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
        { key: 'name', label: 'Name' },
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
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Save Donor
                    </button>
                </form>
            </Modal>
        </>
    )
}
