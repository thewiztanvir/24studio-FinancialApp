'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Download, Filter, Calendar } from 'lucide-react'

export function ReportsFilter({
    currentYear,
    currentMonth,
    currentType,
    baseUrl = '/reports',
    showTypeFilter = true
}: {
    currentYear: number,
    currentMonth: string,
    currentType?: string,
    baseUrl?: string,
    showTypeFilter?: boolean
}) {
    const router = useRouter()
    const [year, setYear] = useState(currentYear)
    const [month, setMonth] = useState(currentMonth)
    const [type, setType] = useState(currentType || 'All')

    const handleApply = () => {
        const params = new URLSearchParams()
        params.set('year', year.toString())
        if (month !== 'all') params.set('month', month)
        if (showTypeFilter && type !== 'All' && type) params.set('type', type)
        router.push(`${baseUrl}?${params.toString()}`)
    }

    const years = [2024, 2025, 2026, 2027]
    const months = [
        { value: 'all', label: 'All Year' },
        { value: '0', label: 'January' },
        { value: '1', label: 'February' },
        { value: '2', label: 'March' },
        { value: '3', label: 'April' },
        { value: '4', label: 'May' },
        { value: '5', label: 'June' },
        { value: '6', label: 'July' },
        { value: '7', label: 'August' },
        { value: '8', label: 'September' },
        { value: '9', label: 'October' },
        { value: '10', label: 'November' },
        { value: '11', label: 'December' }
    ]

    return (
        <div style={{
            background: 'var(--card-bg)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '2rem',
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            alignItems: 'end'
        }}>
            <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Year</label>
                <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    style={{
                        padding: '0.625rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        minWidth: '120px'
                    }}
                >
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
            </div>

            <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Month</label>
                <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    style={{
                        padding: '0.625rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        minWidth: '150px'
                    }}
                >
                    {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
            </div>

            {showTypeFilter && (
                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Type</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        style={{
                            padding: '0.625rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-color)',
                            minWidth: '150px'
                        }}
                    >
                        <option value="All">All Transactions</option>
                        <option value="Revenue">Revenue Only</option>
                        <option value="Expense">Expense Only</option>
                        <option value="Donation">Donation Only</option>
                    </select>
                </div>
            )}

            <button
                onClick={handleApply}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', height: '42px' }}
            >
                <Filter size={18} /> Apply Filters
            </button>
        </div>
    )
}

export function ExportButton({ data }: { data: any[] }) {
    const handleDownload = () => {
        if (!data || data.length === 0) return

        const headers = ['ID', 'Date', 'Type', 'Category', 'Source/Vendor', 'Amount', 'Recorded By']
        const csvContent = [
            headers.join(','),
            ...data.map(row => [
                row.id,
                new Date(row.date).toLocaleDateString(),
                row.type,
                `"${row.category}"`, // Quote to handle commas
                `"${row.source}"`,
                row.amount,
                row.recordedBy
            ].join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `financial_report_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <button
            onClick={handleDownload}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
            <Download size={18} /> Export CSV
        </button>
    )
}
