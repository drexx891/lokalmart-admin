// @ts-ignore
import midtransClient from 'midtrans-client';

// Create Snap API instance
const snap = new midtransClient.Snap({
    // Set to true if you want Production Environment (accept real transaction).
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-TZiFwQc0E9Bq-KlsB_uU_d1g',
    clientKey: process.env.MIDTRANS_CLIENT_KEY || 'SB-Mid-client-0z0B0h_mB2bN7D1T'
});

export { snap };
