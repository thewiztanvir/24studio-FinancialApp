import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function initializeSettings() {
    console.log('🔧 Initializing settings...')

    try {
        // Check if settings already exist
        const existing = await prisma.settings.findFirst()

        if (!existing) {
            // Create default settings
            await prisma.settings.create({
                data: {
                    organizationName: '24Studio Foundation',
                    organizationAddress: 'Dhaka, Bangladesh',
                    organizationEmail: 'info@24studio.org',
                    organizationPhone: '+880 XXX XXXX',
                    organizationWebsite: 'https://24studio.org',
                    currency: 'BDT',
                    currencySymbol: '৳',
                    dateFormat: 'DD/MM/YYYY',
                    fiscalYearStart: 1,
                    fiscalYearEnd: 12,
                    revenueCategories: 'Course Fees,Training,Consulting,Grants,Corporate,Projects,Other',
                    expenseCategories: 'Salaries,Rent,Utilities,Supplies,Marketing,Training,Equipment,Transport,Admin,Misc',
                },
            })
            console.log('✅ Default settings created!')
        } else {
            console.log('✅ Settings already exist')
        }
    } catch (error) {
        console.error('❌ Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

initializeSettings()
