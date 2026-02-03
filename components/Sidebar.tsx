'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    TrendingUp,
    Heart,
    Users,
    CreditCard,
    Wallet,
    PieChart,
    FileText,
    Settings,
    LogOut,
    UserCog
} from 'lucide-react'
import styles from './Sidebar.module.css'
import { logout } from '@/app/actions/auth'

type UserRole = 'PRESIDENT' | 'REVENUE_TEAM' | 'FINANCE_TEAM'

interface SidebarProps {
    role: UserRole
    userName: string
}

export function Sidebar({ role, userName }: SidebarProps) {
    const pathname = usePathname()

    const links = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['PRESIDENT', 'REVENUE_TEAM', 'FINANCE_TEAM'] },
        { name: 'Revenue', href: '/revenue', icon: TrendingUp, roles: ['PRESIDENT', 'REVENUE_TEAM'] },
        { name: 'Donations', href: '/donations', icon: Heart, roles: ['PRESIDENT', 'REVENUE_TEAM'] },
        { name: 'Donors', href: '/donors', icon: Users, roles: ['PRESIDENT', 'REVENUE_TEAM'] },
        { name: 'Expenses', href: '/expenses', icon: CreditCard, roles: ['PRESIDENT', 'FINANCE_TEAM'] },
        { name: 'Accounts', href: '/accounts', icon: Wallet, roles: ['PRESIDENT', 'REVENUE_TEAM', 'FINANCE_TEAM'] },
        { name: 'Budgets', href: '/budget', icon: PieChart, roles: ['PRESIDENT', 'FINANCE_TEAM'] },
        { name: 'Reports', href: '/reports', icon: FileText, roles: ['PRESIDENT'] },
        { name: 'User Management', href: '/users', icon: UserCog, roles: ['PRESIDENT'] },
        { name: 'Settings', href: '/settings', icon: Settings, roles: ['PRESIDENT'] },
    ]

    const allowedLinks = links.filter(link => link.roles.includes(role))

    const getRoleDisplay = (role: UserRole) => {
        switch (role) {
            case 'PRESIDENT': return '👑 President'
            case 'REVENUE_TEAM': return '💰 Revenue Team'
            case 'FINANCE_TEAM': return '💳 Finance Team'
            default: return role
        }
    }

    return (
        <div className={styles.sidebar}>
            <div>
                <div className={styles.logo}>
                    <img src="/logo.png" alt="24Studio" style={{ width: '140px', height: 'auto' }} />
                </div>
                <div className={styles.user}>
                    <div className={styles.avatar}>{userName ? userName[0] : 'U'}</div>
                    <div className={styles.userInfo}>
                        <span className={styles.userName}>{userName}</span>
                        <span className={styles.userRole}>{getRoleDisplay(role)}</span>
                    </div>
                </div>

                <nav className={styles.nav}>
                    {allowedLinks.map((link) => {
                        const Icon = link.icon
                        const isActive = pathname.startsWith(link.href)
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`${styles.link} ${isActive ? styles.active : ''}`}
                            >
                                <Icon size={20} />
                                <span>{link.name}</span>
                            </Link>
                        )
                    })}
                </nav>
            </div>

            <div className={styles.footer}>
                <button className={styles.logoutBtn} onClick={() => logout()}>
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    )
}
