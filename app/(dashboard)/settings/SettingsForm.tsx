'use client'

import { useState } from 'react'
import { Save } from 'lucide-react'

export function SettingsForm() {
    const [orgInfo, setOrgInfo] = useState({
        name: '24Studio Foundation',
        address: 'Dhaka, Bangladesh',
        email: 'info@24studio.org',
        phone: '+880 XXX XXXX',
        website: 'https://24studio.org',
    })

    const [categories, setCategories] = useState({
        revenue: ['Course Fees', 'Project Income', 'Consulting', 'Grants', 'Donations'],
        expense: ['Salaries', 'Rent', 'Utilities', 'Supplies', 'Marketing', 'Training', 'Equipment'],
    })

    const [isSaved, setIsSaved] = useState(false)

    const handleSave = () => {
        // Here you would save to database
        setIsSaved(true)
        setTimeout(() => setIsSaved(false), 3000)
    }

    return (
        <div style={{ display: 'grid', gap: '2rem' }}>
            {/* Organization Information */}
            <div className="card">
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    🏢 Organization Information
                </h2>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem' }}>
                            Organization Name
                        </label>
                        <input
                            type="text"
                            value={orgInfo.name}
                            onChange={(e) => setOrgInfo({ ...orgInfo, name: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.875rem',
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem' }}>
                            Address
                        </label>
                        <input
                            type="text"
                            value={orgInfo.address}
                            onChange={(e) => setOrgInfo({ ...orgInfo, address: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.875rem',
                            }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem' }}>
                                Email
                            </label>
                            <input
                                type="email"
                                value={orgInfo.email}
                                onChange={(e) => setOrgInfo({ ...orgInfo, email: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.875rem',
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem' }}>
                                Phone
                            </label>
                            <input
                                type="tel"
                                value={orgInfo.phone}
                                onChange={(e) => setOrgInfo({ ...orgInfo, phone: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.875rem',
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
                            value={orgInfo.website}
                            onChange={(e) => setOrgInfo({ ...orgInfo, website: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.875rem',
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="card">
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    📋 Income & Expense Categories
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--success-color)' }}>
                            💰 Revenue Categories
                        </h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {categories.revenue.map((cat, idx) => (
                                <span
                                    key={idx}
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
                                        color: 'var(--success-color)',
                                        padding: '0.5rem 1rem',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                    }}
                                >
                                    {cat}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--danger-color)' }}>
                            💳 Expense Categories
                        </h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {categories.expense.map((cat, idx) => (
                                <span
                                    key={idx}
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                                        color: 'var(--danger-color)',
                                        padding: '0.5rem 1rem',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                    }}
                                >
                                    {cat}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* System Preferences */}
            <div className="card">
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    ⚙️ System Preferences
                </h2>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-sm)' }}>
                        <span style={{ fontWeight: '600' }}>Default Currency</span>
                        <span style={{ color: 'var(--text-secondary)' }}>BDT (৳)</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-sm)' }}>
                        <span style={{ fontWeight: '600' }}>Date Format</span>
                        <span style={{ color: 'var(--text-secondary)' }}>DD/MM/YYYY</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-sm)' }}>
                        <span style={{ fontWeight: '600' }}>Fiscal Year</span>
                        <span style={{ color: 'var(--text-secondary)' }}>January - December</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-sm)' }}>
                        <span style={{ fontWeight: '600' }}>Time Zone</span>
                        <span style={{ color: 'var(--text-secondary)' }}>UTC+6 (Dhaka)</span>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                {isSaved && (
                    <span style={{ color: 'var(--success-color)', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
                        ✓ Settings saved successfully!
                    </span>
                )}
                <button
                    onClick={handleSave}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Save size={18} />
                    Save Settings
                </button>
            </div>
        </div>
    )
}
