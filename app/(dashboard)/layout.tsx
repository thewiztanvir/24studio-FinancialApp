import { Sidebar } from '@/components/Sidebar'
import { cookies } from 'next/headers'
import styles from './layout.module.css'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')

    let user = { role: 'REVENUE_OPS', name: 'User' }
    if (session) {
        try {
            user = JSON.parse(session.value)
        } catch (e) {
            // Should be handled by middleware, but safe fallback
        }
    }

    return (
        <div className={styles.container}>
            <Sidebar role={user.role as any} userName={user.name} />
            <main className={styles.main}>
                {children}
            </main>
        </div>
    )
}
