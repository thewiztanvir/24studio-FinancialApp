'use client'

import { useState } from 'react'
import { Edit2, Check, X } from 'lucide-react'
import { updateAccountBalance } from '@/app/actions/accounts'

interface AccountsListProps {
    accounts: any[]
    totalBalance: number
    userRole?: string
}

export function AccountsList({ accounts, totalBalance, userRole }: AccountsListProps) {
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editValue, setEditValue] = useState('')

    const handleEdit = (account: any) => {
        setEditingId(account.id)
        setEditValue(account.currentBalance.toString())
    }

    const handleSave = async (accountId: number) => {
        const newBalance = parseFloat(editValue)
        if (isNaN(newBalance)) {
            alert('Please enter a valid number')
            return
        }

        const result = await updateAccountBalance(accountId, newBalance)
        if (result.success) {
            setEditingId(null)
            window.location.reload()
        } else {
            alert(result.error)
        }
    }

    const handleCancel = () => {
        setEditingId(null)
        setEditValue('')
    }

    const isPresident = userRole === 'PRESIDENT'
    const safeTotal = totalBalance || 0

    return (
        <>
            <div
                style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    padding: '2rem',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: '2rem',
                    color: 'white',
                    boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)',
                }}
            >
                <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', opacity: 0.9 }}>
                    Total Organization Balance
                </h2>
                <p style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0 }}>
                    ৳ {safeTotal.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                </p>
            </div>

            <div
                style={{
                    background: 'white',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--border-color)',
                }}
            >
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.06) 0%, rgba(118, 75, 162, 0.06) 100%)',
                        borderBottom: '2px solid var(--border-color)'
                    }}>
                        <tr>
                            <th
                                style={{
                                    padding: '1.125rem 1rem',
                                    textAlign: 'left',
                                    fontWeight: '700',
                                    fontSize: '0.875rem',
                                    color: 'var(--text-primary)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.025em',
                                }}
                            >
                                Account Name
                            </th>
                            <th
                                style={{
                                    padding: '1.125rem 1rem',
                                    textAlign: 'left',
                                    fontWeight: '700',
                                    fontSize: '0.875rem',
                                    color: 'var(--text-primary)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.025em',
                                }}
                            >
                                Type
                            </th>
                            <th
                                style={{
                                    padding: '1.125rem 1rem',
                                    textAlign: 'right',
                                    fontWeight: '700',
                                    fontSize: '0.875rem',
                                    color: 'var(--text-primary)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.025em',
                                }}
                            >
                                Current Balance
                            </th>
                            {isPresident && (
                                <th
                                    style={{
                                        padding: '1.125rem 1rem',
                                        textAlign: 'center',
                                        fontWeight: '700',
                                        fontSize: '0.875rem',
                                        color: 'var(--text-primary)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.025em',
                                    }}
                                >
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map((account: any) => (
                            <tr
                                key={account.id}
                                style={{
                                    borderBottom: '1px solid #f0f0f0',
                                    transition: 'var(--transition-fast)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.04) 0%, rgba(118, 75, 162, 0.04) 100%)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent'
                                }}
                            >
                                <td style={{ padding: '1.125rem 1rem', fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '600' }}>
                                    {account.name}
                                </td>
                                <td style={{ padding: '1.125rem 1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    <span style={{
                                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        color: 'var(--primary-color)',
                                    }}>
                                        {account.type}
                                    </span>
                                </td>
                                <td style={{ padding: '1.125rem 1rem', textAlign: 'right' }}>
                                    {editingId === account.id ? (
                                        <input
                                            type="number"
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            style={{
                                                width: '150px',
                                                padding: '0.5rem',
                                                border: '2px solid var(--primary-color)',
                                                borderRadius: 'var(--radius-sm)',
                                                fontSize: '1rem',
                                                fontWeight: '700',
                                                textAlign: 'right',
                                            }}
                                            autoFocus
                                        />
                                    ) : (
                                        <span
                                            style={{
                                                fontSize: '1.125rem',
                                                fontWeight: '700',
                                                background: 'var(--gradient-success)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                backgroundClip: 'text',
                                            }}
                                        >
                                            ৳ {account.currentBalance.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                                        </span>
                                    )}
                                </td>
                                {isPresident && (
                                    <td style={{ padding: '1.125rem 1rem', textAlign: 'center' }}>
                                        {editingId === account.id ? (
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                <button
                                                    onClick={() => handleSave(account.id)}
                                                    style={{
                                                        background: 'var(--gradient-success)',
                                                        border: 'none',
                                                        color: 'white',
                                                        width: '32px',
                                                        height: '32px',
                                                        borderRadius: 'var(--radius-sm)',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        transition: 'var(--transition-base)',
                                                    }}
                                                >
                                                    <Check size={16} />
                                                </button>
                                                <button
                                                    onClick={handleCancel}
                                                    style={{
                                                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                                                        border: 'none',
                                                        color: 'var(--danger-color)',
                                                        width: '32px',
                                                        height: '32px',
                                                        borderRadius: 'var(--radius-sm)',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        transition: 'var(--transition-base)',
                                                    }}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleEdit(account)}
                                                style={{
                                                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                                                    border: 'none',
                                                    color: 'var(--primary-color)',
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: 'var(--radius-sm)',
                                                    cursor: 'pointer',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '600',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    transition: 'var(--transition-base)',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = 'var(--gradient-primary)'
                                                    e.currentTarget.style.color = 'white'
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
                                                    e.currentTarget.style.color = 'var(--primary-color)'
                                                }}
                                            >
                                                <Edit2 size={14} /> Edit
                                            </button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}
