# FlowlyHub - Sistem Manajemen UMKM

FlowlyHub adalah aplikasi manajemen untuk Usaha Mikro, Kecil, dan Menengah (UMKM) yang fokus pada pengelolaan stok barang, absensi karyawan, riwayat aktivitas, laporan, dan pengaturan.

## Fitur Utama

- **Stok Barang**: Manajemen inventaris dengan pencatatan stok masuk dan keluar
- **Absensi**: Pencatatan kehadiran karyawan
- **Riwayat**: Pencatatan aktivitas sistem
- **Laporan**: Pembuatan laporan dengan kemampuan cetak PDF
- **Pengaturan**: Konfigurasi aplikasi dan profil toko

## Teknologi

- **Frontend**: React.js
- **State Management**: React Context API
- **Styling**: CSS
- **PDF Generation**: jsPDF (client-side) atau backend implementation

## Struktur Proyek

```
flowlyhub/
├── public/
├── src/
│   ├── components/       # Komponen UI yang dapat digunakan kembali
│   ├── context/          # Context API untuk manajemen state
│   ├── pages/            # Halaman-halaman aplikasi
│   ├── services/         # Layanan API dan mock data
│   ├── styles/           # File CSS
│   ├── utils/            # Fungsi utilitas
│   ├── App.jsx           # Komponen utama aplikasi
│   ├── App.css           # Styling untuk App.jsx
│   ├── config.js         # Konfigurasi aplikasi
│   ├── index.css         # Styling global
│   └── main.jsx          # Entry point aplikasi
├── package.json
└── README.md
```

## Panduan untuk Backend Developer

### Struktur API

Aplikasi ini menggunakan struktur API berikut:

```
/api
├── /auth
│   ├── /login            # POST: Login pengguna
│   ├── /register         # POST: Registrasi pengguna baru
│   ├── /logout           # POST: Logout pengguna
│   └── /profile          # GET: Profil pengguna yang login
├── /stock
│   ├── /                 # GET: Semua stok, POST: Tambah stok baru
│   ├── /:id              # GET: Detail stok, PUT: Update stok, DELETE: Hapus stok
│   └── /:id/quantity     # PUT: Update jumlah stok
├── /attendance
│   ├── /                 # GET: Semua absensi
│   ├── /:id              # GET: Detail absensi, PUT: Update absensi
│   ├── /record           # POST: Rekam absensi baru
│   ├── /date/:date       # GET: Absensi berdasarkan tanggal
│   ├── /employee/:id     # GET: Absensi berdasarkan karyawan
│   ├── /range            # GET: Absensi berdasarkan rentang tanggal
│   └── /weather-stats    # GET: Statistik keterlambatan berdasarkan cuaca
├── /history
│   ├── /                 # GET: Semua riwayat
│   ├── /:id              # GET: Detail riwayat
│   ├── /type/:type       # GET: Riwayat berdasarkan tipe
│   └── /range            # GET: Riwayat berdasarkan rentang tanggal
├── /reports
│   ├── /stock            # GET: Laporan stok
│   ├── /attendance       # GET: Laporan absensi
│   ├── /monthly          # GET: Laporan bulanan
│   ├── /yearly           # GET: Laporan tahunan
│   └── /pdf/:type        # POST: Generate PDF
└── /settings
    ├── /store            # GET: Profil toko, PUT: Update profil
    ├── /users            # GET: Semua pengguna, POST: Tambah pengguna
    ├── /users/:id        # PUT: Update pengguna, DELETE: Hapus pengguna
    ├── /backup           # POST: Backup data
    └── /restore          # POST: Restore data
```

### Format Response API

Semua endpoint API harus mengembalikan response dengan format berikut:

```json
{
  "success": true,
  "data": {},
  "message": "Success message"
}
```

Atau jika terjadi error:

```json
{
  "success": false,
  "data": null,
  "message": "Error message"
}
```

### Langkah-langkah Implementasi Backend

