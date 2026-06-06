const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function run() {
    const hp = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@belio.id' },
        update: { password: hp, role: 'admin', pin2FA: '123456' },
        create: {
            name: 'Super Admin',
            email: 'admin@belio.id',
            password: hp,
            role: 'admin',
            pin2FA: '123456'
        }
    });
    console.log('Admin created:', admin.email);
}

run().finally(() => prisma.$disconnect());
