import https from 'https';

const categories = [
    { name: "Tas Pria 4", id: "1591561954557-26941169b49e" },
    { name: "Tas Pria 5", id: "1628151015985-ba2705672ba9" },
    { name: "Tas Pria 6", id: "1548036328-c15641133461" },
    { name: "Kesehatan 4", id: "1584982751601-e157297e5967" },
    { name: "Kesehatan 5", id: "1579684385127-1ef15d508118" },
    { name: "Kesehatan 6", id: "1506126613632-f1e16f316823" }
];

async function checkUrl(url: string): Promise<boolean> {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            resolve(res.statusCode === 200 || res.statusCode === 301 || res.statusCode === 302);
        }).on('error', () => resolve(false));
    });
}

async function main() {
    for (const c of categories) {
        const url = `https://images.unsplash.com/photo-${c.id}?w=200&h=200&fit=crop`;
        const ok = await checkUrl(url);
        console.log(`${ok ? 'OK' : 'FAIL'} - ${c.name} (${url})`);
    }
}

main();
