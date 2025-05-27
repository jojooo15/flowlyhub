/**
 * mockData.js
 *
 * INSTRUKSI UNTUK BACKEND DEVELOPER:
 *
 * File ini berisi data dummy untuk pengembangan frontend.
 * Gunakan sebagai referensi untuk struktur data yang diharapkan dari API.
 *
 * 1. Pastikan endpoint API mengembalikan data dengan struktur yang sama
 * 2. Hapus file ini setelah backend selesai diimplementasikan
 * 3. Sesuaikan model data di backend dengan struktur yang ada di sini
 */

// Data stok barang
export const stockData = [
  {
    id: 1,
    tanggal: '21-05-24',
    nama_menu: 'Nasi Goreng',
    jumlah_terjual: 25,
    kategori_menu: 'Makanan Utama',
    harga_satuan: 25000,
    total_penjualan: 625000
  },
  {
    id: 2,
    tanggal: '21-05-24',
    nama_menu: 'Mie Goreng',
    jumlah_terjual: 18,
    kategori_menu: 'Makanan Utama',
    harga_satuan: 22000,
    total_penjualan: 396000
  },
  {
    id: 3,
    tanggal: '21-05-24',
    nama_menu: 'Es Teh',
    jumlah_terjual: 40,
    kategori_menu: 'Minuman',
    harga_satuan: 5000,
    total_penjualan: 200000
  },
  {
    id: 4,
    tanggal: '20-05-24',
    nama_menu: 'Nasi Goreng',
    jumlah_terjual: 22,
    kategori_menu: 'Makanan Utama',
    harga_satuan: 25000,
    total_penjualan: 550000
  },
  {
    id: 5,
    tanggal: '20-05-24',
    nama_menu: 'Mie Goreng',
    jumlah_terjual: 15,
    kategori_menu: 'Makanan Utama',
    harga_satuan: 22000,
    total_penjualan: 330000
  },
  {
    id: 6,
    tanggal: '20-05-24',
    nama_menu: 'Es Teh',
    jumlah_terjual: 35,
    kategori_menu: 'Minuman',
    harga_satuan: 5000,
    total_penjualan: 175000
  }
];

// Data karyawan
export const employeeData = [
  {
    id: 1,
    employeeId: 'EMP001',
    name: 'Budi Santoso',
    position: 'Manager',
    email: 'budi@example.com',
    phone: '081234567890',
    address: 'Jl. Pahlawan No. 123, Jakarta',
    joinDate: '2023-01-15',
    status: 'Aktif'
  },
  {
    id: 2,
    employeeId: 'EMP002',
    name: 'Ani Wijaya',
    position: 'Kasir',
    email: 'ani@example.com',
    phone: '081234567891',
    address: 'Jl. Merdeka No. 45, Jakarta',
    joinDate: '2023-02-20',
    status: 'Aktif'
  },
  {
    id: 3,
    employeeId: 'EMP003',
    name: 'Citra Dewi',
    position: 'Admin',
    email: 'citra@example.com',
    phone: '081234567892',
    address: 'Jl. Sudirman No. 78, Jakarta',
    joinDate: '2023-03-10',
    status: 'Aktif'
  },
  {
    id: 4,
    employeeId: 'EMP004',
    name: 'Dodi Pratama',
    position: 'Gudang',
    email: 'dodi@example.com',
    phone: '081234567893',
    address: 'Jl. Gatot Subroto No. 56, Jakarta',
    joinDate: '2023-04-05',
    status: 'Aktif'
  }
];

