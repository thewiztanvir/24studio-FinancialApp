import styles from './Table.module.css'

interface TableColumn {
    key: string
    label: string
    render?: (value: any, row: any) => React.ReactNode
}

interface TableProps {
    columns: TableColumn[]
    data: any[]
    emptyMessage?: string
}

export function Table({ columns, data, emptyMessage = 'No data available' }: TableProps) {
    if (data.length === 0) {
        return (
            <div className={styles.empty}>
                <p>{emptyMessage}</p>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key}>{col.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, idx) => (
                        <tr key={idx}>
                            {columns.map((col) => (
                                <td key={col.key}>
                                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
