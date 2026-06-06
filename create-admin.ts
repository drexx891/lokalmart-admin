import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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

run().finally(() => {
    prisma.$disconnect();
    pool.end();
});