// Data absensi
export const attendanceData = [
  {
    id: 1,
    tanggal: '21-05-24',
    id_karyawan: 9,
    nama_karyawan: 'Karyawan_9',
    jam_masuk: '8:34',
    jam_jadwal: '8:00',
    terlambat: 1,
    cuaca: 'Hujan',
    hari: 'Tuesday'
  },
  {
    id: 2,
    tanggal: '01-04-24',
    id_karyawan: 12,
    nama_karyawan: 'Karyawan_12',
    jam_masuk: '8:41',
    jam_jadwal: '8:00',
    terlambat: 1,
    cuaca: 'Berawan',
    hari: 'Monday'
  },
  {
    id: 3,
    tanggal: '24-06-24',
    id_karyawan: 8,
    nama_karyawan: 'Karyawan_8',
    jam_masuk: '8:06',
    jam_jadwal: '8:00',
    terlambat: 1,
    cuaca: 'Cerah',
    hari: 'Monday'
  },
  {
    id: 4,
    tanggal: '02-03-24',
    id_karyawan: 11,
    nama_karyawan: 'Karyawan_11',
    jam_masuk: '7:56',
    jam_jadwal: '8:00',
    terlambat: 0,
    cuaca: 'Hujan',
    hari: 'Saturday'
  },
  {
    id: 5,
    tanggal: '07-06-24',
    id_karyawan: 15,
    nama_karyawan: 'Karyawan_15',
    jam_masuk: '8:55',
    jam_jadwal: '8:00',
    terlambat: 1,
    cuaca: 'Hujan',
    hari: 'Friday'
  },
  {
    id: 6,
    tanggal: '19-08-24',
    id_karyawan: 18,
    nama_karyawan: 'Karyawan_18',
    jam_masuk: '8:02',
    jam_jadwal: '8:00',
    terlambat: 0,
    cuaca: 'Hujan',
    hari: 'Monday'
  },
  {
    id: 7,
    tanggal: '24-08-24',
    id_karyawan: 6,
    nama_karyawan: 'Karyawan_6',
    jam_masuk: '8:55',
    jam_jadwal: '8:00',
    terlambat: 1,
    cuaca: 'Hujan',
    hari: 'Saturday'
  },
  {
    id: 8,
    tanggal: '22-09-24',
    id_karyawan: 5,
    nama_karyawan: 'Karyawan_5',
    jam_masuk: '8:51',
    jam_jadwal: '8:00',
    terlambat: 1,
    cuaca: 'Hujan',
    hari: 'Sunday'
  }
];

// Data laporan
export const reportData = [
  {
    id: 1,
    tanggal: '21-05-24',
    jenis_transaksi: 'Pemasukan',
    kategori_transaksi: 'Penjualan',
    jumlah: 500000,
    keterangan: 'Penjualan harian'
  },
  {
    id: 2,
    tanggal: '21-05-24',
    jenis_transaksi: 'Pengeluaran',
    kategori_transaksi: 'Belanja Bahan',
    jumlah: 250000,
    keterangan: 'Pembelian bahan baku'
  },
  {
    id: 3,
    tanggal: '20-05-24',
    jenis_transaksi: 'Pemasukan',
    kategori_transaksi: 'Penjualan',
    jumlah: 450000,
    keterangan: 'Penjualan harian'
  },
  {
    id: 4,
    tanggal: '20-05-24',
    jenis_transaksi: 'Pengeluaran',
    kategori_transaksi: 'Operasional',
    jumlah: 100000,
    keterangan: 'Biaya listrik'
  },
  {
    id: 5,
    tanggal: '19-05-24',
    jenis_transaksi: 'Pemasukan',
    kategori_transaksi: 'Penjualan',
    jumlah: 550000,
    keterangan: 'Penjualan harian'
  },
  {
    id: 6,
    tanggal: '19-05-24',
    jenis_transaksi: 'Pengeluaran',
    kategori_transaksi: 'Gaji',
    jumlah: 1500000,
    keterangan: 'Pembayaran gaji karyawan'
  }
];

// Data profil toko
export const storeProfile = {
  id: 1,
  name: 'Toko Sejahtera',
  address: 'Jl. Pahlawan No. 123, Jakarta',
  phone: '021-12345678',
  email: 'info@tokosejahtera.com',
  taxId: '12.345.678.9-012.000',
  logo: null,
  businessType: 'Retail',
  establishedDate: '2020-01-01',
  operationalHours: '08:00 - 17:00',
  socialMedia: {
    facebook: 'tokosejahtera',
    instagram: '@tokosejahtera',
    website: 'www.tokosejahtera.com'
  }
};

// Data pengguna
export const userData = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    name: 'Administrator',
    role: 'admin',
    lastLogin: '2025-05-21T08:00:00Z'
  },
  {
    id: 2,
    username: 'manager',
    email: 'manager@example.com',
    name: 'Store Manager',
    role: 'manager',
    lastLogin: '2025-05-20T09:30:00Z'
  },
  {
    id: 3,
    username: 'kasir',
    email: 'kasir@example.com',
    name: 'Kasir',
    role: 'cashier',
    lastLogin: '2025-05-21T08:15:00Z'
  }
];

// Fungsi untuk membuat response API palsu
export const createMockResponse = (data, success = true, message = 'Success') => {
  return {
    success,
    data,
    message
  };
};

export default {
  stockData,
  employeeData,
  attendanceData,
  reportData,
  storeProfile,
  userData,
  createMockResponse
};
