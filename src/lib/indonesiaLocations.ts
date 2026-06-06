// Data Provinsi & Kota/Kabupaten Utama Indonesia
// Digunakan untuk form pendaftaran toko dan pengaturan lokasi

export interface ProvinsiData {
    provinsi: string;
    kota: string[];
}

export const PROVINSI_INDONESIA: ProvinsiData[] = [
    {
        provinsi: "Aceh",
        kota: ["Banda Aceh", "Lhokseumawe", "Langsa", "Sabang", "Subulussalam", "Aceh Besar", "Aceh Utara", "Aceh Timur", "Aceh Selatan", "Aceh Barat"]
    },
    {
        provinsi: "Sumatera Utara",
        kota: ["Medan", "Binjai", "Pematang Siantar", "Tebing Tinggi", "Padang Sidempuan", "Tanjung Balai", "Sibolga", "Gunungsitoli", "Deli Serdang", "Serdang Bedagai"]
    },
    {
        provinsi: "Sumatera Barat",
        kota: ["Padang", "Bukittinggi", "Payakumbuh", "Solok", "Sawahlunto", "Padang Panjang", "Pariaman", "Pesisir Selatan", "Agam", "Tanah Datar"]
    },
    {
        provinsi: "Riau",
        kota: ["Pekanbaru", "Dumai", "Kampar", "Bengkalis", "Siak", "Indragiri Hilir", "Indragiri Hulu", "Rokan Hulu", "Rokan Hilir", "Pelalawan"]
    },
    {
        provinsi: "Kepulauan Riau",
        kota: ["Batam", "Tanjung Pinang", "Bintan", "Karimun", "Lingga", "Natuna", "Kepulauan Anambas"]
    },
    {
        provinsi: "Jambi",
        kota: ["Kota Jambi", "Sungai Penuh", "Muaro Jambi", "Batanghari", "Tanjung Jabung Barat", "Tanjung Jabung Timur", "Bungo", "Tebo", "Merangin", "Sarolangun"]
    },
    {
        provinsi: "Sumatera Selatan",
        kota: ["Palembang", "Prabumulih", "Pagar Alam", "Lubuklinggau", "Ogan Komering Ilir", "Ogan Komering Ulu", "Muara Enim", "Banyuasin", "Musi Rawas", "Lahat"]
    },
    {
        provinsi: "Bengkulu",
        kota: ["Kota Bengkulu", "Rejang Lebong", "Bengkulu Utara", "Bengkulu Selatan", "Kaur", "Seluma", "Muko-Muko", "Lebong", "Kepahiang", "Bengkulu Tengah"]
    },
    {
        provinsi: "Lampung",
        kota: ["Bandar Lampung", "Metro", "Lampung Selatan", "Lampung Tengah", "Lampung Utara", "Lampung Timur", "Lampung Barat", "Tanggamus", "Way Kanan", "Tulang Bawang"]
    },
    {
        provinsi: "Bangka Belitung",
        kota: ["Pangkalpinang", "Bangka", "Belitung", "Bangka Barat", "Bangka Tengah", "Bangka Selatan", "Belitung Timur"]
    },
    {
        provinsi: "DKI Jakarta",
        kota: ["Jakarta Pusat", "Jakarta Utara", "Jakarta Barat", "Jakarta Selatan", "Jakarta Timur", "Kepulauan Seribu"]
    },
    {
        provinsi: "Jawa Barat",
        kota: ["Bandung", "Bekasi", "Depok", "Bogor", "Cimahi", "Tasikmalaya", "Sukabumi", "Cirebon", "Karawang", "Garut", "Sumedang", "Subang", "Purwakarta", "Cianjur", "Majalengka", "Kuningan", "Indramayu", "Pangandaran", "Banjar", "Kota Bandung Barat"]
    },
    {
        provinsi: "Banten",
        kota: ["Tangerang", "Tangerang Selatan", "Serang", "Cilegon", "Pandeglang", "Lebak", "Kab. Tangerang", "Kab. Serang"]
    },
    {
        provinsi: "Jawa Tengah",
        kota: ["Semarang", "Solo", "Salatiga", "Magelang", "Pekalongan", "Tegal", "Surakarta", "Kudus", "Jepara", "Demak", "Kendal", "Klaten", "Boyolali", "Purwokerto", "Cilacap", "Brebes", "Pemalang", "Batang", "Kebumen", "Wonosobo"]
    },
    {
        provinsi: "DI Yogyakarta",
        kota: ["Kota Yogyakarta", "Sleman", "Bantul", "Gunung Kidul", "Kulon Progo"]
    },
    {
        provinsi: "Jawa Timur",
        kota: ["Surabaya", "Malang", "Kediri", "Blitar", "Madiun", "Mojokerto", "Pasuruan", "Probolinggo", "Batu", "Sidoarjo", "Gresik", "Lamongan", "Tuban", "Bojonegoro", "Jombang", "Nganjuk", "Tulungagung", "Trenggalek", "Ponorogo", "Lumajang"]
    },
    {
        provinsi: "Bali",
        kota: ["Denpasar", "Badung", "Gianyar", "Tabanan", "Bangli", "Klungkung", "Karangasem", "Buleleng", "Jembrana"]
    },
    {
        provinsi: "Nusa Tenggara Barat",
        kota: ["Mataram", "Bima", "Lombok Barat", "Lombok Tengah", "Lombok Timur", "Lombok Utara", "Sumbawa", "Sumbawa Barat", "Dompu", "Kota Bima"]
    },
    {
        provinsi: "Nusa Tenggara Timur",
        kota: ["Kupang", "Ende", "Maumere", "Ruteng", "Labuan Bajo", "Atambua", "Kefamenanu", "Soe", "Waingapu", "Sumba Barat"]
    },
    {
        provinsi: "Kalimantan Barat",
        kota: ["Pontianak", "Singkawang", "Ketapang", "Sintang", "Sambas", "Sanggau", "Landak", "Bengkayang", "Kapuas Hulu", "Sekadau"]
    },
    {
        provinsi: "Kalimantan Tengah",
        kota: ["Palangka Raya", "Kotawaringin Barat", "Kotawaringin Timur", "Kapuas", "Barito Selatan", "Barito Utara", "Murung Raya", "Gunung Mas", "Pulang Pisau", "Katingan"]
    },
    {
        provinsi: "Kalimantan Selatan",
        kota: ["Banjarmasin", "Banjarbaru", "Banjar", "Barito Kuala", "Tapin", "Hulu Sungai Selatan", "Hulu Sungai Tengah", "Hulu Sungai Utara", "Tabalong", "Tanah Laut", "Tanah Bumbu", "Kotabaru", "Balangan"]
    },
    {
        provinsi: "Kalimantan Timur",
        kota: ["Samarinda", "Balikpapan", "Bontang", "Kutai Kartanegara", "Kutai Barat", "Kutai Timur", "Berau", "Penajam Paser Utara", "Paser", "Mahakam Ulu"]
    },
    {
        provinsi: "Kalimantan Utara",
        kota: ["Tarakan", "Tanjung Selor", "Malinau", "Bulungan", "Nunukan"]
    },
    {
        provinsi: "Sulawesi Utara",
        kota: ["Manado", "Bitung", "Tomohon", "Kotamobagu", "Minahasa", "Minahasa Utara", "Minahasa Selatan", "Minahasa Tenggara", "Bolaang Mongondow", "Sangihe"]
    },
    {
        provinsi: "Gorontalo",
        kota: ["Kota Gorontalo", "Gorontalo", "Bone Bolango", "Boalemo", "Pohuwato", "Gorontalo Utara"]
    },
    {
        provinsi: "Sulawesi Tengah",
        kota: ["Palu", "Donggala", "Parigi Moutong", "Poso", "Tojo Una-Una", "Toli-Toli", "Buol", "Banggai", "Banggai Kepulauan", "Morowali", "Sigi"]
    },
    {
        provinsi: "Sulawesi Barat",
        kota: ["Mamuju", "Majene", "Polewali Mandar", "Mamasa", "Pasangkayu", "Mamuju Tengah"]
    },
    {
        provinsi: "Sulawesi Selatan",
        kota: ["Makassar", "Pare-Pare", "Palopo", "Maros", "Pangkep", "Gowa", "Takalar", "Jeneponto", "Bantaeng", "Bulukumba", "Bone", "Soppeng", "Wajo", "Sidrap", "Pinrang", "Enrekang", "Toraja Utara", "Tana Toraja", "Luwu", "Sinjai"]
    },
    {
        provinsi: "Sulawesi Tenggara",
        kota: ["Kendari", "Bau-Bau", "Konawe", "Konawe Selatan", "Kolaka", "Kolaka Utara", "Muna", "Buton", "Bombana", "Wakatobi"]
    },
    {
        provinsi: "Maluku",
        kota: ["Ambon", "Tual", "Maluku Tengah", "Seram Bagian Barat", "Seram Bagian Timur", "Buru", "Maluku Tenggara", "Kepulauan Aru"]
    },
    {
        provinsi: "Maluku Utara",
        kota: ["Ternate", "Tidore Kepulauan", "Halmahera Utara", "Halmahera Selatan", "Halmahera Barat", "Halmahera Timur", "Halmahera Tengah", "Kepulauan Sula", "Pulau Morotai"]
    },
    {
        provinsi: "Papua",
        kota: ["Jayapura", "Merauke", "Mimika", "Jayawijaya", "Nabire", "Biak Numfor", "Sarmi", "Keerom", "Yahukimo", "Pegunungan Bintang"]
    },
    {
        provinsi: "Papua Barat",
        kota: ["Manokwari", "Sorong", "Fakfak", "Kaimana", "Teluk Bintuni", "Teluk Wondama", "Raja Ampat"]
    },
    {
        provinsi: "Papua Selatan",
        kota: ["Merauke", "Boven Digoel", "Mappi", "Asmat"]
    },
    {
        provinsi: "Papua Tengah",
        kota: ["Nabire", "Dogiyai", "Paniai", "Deiyai", "Intan Jaya", "Mimika", "Puncak", "Puncak Jaya"]
    },
    {
        provinsi: "Papua Pegunungan",
        kota: ["Wamena", "Jayawijaya", "Lanny Jaya", "Mamberamo Tengah", "Yalimo", "Yahukimo", "Tolikara", "Nduga"]
    },
    {
        provinsi: "Papua Barat Daya",
        kota: ["Sorong", "Sorong Selatan", "Raja Ampat", "Maybrat", "Tambrauw"]
    }
];

// Daftar Bank & E-Wallet populer Indonesia
export const BANK_OPTIONS = [
    { id: "bca", name: "BCA", type: "bank" },
    { id: "mandiri", name: "Mandiri", type: "bank" },
    { id: "bri", name: "BRI", type: "bank" },
    { id: "bni", name: "BNI", type: "bank" },
    { id: "bsi", name: "BSI", type: "bank" },
    { id: "cimb", name: "CIMB Niaga", type: "bank" },
    { id: "danamon", name: "Danamon", type: "bank" },
    { id: "permata", name: "Permata", type: "bank" },
    { id: "btn", name: "BTN", type: "bank" },
    { id: "maybank", name: "Maybank", type: "bank" },
    { id: "gopay", name: "GoPay", type: "ewallet" },
    { id: "dana", name: "DANA", type: "ewallet" },
    { id: "ovo", name: "OVO", type: "ewallet" },
    { id: "shopeepay", name: "ShopeePay", type: "ewallet" },
];

// Tipe Bisnis
export const BUSINESS_TYPES = [
    "Pabrik",
    "Distributor",
    "Importir",
    "Toko Retail",
    "UMKM",
    "Reseller",
    "Brand Owner",
];
