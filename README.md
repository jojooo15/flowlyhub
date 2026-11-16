# FlowlyHub (Front-End)

Smart Ordering and Financial Management for Local Culinary Businesses.

FlowlyHub adalah aplikasi kasir digital berbasis web untuk UMKM kuliner. Proyek ini dibuat sebagai Capstone Project Coding Camp 2025 powered by DBS Foundation oleh tim CC25-CF299. Repo ini berisi bagian **front-end** yang saya kerjakan sebagai Front-End Developer. Repo tim lengkap (back-end dan machine learning) ada di [Widisuandana/flowlyhub](https://github.com/Widisuandana/flowlyhub).

## Fitur

- Login, registrasi, lupa password, dan reset password
- Dashboard ringkasan usaha
- Pelacakan stok barang (tambah dan ubah produk)
- Pencatatan transaksi penjualan dan riwayat transaksi
- Laporan dengan ekspor ke PDF dan Excel
- Absensi karyawan
- Analitik performa produk
- Profil pengguna

## Teknologi

React 18, Vite, React Router 7, Material UI 7, jsPDF + jspdf-autotable, SheetJS (xlsx), file-saver, date-fns, dayjs

## Menjalankan

Butuh Node.js 18 atau lebih baru.

```bash
npm install
npm run dev
```

Aplikasi terbuka di alamat yang ditampilkan Vite (biasanya http://localhost:5173).

Front-end ini memanggil REST API. Alamat API diatur di `src/config.jsx` (`API_BASE_URL`, bawaan `http://localhost:8086`). Ubah sesuai alamat back-end yang kamu jalankan.

Build produksi:

```bash
npm run build
```

## Struktur

```
src/
  pages/        Halaman (Dashboard, Products, Transactions, Reports, History, Attendance, Profile, Login, ...)
  components/   Komponen UI (Sidebar, Header, overlay tambah/ubah produk dan transaksi, ...)
  context/      State aplikasi (React Context)
  services/     Klien API
  utils/        Pembuat laporan PDF dan Excel
  styles/       CSS per halaman
```

## Tim

Tim CC25-CF299: enam mahasiswa dari empat universitas.
