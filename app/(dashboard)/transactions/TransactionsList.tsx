'use client'

import { useState, useMemo } from 'react'
import { Table } from '@/components/ui/Table'
import { format } from 'date-fns'
import { Filter, FileText, Link as LinkIcon } from 'lucide-react'

type Transaction = {
    id: string
    date: Date
    type: 'Revenue' | 'Expense' | 'Donation'
    amount: number
    category: string
    source: string
    paymentMethod: string
    transactionId: string | null
    recordedBy: string
    description: string | null
    receiptPath?: string | null
    receiptLink?: string | null
}

export function TransactionsList({ initialTransactions }: { initialTransactions: Transaction[] }) {
    const [typeFilter, setTypeFilter] = useState<string>('All')
    const [paymentFilter, setPaymentFilter] = useState<string>('All')
    const [searchTerm, setSearchTerm] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    // Filter transactions
    const filteredTransactions = useMemo(() => {
        return initialTransactions.filter(t => {
            const matchesType = typeFilter === 'All' || t.type === typeFilter
            const matchesPayment = paymentFilter === 'All' || t.paymentMethod === paymentFilter
            const matchesSearch = searchTerm === '' ||
                t.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (t.transactionId && t.transactionId.toLowerCase().includes(searchTerm.toLowerCase()))

            let matchesDate = true
            if (startDate) {
                matchesDate = matchesDate && new Date(t.date) >= new Date(startDate)
            }
            if (endDate) {
                // Set end date to end of day
                const end = new Date(endDate)
                end.setHours(23, 59, 59, 999)
                matchesDate = matchesDate && new Date(t.date) <= end
            }

            return matchesType && matchesPayment && matchesSearch && matchesDate
        })
    }, [initialTransactions, typeFilter, paymentFilter, searchTerm, startDate, endDate])

    // Get unique payment methods
    const paymentMethods = useMemo(() => {
        const methods = new Set(initialTransactions.map(t => t.paymentMethod))
        return Array.from(methods).sort()
    }, [initialTransactions])

    const columns = [
        {
            key: 'date',
            label: 'Date',
            render: (val: any) => format(new Date(val), 'dd/MM/yyyy')
        },
        {
            key: 'type',
            label: 'Type',
            render: (val: string) => (
                <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    background: val === 'Revenue' ? 'rgba(16, 185, 129, 0.1)' :
                        val === 'Expense' ? 'rgba(239, 68, 68, 0.1)' :
                            'rgba(139, 92, 246, 0.1)',
                    color: val === 'Revenue' ? 'var(--success-color)' :
                        val === 'Expense' ? 'var(--danger-color)' :
                            'rgb(139, 92, 246)'
                }}>
                    {val}
                </span>
            )
        },
        {
            key: 'source',
            label: 'Source/Vendor'
        },
        {
            key: 'category',
            label: 'Category'
        },
        {
            key: 'amount',
            label: 'Amount',
            render: (val: any, row: Transaction) => (
                <strong style={{
                    color: row.type === 'Expense' ? 'var(--danger-color)' : 'var(--success-color)'
                }}>
                    {row.type === 'Expense' ? '-' : '+'}৳ {Number(val).toLocaleString()}
                </strong>
            )
        },
        {
            key: 'paymentMethod',
            label: 'Payment Method'
        },
        {
            key: 'transactionId',
            label: 'Transaction ID',
            render: (val: string | null) => val || '—'
        },
        {
            key: 'receipt',
            label: 'Receipt',
            render: (_: any, row: Transaction) => (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {row.receiptPath && (
                        <a href={row.receiptPath} target="_blank" rel="noopener noreferrer" title="View Uploaded Receipt" style={{ color: 'var(--primary-color)' }}>
                            <FileText size={16} />
                        </a>
                    )}
                    {row.receiptLink && (
                        <a href={row.receiptLink} target="_blank" rel="noopener noreferrer" title="External Receipt Link" style={{ color: 'var(--primary-color)' }}>
                            <LinkIcon size={16} />
                        </a>
                    )}
                    {!row.receiptPath && !row.receiptLink && <span style={{ color: 'var(--text-secondary)' }}>—</span>}
                </div>
            )
        }
    ]

    return (
        <>
            {/* Filters */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Filter size={18} style={{ color: 'var(--text-secondary)' }} />
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                        Filters:
                    </span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        style={{
                            padding: '0.5rem 1rem',
                            border: '2px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.875rem',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="All">All Types</option>
                        <option value="Revenue">Revenue</option>
                        <option value="Expense">Expense</option>
                        <option value="Donation">Donation</option>
                    </select>

                    <select
                        value={paymentFilter}
                        onChange={(e) => setPaymentFilter(e.target.value)}
                        style={{
                            padding: '0.5rem 1rem',
                            border: '2px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.875rem',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="All">All Payment Methods</option>
                        {paymentMethods.map(method => (
                            <option key={method} value={method}>{method}</option>
                        ))}
                    </select>

                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        style={{
                            padding: '0.5rem 1rem',
                            border: '2px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.875rem'
                        }}
                        title="Start Date"
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        style={{
                            padding: '0.5rem 1rem',
                            border: '2px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.875rem'
                        }}
                        title="End Date"
                    />
                </div>

                <input
                    type="text"
                    placeholder="Search source, category, or transaction ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        flex: 1,
                        minWidth: '250px',
                        padding: '0.5rem 1rem',
                        border: '2px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.875rem'
                    }}
                />

                <div style={{
                    marginLeft: 'auto',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    fontWeight: '600'
                }}>
                    Showing {filteredTransactions.length} of {initialTransactions.length} transactions
                </div>
            </div>

            <Table columns={columns} data={filteredTransactions} emptyMessage="No transactions found" />
        </>
    )
}
