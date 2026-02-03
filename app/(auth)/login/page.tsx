'use client'

import { useActionState } from 'react'
import { login } from '@/app/actions/auth'
import styles from './page.module.css'

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, {})

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>24Studio Finance</h1>
                <p className={styles.subtitle}>Sign in to your account</p>

                <form action={formAction} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="name@24studio.org"
                            required
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            required
                            className={styles.input}
                        />
                    </div>

                    {state.error && <div className={styles.error}>{state.error}</div>}

                    <button type="submit" className="btn btn-primary" disabled={isPending}>
                        {isPending ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    )
}
