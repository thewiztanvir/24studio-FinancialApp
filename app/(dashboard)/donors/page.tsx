import { getDonors } from '@/app/actions/donors'
import { DonorsList } from './DonorsList'

export default async function DonorsPage() {
    const donors = await getDonors()

    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Donor Management</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Manage your donor database</p>

            <DonorsList initialDonors={donors} />
        </div>
    )
}
