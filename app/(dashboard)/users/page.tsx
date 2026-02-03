import { getUsers } from '@/app/actions/users'
import { UsersList } from './UsersList'

export default async function UsersPage() {
    const users = await getUsers()

    return (
        <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>User Management</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '1rem' }}>
                Manage all system users and assign roles
            </p>

            <UsersList initialUsers={users} />
        </div>
    )
}
