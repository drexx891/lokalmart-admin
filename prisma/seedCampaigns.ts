import { prisma } from '../src/lib/prisma';

async function main() {
    console.log('Seeding Campaigns...');

    await prisma.campaign.deleteMany();

    // 1. Main Slider Campaigns (3 slides)
    await prisma.campaign.create({
        data: {
            title: 'Pusat Grosir',
            subtitle: 'LokalMart B2B',
            position: 'main_slider',
            colorFrom: '#1A3C6E',
            colorTo: '#2A5FA0',
            pageTitle: 'LokalMart - Pusat Grosir Terbesar',
            pageContent: '<h2>Temukan Ribuan Produk Grosir</h2><p>Dapatkan harga pabrik dengan membeli dalam jumlah besar langsung dari supplier terverifikasi kami.</p>'
        }
    });

    await prisma.campaign.create({
        data: {
            title: 'Festival Baju Lebaran',
            subtitle: 'Diskon Spesial',
            position: 'main_slider',
            colorFrom: '#10B981',
            colorTo: '#059669',
            pageTitle: 'Festival Baju Lebaran B2B',
            pageContent: '<h2>Stok Baju Lebaran Lebih Awal!</h2><p>Beli kodian lebih murah. Dapatkan potongan harga hingga 40% untuk pembelian minimal 10 kodi khusus kategori Fashion Muslim.</p>'
        }
    });

    await prisma.campaign.create({
        data: {
            title: 'Cuci Gudang',
            subtitle: 'Elektronik Lokal',
            position: 'main_slider',
            colorFrom: '#EB4D4B',
            colorTo: '#c0392b',
            pageTitle: 'Cuci Gudang Elektronik',
            pageContent: '<h2>Jangan Lewatkan Promo Elektronik!</h2><p>Promo cuci gudang akhir tahun untuk produk elektronik dan gadget dari pabrik-pabrik ternama.</p>'
        }
    });

    // 2. Right Top Banner (Premium)
    await prisma.campaign.create({
        data: {
            title: 'LokalMart',
            subtitle: 'Premium',
            position: 'right_top',
            colorFrom: '#B91C1C',
            colorTo: '#DC2626',
            pageTitle: 'LokalMart Premium (100% ORI)',
            pageContent: '<h2>Kualitas Premium Terjamin!</h2><p>Semua produk di LokalMart Premium dijamin 100% original langsung dari brand resmi lokal Indonesia. Bebas ongkir sepuasnya.</p>'
        }
    });

    // 3. Right Bottom Banner (Flash Deal)
    await prisma.campaign.create({
        data: {
            title: 'Penuhi Stok Tokomu',
            subtitle: 'PROMO BISNIS',
            position: 'right_bottom',
            colorFrom: '#4C1D95',
            colorTo: '#7C3AED',
            pageTitle: 'Promo Diskon S.D. 80%',
            pageContent: '<h2>Flash Deal B2B</h2><p>Gunakan voucher <strong>PROMO100RB</strong> untuk mendapatkan ekstra potongan 100 ribu rupiah. Berlaku kelipatan!</p>'
        }
    });

    console.log('✅ Seeding Campaigns Berhasil!');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
