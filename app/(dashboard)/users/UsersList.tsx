'use client'

import { useState } from 'react'
import { Table } from '@/components/ui/Table'
import { Modal } from '@/components/ui/Modal'
import { Plus, UserCheck, UserX } from 'lucide-react'
import { createUser, toggleUserStatus } from '@/app/actions/users'
import { format } from 'date-fns'
import styles from '../revenue/RevenueForm.module.css'

export function UsersList({ initialUsers }: { initialUsers: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [users, setUsers] = useState(initialUsers)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const result = await createUser(formData)
        if (result.success) {
            setIsModalOpen(false)
            window.location.reload()
        } else {
            alert(result.error)
        }
    }

    const handleToggleStatus = async (userId: number) => {
        const user = users.find(u => u.id === userId)
        const action = user?.isActive ? 'deactivate' : 'activate'
        if (!confirm(`Are you sure you want to ${action} this user?`)) return

        const result = await toggleUserStatus(userId)
        if (result.success) {
            window.location.reload()
        } else {
            alert(result.error)
        }
    }

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'PRESIDENT': return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            case 'REVENUE_TEAM': return 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
            case 'FINANCE_TEAM': return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
            default: return 'var(--text-secondary)'
        }
    }

    const getRoleDisplay = (role: string) => {
        switch (role) {
            case 'PRESIDENT': return '👑 President'
            case 'REVENUE_TEAM': return '💰 Revenue Team'
            case 'FINANCE_TEAM': return '💳 Finance Team'
            default: return role
        }
    }

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        {
            key: 'role',
            label: 'Role',
            render: (role: string) => (
                <span style={{
                    background: getRoleBadgeColor(role),
                    color: 'white',
                    padding: '0.375rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    display: 'inline-block'
                }}>
                    {getRoleDisplay(role)}
                </span>
            )
        },
        {
            key: 'isActive',
            label: 'Status',
            render: (isActive: boolean) => (
                <span style={{
                    color: isActive ? 'var(--success-color)' : 'var(--danger-color)',
                    fontWeight: '600'
                }}>
                    {isActive ? '✓ Active' : '✗ Inactive'}
                </span>
            )
        },
        {
            key: 'createdAt',
            label: 'Created',
            render: (val: any) => format(new Date(val), 'dd/MM/yyyy')
        },
        {
            key: 'id',
            label: 'Actions',
            render: (id: number, row: any) => (
                <button
                    onClick={() => handleToggleStatus(id)}
                    style={{
                        background: row.isActive ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)' : 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
                        border: 'none',
                        color: row.isActive ? 'var(--danger-color)' : 'var(--success-color)',
                        cursor: 'pointer',
                        padding: '0.5rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'var(--transition-base)'
                    }}
                >
                    {row.isActive ? <><UserX size={16} /> Deactivate</> : <><UserCheck size={16} /> Activate</>}
                </button>
            )
        },
    ]

    return (
        <>
            <div style={{ marginBottom: '1.5rem' }}>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} /> Add User
                </button>
            </div>

            <Table columns={columns} data={users} emptyMessage="No users yet" />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New User" size="md">
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label>Full Name *</label>
                        <input type="text" name="name" required placeholder="John Doe" />
                    </div>

                    <div className={styles.field}>
                        <label>Email *</label>
                        <input type="email" name="email" required placeholder="user@24studio.org" />
                    </div>

                    <div className={styles.field}>
                        <label>Password *</label>
                        <input type="password" name="password" required minLength={6} placeholder="Min 6 characters" />
                    </div>

                    <div className={styles.field}>
                        <label>Role *</label>
                        <select name="role" required>
                            <option value="">Select Role</option>
                            <option value="PRESIDENT">👑 President (Full Access)</option>
                            <option value="REVENUE_TEAM">💰 Revenue Team (Income Only)</option>
                            <option value="FINANCE_TEAM">💳 Finance Team (Expenses Only)</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        Create User
                    </button>
                </form>
            </Modal>
        </>
    )
}
