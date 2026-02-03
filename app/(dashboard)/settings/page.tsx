import { SettingsManager } from './SettingsManager'

export default function SettingsPage() {
    return (
        <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>Settings</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '1rem' }}>
                Complete administrative control over the finance system
            </p>

            <SettingsManager />
        </div>
    )
}
