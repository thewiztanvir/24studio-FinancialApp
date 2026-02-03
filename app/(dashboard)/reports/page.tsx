export default function ReportsPage() {
    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Reports</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Generate and export financial reports</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div className="card">
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Monthly Summary</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        Complete overview of revenue, donations, and expenses for the month
                    </p>
                    <button className="btn btn-primary" style={{ width: '100%' }} disabled>
                        Generate Report (Coming Soon)
                    </button>
                </div>

                <div className="card">
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Revenue Report</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        Detailed breakdown of all revenue by category and source
                    </p>
                    <button className="btn btn-primary" style={{ width: '100%' }} disabled>
                        Generate Report (Coming Soon)
                    </button>
                </div>

                <div className="card">
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Donation Report</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        Donor list with amounts and tax receipt status
                    </p>
                    <button className="btn btn-primary" style={{ width: '100%' }} disabled>
                        Generate Report (Coming Soon)
                    </button>
                </div>

                <div className="card">
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Expense Report</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        All expenses by category with vendor details
                    </p>
                    <button className="btn btn-primary" style={{ width: '100%' }} disabled>
                        Generate Report (Coming Soon)
                    </button>
                </div>

                <div className="card">
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Yearly Report</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        Comprehensive annual financial summary with charts
                    </p>
                    <button className="btn btn-primary" style={{ width: '100%' }} disabled>
                        Generate Report (Coming Soon)
                    </button>
                </div>

                <div className="card">
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Export Data</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        Export all data to Excel or CSV format
                    </p>
                    <button className="btn btn-primary" style={{ width: '100%' }} disabled>
                        Export to Excel (Coming Soon)
                    </button>
                </div>
            </div>

            <div className="card" style={{ marginTop: '2rem', background: '#e6f7ff', borderLeft: '4px solid var(--primary-color)' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-color)' }}>📊 Reports Feature - Coming Soon</h4>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    PDF and Excel export functionality will be implemented in the next phase. You can currently view all data in the respective pages (Revenue, Donations, Expenses, Accounts).
                </p>
            </div>
        </div>
    )
}
