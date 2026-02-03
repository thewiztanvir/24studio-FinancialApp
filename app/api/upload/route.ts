import { writeFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { existsSync, mkdirSync } from 'fs'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'File size exceeds 5MB' }, { status: 400 })
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type. Only JPG, PNG, PDF allowed' }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Create uploads directory if it doesn't exist
        const uploadDir = path.join(process.cwd(), 'public', 'uploads')
        if (!existsSync(uploadDir)) {
            mkdirSync(uploadDir, { recursive: true })
        }

        // Generate unique filename
        const timestamp = Date.now()
        const ext = path.extname(file.name)
        const filename = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
        const filepath = path.join(uploadDir, filename)

        await writeFile(filepath, buffer)

        return NextResponse.json({
            success: true,
            filename,
            path: `/uploads/${filename}`
        })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }
}
