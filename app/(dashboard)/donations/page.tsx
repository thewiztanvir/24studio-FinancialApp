import { getDonations } from '@/app/actions/donors'
import { DonationsList } from './DonationsList'

export default async function DonationsPage() {
    const donations = await getDonations()

    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Donation Management</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Track all donations</p>

            <DonationsList initialDonations={donations} />
        </div>
    )
}
