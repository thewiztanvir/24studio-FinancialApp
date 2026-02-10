'use client'

import { useState, useEffect } from 'react'
import { Trash2, Plus, Database, AlertTriangle, Tag, Save } from 'lucide-react'
import {
    getSettings,
    updateCategories,
    resetAllTransactions,
    getDatabaseStats
} from '@/app/actions/settings'
import { Modal } from '@/components/ui/Modal'

export function SettingsManager() {
    const [settings, setSettings] = useState<any>(null)
    const [stats, setStats] = useState<any>(null)
    const [isResetModalOpen, setIsResetModalOpen] = useState(false)
    const [isResetting, setIsResetting] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const [revenueCategories, setRevenueCategories] = useState<string[]>([])
    const [expenseCategories, setExpenseCategories] = useState<string[]>([])
    const [newRevenueCat, setNewRevenueCat] = useState('')
    const [newExpenseCat, setNewExpenseCat] = useState('')

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        const settingsData = await getSettings()
        const dbStats = await getDatabaseStats()

        if (settingsData) {
            setSettings(settingsData)
            const revCats = settingsData.revenueCategories
                ? (typeof settingsData.revenueCategories === 'string' ? settingsData.revenueCategories.split(',') : settingsData.revenueCategories)
                : []
            const expCats = settingsData.expenseCategories
                ? (typeof settingsData.expenseCategories === 'string' ? settingsData.expenseCategories.split(',') : settingsData.expenseCategories)
                : []

            setRevenueCategories(revCats)
            setExpenseCategories(expCats)
        }

        setStats(dbStats)
    }

    const handleUpdateCategories = async () => {
        setIsSaving(true)
        const result = await updateCategories(revenueCategories, expenseCategories)
        if (result.success) {
            alert('Categories updated successfully!')
            await loadData()
        } else {
            alert(result.error || 'Failed to update categories')
        }
        setIsSaving(false)
    }

    const handleResetDatabase = async () => {
        if (!confirm('Type "CONFIRM DELETE" to proceed')) return

        const confirmation = prompt('Type "CONFIRM DELETE" to reset the database:')
        if (confirmation !== 'CONFIRM DELETE') {
            alert('Incorrect confirmation text')
            return
        }

        setIsResetting(true)
        const result = await resetAllTransactions()
        if (result.success) {
            alert('Database reset successfully!')
            await loadData()
            setIsResetModalOpen(false)
        } else {
            alert(result.error || 'Failed to reset database')
        }
        setIsResetting(false)
    }

    if (!settings) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading settings...</div>
    }

    return (
        <div style={{ maxWidth: '900px' }}>
            {/* Revenue Categories */}
            <div style={{
                background: 'var(--card-bg)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                boxShadow: 'var(--shadow-sm)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <Tag size={20} style={{ color: 'var(--success-color)' }} />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Revenue Categories</h2>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                    {revenueCategories.map((cat, idx) => (
                        <div key={idx} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: 'rgba(16, 185, 129, 0.1)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid rgba(16, 185, 129, 0.2)'
                        }}>
                            <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{cat}</span>
                            <button
                                onClick={() => setRevenueCategories(revenueCategories.filter((_, i) => i !== idx))}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--danger-color)',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="text"
                        value={newRevenueCat}
                        onChange={(e) => setNewRevenueCat(e.target.value)}
                        placeholder="Add new revenue category"
                        style={{
                            flex: 1,
                            padding: '0.625rem 1rem',
                            border: '2px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.875rem'
                        }}
                    />
                    <button
                        onClick={() => {
                            if (newRevenueCat.trim()) {
                                setRevenueCategories([...revenueCategories, newRevenueCat.trim()])
                                setNewRevenueCat('')
                            }
                        }}
                        className="btn btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Plus size={16} /> Add
                    </button>
                </div>
            </div>

            {/* Expense Categories */}
            <div style={{
                background: 'var(--card-bg)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                boxShadow: 'var(--shadow-sm)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <Tag size={20} style={{ color: 'var(--danger-color)' }} />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Expense Categories</h2>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                    {expenseCategories.map((cat, idx) => (
                        <div key={idx} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid rgba(239, 68, 68, 0.2)'
                        }}>
                            <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{cat}</span>
                            <button
                                onClick={() => setExpenseCategories(expenseCategories.filter((_, i) => i !== idx))}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--danger-color)',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="text"
                        value={newExpenseCat}
                        onChange={(e) => setNewExpenseCat(e.target.value)}
                        placeholder="Add new expense category"
                        style={{
                            flex: 1,
                            padding: '0.625rem 1rem',
                            border: '2px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.875rem'
                        }}
                    />
                    <button
                        onClick={() => {
                            if (newExpenseCat.trim()) {
                                setExpenseCategories([...expenseCategories, newExpenseCat.trim()])
                                setNewExpenseCat('')
                            }
                        }}
                        className="btn btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Plus size={16} /> Add
                    </button>
                </div>
            </div>

            {/* Save Button */}
            <button
                onClick={handleUpdateCategories}
                disabled={isSaving}
                className="btn btn-primary"
                style={{
                    width: '100%',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                }}
            >
                <Save size={18} />
                {isSaving ? 'Saving...' : 'Save All Categories'}
            </button>

            {/* Database Management - Collapsible */}
            <div style={{
                background: 'var(--card-bg)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <Database size={20} style={{ color: 'var(--primary-color)' }} />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Database Management</h2>
                </div>

                {stats && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '1rem',
                        marginBottom: '1.5rem'
                    }}>
                        {/* Stats Cards ... */}
                        <div style={{
                            padding: '1rem',
                            background: 'rgba(59, 130, 246, 0.05)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid rgba(59, 130, 246, 0.1)'
                        }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                Total Revenues
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--success-color)' }}>
                                {stats.revenues || 0}
                            </div>
                        </div>
                        <div style={{
                            padding: '1rem',
                            background: 'rgba(239, 68, 68, 0.05)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid rgba(239, 68, 68, 0.1)'
                        }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                Total Expenses
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--danger-color)' }}>
                                {stats.expenses || 0}
                            </div>
                        </div>
                        <div style={{
                            padding: '1rem',
                            background: 'rgba(139, 92, 246, 0.05)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid rgba(139, 92, 246, 0.1)'
                        }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                Total Donations
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'rgb(139, 92, 246)' }}>
                                {stats.donations || 0}
                            </div>
                        </div>
                        <div style={{
                            padding: '1rem',
                            background: 'rgba(107, 114, 128, 0.05)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid rgba(107, 114, 128, 0.1)'
                        }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                Total Donors
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                                {stats.donors || 0}
                            </div>
                        </div>
                    </div>
                )}

                <details style={{
                    background: 'rgba(239, 68, 68, 0.05)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden'
                }}>
                    <summary style={{
                        padding: '1rem',
                        cursor: 'pointer',
                        fontWeight: '600',
                        color: 'var(--danger-color)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        listStyle: 'none'
                    }}>
                        <AlertTriangle size={18} />
                        Danger Zone (Advanced)
                    </summary>
                    <div style={{ padding: '1rem', borderTop: '1px solid rgba(239, 68, 68, 0.1)' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--danger-color)', marginBottom: '0.5rem' }}>
                            Reset Database
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                            Reset all transactions in the database. This action cannot be undone.
                        </p>
                        <button
                            onClick={() => setIsResetModalOpen(true)}
                            className="btn"
                            style={{
                                background: 'var(--danger-color)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <Trash2 size={16} />
                            Reset Database
                        </button>
                    </div>
                </details>
            </div>

            {/* Reset Confirmation Modal */}
            <Modal isOpen={isResetModalOpen} onClose={() => setIsResetModalOpen(false)} title="⚠️ Reset Database">
                <div style={{ padding: '1rem' }}>
                    <p style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>
                        This will permanently delete all:
                    </p>
                    <ul style={{ marginLeft: '1.5rem', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                        <li>Revenue records</li>
                        <li>Expense records</li>
                        <li>Donation records</li>
                        <li>Budget allocations</li>
                    </ul>
                    <p style={{ marginBottom: '1.5rem', color: 'var(--danger-color)', fontWeight: '600' }}>
                        This action cannot be undone!
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={() => setIsResetModalOpen(false)}
                            className="btn btn-secondary"
                            style={{ flex: 1 }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleResetDatabase}
                            disabled={isResetting}
                            className="btn"
                            style={{
                                flex: 1,
                                background: 'var(--danger-color)',
                                color: 'white'
                            }}
                        >
                            {isResetting ? 'Resetting...' : 'Confirm Reset'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