1. **Konfigurasi**:
   - Buka file `src/config.js`
   - Ubah `USE_MOCK_API` menjadi `false`
   - Sesuaikan `API_BASE_URL` dengan URL backend yang sebenarnya

2. **Model Data**:
   - Lihat file `src/services/mockData.js` untuk struktur data yang diharapkan
   - Implementasikan model data di backend sesuai dengan struktur tersebut

3. **Endpoint API**:
   - Lihat file `src/services/api.js` untuk endpoint yang diharapkan
   - Implementasikan endpoint di backend sesuai dengan struktur tersebut

4. **Autentikasi**:
   - Implementasikan JWT atau metode autentikasi lainnya
   - Pastikan endpoint `/auth/profile` mengembalikan data pengguna yang login

5. **Pembuatan PDF**:
   - Implementasikan pembuatan PDF di backend menggunakan library seperti PDFKit
   - Endpoint `/reports/pdf/:type` harus mengembalikan URL untuk mengunduh PDF

### Menjalankan Aplikasi

1. Clone repository
2. Install dependencies: `npm install`
3. Jalankan aplikasi: `npm run dev`
4. Buka browser: `http://localhost:5173`

## Catatan Penting

- Aplikasi ini menggunakan mock API untuk pengembangan frontend
- Setelah backend selesai diimplementasikan, ubah `USE_MOCK_API` menjadi `false` di `src/config.js`
- Pastikan endpoint API backend sesuai dengan yang diharapkan frontend
- Jangan menghapus file `src/services/api.js` karena berisi struktur API yang diharapkan

## Struktur Data

### Absensi

Sistem absensi menggunakan struktur data berikut:

```json
{
  "id": 1,
  "tanggal": "21-05-24",           // Format: DD-MM-YY
  "id_karyawan": 9,                // ID karyawan (numeric)
  "nama_karyawan": "Karyawan_9",   // Nama karyawan
  "jam_masuk": "8:34",             // Format: H:MM
  "jam_jadwal": "8:00",            // Jam jadwal masuk
  "terlambat": 1,                  // 1 = terlambat, 0 = tepat waktu
  "cuaca": "Hujan",                // Kondisi cuaca: Hujan, Berawan, Cerah
  "hari": "Tuesday"                // Hari dalam bahasa Inggris
}
```

### Laporan Transaksi

Sistem laporan transaksi menggunakan struktur data berikut:

```json
{
  "id": 1,
  "tanggal": "21-05-24",                // Format: DD-MM-YY
  "jenis_transaksi": "Pemasukan",       // Pemasukan atau Pengeluaran
  "kategori_transaksi": "Penjualan",    // Kategori transaksi
  "jumlah": 500000,                     // Jumlah dalam Rupiah
  "keterangan": "Penjualan harian"      // Keterangan tambahan
}
```

### Stok Menu

Sistem stok menu menggunakan struktur data berikut:

```json
{
  "id": 1,
  "tanggal": "21-05-24",                // Format: DD-MM-YY
  "nama_menu": "Nasi Goreng",           // Nama menu
  "jumlah_terjual": 25,                 // Jumlah yang terjual
  "kategori_menu": "Makanan Utama",     // Kategori menu
  "harga_satuan": 25000,                // Harga per item dalam Rupiah
  "total_penjualan": 625000             // Total penjualan (jumlah_terjual * harga_satuan)
}
```

### Fitur Statistik Cuaca

Sistem absensi dilengkapi dengan fitur statistik keterlambatan berdasarkan cuaca. Endpoint `/attendance/weather-stats` mengembalikan data statistik dalam format:

```json
{
  "Hujan": {
    "count": 15,
    "lateCount": 10,
    "latePercentage": 67
  },
  "Berawan": {
    "count": 8,
    "lateCount": 4,
    "latePercentage": 50
  },
  "Cerah": {
    "count": 7,
    "lateCount": 2,
    "latePercentage": 29
  }
}
```

Statistik ini dapat digunakan untuk menganalisis pengaruh cuaca terhadap keterlambatan karyawan.
