'use client'

import { useState, useEffect } from 'react'
import { Trash2, Plus, Database, AlertTriangle, Building2, Settings as SettingsIcon, Tag, Save } from 'lucide-react'
import {
    getSettings,
    updateSettings,
    updateCategories,
    resetAllTransactions,
    getDatabaseStats,
    createAccount,
    deleteAccount,
    getAllAccounts
} from '@/app/actions/settings'
import { Modal } from '@/components/ui/Modal'

export function SettingsManager() {
    const [settings, setSettings] = useState<any>(null)
    const [stats, setStats] = useState<any>(null)
    const [accounts, setAccounts] = useState<any[]>([])
    const [isResetModalOpen, setIsResetModalOpen] = useState(false)
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)
    const [isResetting, setIsResetting] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    // Editable fields
    const [orgName, setOrgName] = useState('')
    const [orgAddress, setOrgAddress] = useState('')
    const [orgEmail, setOrgEmail] = useState('')
    const [orgPhone, setOrgPhone] = useState('')
    const [orgWebsite, setOrgWebsite] = useState('')
    const [fiscalStart, setFiscalStart] = useState(1)
    const [fiscalEnd, setFiscalEnd] = useState(12)

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
        const accountsList = await getAllAccounts()

        if (settingsData) {
            setSettings(settingsData)
            setOrgName(settingsData.organizationName)
            setOrgAddress(settingsData.organizationAddress)
            setOrgEmail(settingsData.organizationEmail)
            setOrgPhone(settingsData.organizationPhone)
            setOrgWebsite(settingsData.organizationWebsite)
            setFiscalStart(settingsData.fiscalYearStart)
            setFiscalEnd(settingsData.fiscalYearEnd)
            setRevenueCategories(settingsData.revenueCategories.split(','))
            setExpenseCategories(settingsData.expenseCategories.split(','))
        }

        setStats(dbStats)
        setAccounts(accountsList)
    }

    const handleSaveSettings = async () => {
        setIsSaving(true)
        const formData = new FormData()
        formData.append('organizationName', orgName)
        formData.append('organizationAddress', orgAddress)
        formData.append('organizationEmail', orgEmail)
        formData.append('organizationPhone', orgPhone)
        formData.append('organizationWebsite', orgWebsite)
        formData.append('fiscalYearStart', fiscalStart.toString())
        formData.append('fiscalYearEnd', fiscalEnd.toString())

        const result = await updateSettings(formData)
        if (result.success) {
            alert('✅ ' + result.message)
            loadData()
        } else {
            alert('❌ ' + result.error)
        }
        setIsSaving(false)
    }

    const handleReset = async () => {
        setIsResetting(true)
        const result = await resetAllTransactions()
        if (result.success) {
            alert('✅ ' + result.message)
            setIsResetModalOpen(false)
            loadData()
            window.location.reload()
        } else {
            alert('❌ ' + result.error)
        }
        setIsResetting(false)
    }

    const handleCreateAccount = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const result = await createAccount(formData)
        if (result.success) {
            alert('✅ Account created successfully!')
            setIsAccountModalOpen(false)
            loadData()
        } else {
            alert('❌ ' + result.error)
        }
    }

    const handleDeleteAccount = async (id: number, name: string) => {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) return

        const result = await deleteAccount(id)
        if (result.success) {
            alert('✅ Account deleted!')
            loadData()
        } else {
            alert('❌ ' + result.error)
        }
    }

    const handleAddRevenueCategory = async () => {
        if (!newRevenueCat.trim()) return
        const updated = [...revenueCategories, newRevenueCat.trim()]
        const result = await updateCategories('revenue', updated)
        if (result.success) {
            setRevenueCategories(updated)
            setNewRevenueCat('')
            alert('✅ Category added!')
        } else {
            alert('❌ ' + result.error)
        }
    }

    const handleRemoveRevenueCategory = async (cat: string) => {
        const updated = revenueCategories.filter(c => c !== cat)
        const result = await updateCategories('revenue', updated)
        if (result.success) {
            setRevenueCategories(updated)
            alert('✅ Category removed!')
        } else {
            alert('❌ ' + result.error)
        }
    }

    const handleAddExpenseCategory = async () => {
        if (!newExpenseCat.trim()) return
        const updated = [...expenseCategories, newExpenseCat.trim()]
        const result = await updateCategories('expense', updated)
        if (result.success) {
            setExpenseCategories(updated)
            setNewExpenseCat('')
            alert('✅ Category added!')
        } else {
            alert('❌ ' + result.error)
        }
    }

    const handleRemoveExpenseCategory = async (cat: string) => {
        const updated = expenseCategories.filter(c => c !== cat)
        const result = await updateCategories('expense', updated)
        if (result.success) {
            setExpenseCategories(updated)
            alert('✅ Category removed!')
        } else {
            alert('❌ ' + result.error)
        }
    }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    return (
        <div style={{ display: 'grid', gap: '2rem' }}>
            {/* Organization Information - EDITABLE */}
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Building2 size={24} style={{ color: 'var(--primary-color)' }} />
                        Organization Information
                    </h2>
                    <button
                        onClick={handleSaveSettings}
                        disabled={isSaving}
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Save size={18} />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

                <div style={{ display: 'grid', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem' }}>
                            Organization Name
                        </label>
                        <input
                            type="text"
                            value={orgName}
                            onChange={(e) => setOrgName(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '2px solid var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.9375rem',
                                transition: 'border-color 0.2s',
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem' }}>
                            Address
                        </label>
                        <input
                            type="text"
                            value={orgAddress}
                            onChange={(e) => setOrgAddress(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '2px solid var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.9375rem',
                            }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem' }}>
                                Email
                            </label>
                            <input
                                type="email"
                                value={orgEmail}
                                onChange={(e) => setOrgEmail(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '2px solid var(--border-color)',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '0.9375rem',
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem' }}>
                                Phone
                            </label>
                            <input
                                type="tel"
                                value={orgPhone}
                                onChange={(e) => setOrgPhone(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '2px solid var(--border-color)',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '0.9375rem',
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem' }}>
                            Website
                        </label>
                        <input
                            type="url"
                            value={orgWebsite}
                            onChange={(e) => setOrgWebsite(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '2px solid var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.9375rem',
                            }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem' }}>
                                Fiscal Year Start
                            </label>
                            <select
                                value={fiscalStart}
                                onChange={(e) => setFiscalStart(parseInt(e.target.value))}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '2px solid var(--border-color)',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '0.9375rem',
                                }}
                            >
                                {months.map((month, idx) => (
                                    <option key={idx} value={idx + 1}>{month}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem' }}>
                                Fiscal Year End
                            </label>
                            <select
                                value={fiscalEnd}
                                onChange={(e) => setFiscalEnd(parseInt(e.target.value))}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '2px solid var(--border-color)',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '0.9375rem',
                                }}
                            >
                                {months.map((month, idx) => (
                                    <option key={idx} value={idx + 1}>{month}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories - EDITABLE */}
            <div className="card">
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Tag size={24} style={{ color: 'var(--primary-color)' }} />
                    Manage Categories
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                    {/* Revenue Categories */}
                    <div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--success-color)' }}>
                            💰 Revenue Categories
                        </h3>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            <input
                                type="text"
                                value={newRevenueCat}
                                onChange={(e) => setNewRevenueCat(e.target.value)}
                                placeholder="Add new category..."
                                style={{
                                    flex: 1,
                                    padding: '0.5rem',
                                    border: '2px solid var(--border-color)',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.875rem',
                                }}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddRevenueCategory()}
                            />
                            <button onClick={handleAddRevenueCategory} className="btn btn-primary">
                                <Plus size={16} />
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {revenueCategories.map((cat, idx) => (
                                <span
                                    key={idx}
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%)',
                                        color: 'var(--success-color)',
                                        padding: '0.5rem 0.75rem',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                    }}
                                >
                                    {cat}
                                    <button
                                        onClick={() => handleRemoveRevenueCategory(cat)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--danger-color)',
                                            cursor: 'pointer',
                                            padding: 0,
                                            fontSize: '1rem',
                                            lineHeight: 1,
                                        }}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Expense Categories */}
                    <div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--danger-color)' }}>
                            💳 Expense Categories
                        </h3>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            <input
                                type="text"
                                value={newExpenseCat}
                                onChange={(e) => setNewExpenseCat(e.target.value)}
                                placeholder="Add new category..."
                                style={{
                                    flex: 1,
                                    padding: '0.5rem',
                                    border: '2px solid var(--border-color)',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.875rem',
                                }}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddExpenseCategory()}
                            />
                            <button onClick={handleAddExpenseCategory} className="btn btn-primary">
                                <Plus size={16} />
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {expenseCategories.map((cat, idx) => (
                                <span
                                    key={idx}
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.15) 100%)',
                                        color: 'var(--danger-color)',
                                        padding: '0.5rem 0.75rem',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                    }}
                                >
                                    {cat}
                                    <button
                                        onClick={() => handleRemoveExpenseCategory(cat)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--danger-color)',
                                            cursor: 'pointer',
                                            padding: 0,
                                            fontSize: '1rem',
                                            lineHeight: 1,
                                        }}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Management */}
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <SettingsIcon size={24} style={{ color: 'var(--primary-color)' }} />
                        Account Management
                    </h2>
                    <button
                        onClick={() => setIsAccountModalOpen(true)}
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Plus size={18} />
                        Add Account
                    </button>
                </div>

                <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {accounts.map((account) => (
                        <div
                            key={account.id}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1rem 1.25rem',
                                background: 'var(--bg-color)',
                                borderRadius: 'var(--radius-md)',
                                border: '2px solid var(--border-color)',
                            }}
                        >
                            <div>
                                <div style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '0.25rem' }}>{account.name}</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    {account.type} • ৳ {Number(account.currentBalance).toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                                </div>
                            </div>
                            <button
                                onClick={() => handleDeleteAccount(account.id, account.name)}
                                style={{
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: 'none',
                                    color: 'var(--danger-color)',
                                    cursor: 'pointer',
                                    padding: '0.5rem',
                                    borderRadius: 'var(--radius-sm)',
                                    transition: 'var(--transition-base)',
                                }}
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Database Management */}
            <div className="card">
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Database size={24} style={{ color: 'var(--primary-color)' }} />
                    Database Management
                </h2>

                {stats && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                        gap: '1rem',
                        marginBottom: '1.5rem',
                        padding: '1.5rem',
                        background: 'var(--bg-color)',
                        borderRadius: 'var(--radius-md)'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Users</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--primary-color)' }}>{stats.users}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Accounts</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--primary-color)' }}>{stats.accounts}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Revenue</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--success-color)' }}>{stats.revenue}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Donations</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--success-color)' }}>{stats.donations}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Donors</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--primary-color)' }}>{stats.donors}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Expenses</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--danger-color)' }}>{stats.expenses}</div>
                        </div>
                    </div>
                )}

                <button
                    onClick={() => setIsResetModalOpen(true)}
                    style={{
                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                        border: '2px solid var(--danger-color)',
                        color: 'var(--danger-color)',
                        padding: '1rem 1.5rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.9375rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        width: '100%',
                        justifyContent: 'center',
                        transition: 'var(--transition-base)',
                    }}
                >
                    <Trash2 size={20} />
                    Reset All Transactions & Balances
                </button>
            </div>

            {/* Reset Modal */}
            <Modal isOpen={isResetModalOpen} onClose={() => setIsResetModalOpen(false)} title="⚠️ Reset Database" size="md">
                <div style={{ padding: '1rem 0' }}>
                    <div style={{
                        padding: '1.25rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1.5rem',
                        border: '2px solid var(--danger-color)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                            <AlertTriangle size={24} style={{ color: 'var(--danger-color)' }} />
                            <strong style={{ color: 'var(--danger-color)', fontSize: '1.125rem' }}>This action cannot be undone!</strong>
                        </div>
                        <p style={{ margin: '0 0 0.5rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                            This will permanently delete:
                        </p>
                        <ul style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
                            <li>All revenue entries ({stats?.revenue || 0} records)</li>
                            <li>All donations and donors ({stats?.donations || 0} donations, {stats?.donors || 0} donors)</li>
                            <li>All expenses ({stats?.expenses || 0} records)</li>
                            <li>All budgets ({stats?.budgets || 0} records)</li>
                            <li>Reset all account balances to ৳ 0</li>
                        </ul>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button
                            onClick={() => setIsResetModalOpen(false)}
                            className="btn"
                            style={{ background: 'var(--bg-color)', color: 'var(--text-primary)' }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleReset}
                            disabled={isResetting}
                            style={{
                                background: 'var(--danger-color)',
                                color: 'white',
                                border: 'none',
                                padding: '0.75rem 1.5rem',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.9375rem',
                                fontWeight: '700',
                                cursor: isResetting ? 'not-allowed' : 'pointer',
                                opacity: isResetting ? 0.6 : 1,
                            }}
                        >
                            {isResetting ? 'Resetting...' : 'Yes, Reset Everything'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Add Account Modal */}
            <Modal isOpen={isAccountModalOpen} onClose={() => setIsAccountModalOpen(false)} title="Add New Account" size="md">
                <form onSubmit={handleCreateAccount} style={{ padding: '1rem 0' }}>
                    <div style={{ display: 'grid', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem' }}>
                                Account Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                placeholder="e.g., Dutch-Bangla Bank"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '2px solid var(--border-color)',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '0.9375rem',
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem' }}>
                                Account Type *
                            </label>
                            <select
                                name="type"
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '2px solid var(--border-color)',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '0.9375rem',
                                }}
                            >
                                <option value="">Select Type</option>
                                <option value="Bank">Bank</option>
                                <option value="Mobile Banking">Mobile Banking</option>
                                <option value="Cash">Cash</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem' }}>
                                Initial Balance
                            </label>
                            <input
                                type="number"
                                name="currentBalance"
                                step="0.01"
                                defaultValue="0"
                                placeholder="0.00"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '2px solid var(--border-color)',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '0.9375rem',
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                        <button
                            type="button"
                            onClick={() => setIsAccountModalOpen(false)}
                            className="btn"
                            style={{ background: 'var(--bg-color)', color: 'var(--text-primary)' }}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Create Account
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
