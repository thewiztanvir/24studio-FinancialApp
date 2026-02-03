'use client'

import { useState } from 'react'
import { Table } from '@/components/ui/Table'
import { Modal } from '@/components/ui/Modal'
import { Plus, Trash2 } from 'lucide-react'
import { RevenueForm } from './RevenueForm'
import { deleteRevenue } from '@/app/actions/revenue'
import { format } from 'date-fns'

export function RevenueList({ initialRevenues }: { initialRevenues: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [revenues, setRevenues] = useState(initialRevenues)

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this revenue entry?')) return

        const result = await deleteRevenue(id)
        if (result.success) {
            setRevenues(revenues.filter(r => r.id !== id))
        } else {
            alert(result.error)
        }
    }

    const columns = [
        { key: 'date', label: 'Date', render: (val: any) => format(new Date(val), 'dd/MM/yyyy') },
        { key: 'source', label: 'Source' },
        { key: 'category', label: 'Category' },
        {
            key: 'amount',
            label: 'Amount',
            render: (val: any) => <strong style={{ color: 'var(--success-color)' }}>৳ {val.toLocaleString()}</strong>
        },
        { key: 'paymentMethod', label: 'Payment Method' },
        { key: 'account', label: 'Account', render: (val: any) => val?.name },
        { key: 'status', label: 'Status' },
        {
            key: 'id',
            label: 'Actions',
            render: (id: number) => (
                <button
                    onClick={() => handleDelete(id)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--danger-color)',
                        cursor: 'pointer',
                        padding: '0.5rem'
                    }}
                >
                    <Trash2 size={16} />
                </button>
            )
        },
    ]

    return (
        <>
            <div style={{ marginBottom: '1.5rem' }}>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} /> Add Revenue
                </button>
            </div>

            <Table columns={columns} data={revenues} emptyMessage="No revenue entries yet" />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Revenue Entry">
                <RevenueForm onSuccess={() => {
                    setIsModalOpen(false)
                    window.location.reload() // Simple refresh for now
                }} />
            </Modal>
        </>
    )
}
