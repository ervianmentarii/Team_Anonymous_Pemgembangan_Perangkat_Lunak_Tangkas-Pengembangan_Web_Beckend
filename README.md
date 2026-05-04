<div align="center">

# 🏥 Team Anonymous
### Pengembangan Perangkat Lunak Universitas Mikroskil

</div>


**HealthCare Management System** adalah aplikasi web manajemen layanan kesehatan yang dikembangkan oleh Tim Anonymous dari Universitas Mikroskil menggunakan **Express.js + Prisma ORM (Back-End)** dan **React js (Front-End)**. Website ini dirancang untuk membantu pengguna mengelola layanan kesehatan secara digital, mencakup pengelolaan janji temu dokter, rekam medis pasien, dan sistem administrasi backend yang aman. Tampilannya dibuat responsif dan mudah digunakan, sehingga cocok untuk pasien maupun tenaga medis tanpa perlu keahlian teknis khusus.

Website ini bersifat upgradable konten, fitur, dan tampilan akan terus dikembangkan sesuai kebutuhan. Saat ini sudah terdapat beberapa ide pengembangan yang sedang dalam tahap prototyping dan membutuhkan analisis lebih lanjut sebelum diimplementasikan. Pengembangan tidak berhenti pada versi saat ini, melainkan akan terus disesuaikan dengan kebutuhan pengguna dan ide-ide baru yang muncul dalam proses pengerjaan. Saat ini, tim sudah memiliki sejumlah gagasan pengembangan yang sebagian telah masuk tahap sketsa dan prototyping.




[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)](https://jwt.io/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)

---

## 🔗 Link penting(code + video demo)

*   **Source Code** : <sub>[![Google Drive](https://img.shields.io/badge/Google_Drive-Repository-34A853?style=flat&logo=googledrive&logoColor=white)](https://drive.google.com/drive/folders/1jliWODZskVRpyUMDvKU06VhNmBIuAP8l?usp=sharing)</sub>

*   **Video Demo** : <sub>[![YouTube](https://img.shields.io/badge/YouTube-Video_Demo-FF0000?style=flat&logo=youtube&logoColor=white)](https://youtu.be/NFxB7XhBth0)</sub>

---
## 1. Informasi Tim

- **Nama Tim:** Anonymous
- **Status:** Mahasiswa Semester 4
- **Fakultas:** Teknik Informatika S-1
---
## Anggota
| No. | Nama                     | NIM        |
|-----|--------------------------|------------|
| 1.  | Ervian Mentari           | 241110896  |
| 2.  | Laurencio Luckson        | 241110805  |
| 3.  | Shawn Michael            | 241111461  |
| 4.  | Jonathan Felix Fubrianto | 241112984  |
---

## 2. Teknis Akses Website

Website dibangun menggunakan **Express.js** (Back-End) dan **React js** (Front-End). Cara mengaksesnya:

**Back-End (API Server):**
1. Buka terminal (CMD/PowerShell) pada direktori `backend/`.
2. Jalankan perintah `npm install` untuk menginstal dependensi.
    ```
    npm install
    ```
3. Konfigurasikan file `.env` (database URL, JWT secret, dsb.).
4. Jalankan database dengan `npx prisma generate`.
    ```
    npm prisma generate
    ```
5. Jalankan server dengan perintah `npm run dev`.
    ```
    npm run dev
    ```
6. API akan berjalan di `http://localhost:8000/` (atau sesuai konfigurasi port).
   ```
   http://localhost:8000/
   ```

**Front-End (UI):**
1. Buka terminal pada direktori `frontend/`.
2. Jalankan perintah `npm install` untuk menginstal dependensi.
    ```
    npm install 
    ```
3. Jalankan dengan perintah `npm run dev`.
    ```
    npm run dev
    ```
4. Akses tautan localhost (biasanya `http://localhost:3000/`) di browser.
   Contoh-Output :
    ```
    Server running at http://localhost:3000/
    ````
5. Salin dan CTRL + Click / paste di browser manapun (FireFox , Chrome , Edge ).
    ```
    http://localhost:3000/
    ```

---

## 3. Fitur Utama (15 Fitur)

Website ini dilengkapi dengan berbagai fitur untuk memudahkan pengelolaan layanan kesehatan secara digital:

- **Back-End (API):** Authentication (JWT), Doctor Management (CRUD), Appointment System, Health Records, File Upload, Audit Log, dan Notification.
- **Front-End (UI):** Home, Services, Doctors Directory, Appointments, Dashboard, Login & Register, Contact, serta Navbar & Footer yang responsif.

### Penjelasan Singkat 15 Fitur

| No | Fitur | Deskripsi |
|----|-------|-----------|
| 1 | 🔐  **Authentication** | Sistem registrasi dan login user menggunakan password hashing (bcrypt) dan JSON Web Token (JWT) untuk keamanan akses. |
| 2 | 🩺  **Doctor Management (CRUD)** | Pengelolaan data dokter secara lengkap menambah, membaca, memperbarui, dan menghapus data mulai dari spesialisasi hingga jadwal praktik. |
| 3 | 📅  **Appointment System** | Alur booking dokter lengkap dengan manajemen status janji temu (Pending, Confirmed, Cancelled) yang dapat dikelola oleh pasien maupun admin. |
| 4 | 🗂️  **Health Records** | Penyimpanan riwayat medis digital pasien secara terstruktur, mencakup Diagnosis, Resep obat, dan Hasil Lab. |
| 5 | 📎  **File Upload** | Integrasi upload foto profil dokter dan dokumen medis (PDF/Gambar) menggunakan Cloudinary atau Local Storage. |
| 6 | 📋  **Audit Log** | Sistem pelacakan perubahan data penting secara otomatis mencatat siapa yang melakukan perubahan, apa yang diubah, dan kapan perubahan terjadi. |
| 7 | 🔔  **Notification** | Pengingat untuk jadwal appointment melalui email atau notifikasi in-app agar pasien tidak melewatkan janji temu. |
| 8 | 🏠  **Home** | Halaman utama yang memberikan gambaran umum platform, visi layanan kesehatan, dan akses cepat ke fitur-fitur utama. |
| 9 | 🏥  **Services** | Halaman informasi layanan kesehatan yang tersedia, menampilkan deskripsi lengkap setiap jenis layanan yang ditawarkan. |
| 10 | 👨‍⚕️  **Doctors Directory** | Daftar dokter lengkap dengan fitur filter berdasarkan spesialisasi dan jadwal praktik untuk memudahkan pasien memilih dokter. |
| 11 | 📆  **Appointments** | Halaman form booking yang intuitif bagi pasien untuk membuat janji temu baru serta melihat riwayat dan status janji temu sebelumnya. |
| 12 | 📊  **Dashboard** | Ringkasan personal pengguna menampilkan jadwal mendatang, riwayat kesehatan terbaru, dan statistik layanan secara sekilas. |
| 13 | 🔑  **Login & Register** | Halaman autentikasi yang user-friendly untuk akses masuk dan pendaftaran akun pengguna baru ke dalam sistem. |
| 14 | 📬  **Contact** | Formulir kontak untuk komunikasi langsung antara pengguna dan tim layanan, dilengkapi informasi lokasi dan jam operasional. |
| 15 | 🧭  **Navbar & Footer** | Komponen navigasi dan tata letak halaman yang konsisten dan responsif di semua perangkat untuk pengalaman pengguna yang nyaman. |

---

## 4. Pembagian Tugas

**Framework & Arsitektur** dibuat oleh Ervian dan Laurencio.

pembagian fitur oleh 4 anggota:

| Anggota | Fitur yang Dikerjakan |
|---------|----------------------|
| Ervian |Authentication (JWT), Doctor Management (CRUD), Appointment System, Health Records, File Upload, Audit Log, dan Notification|
| Laurencio |main menu,design UI/UX web,navbar,and components frontend|
| Shawn |components frontend,structure frontend file,and design UI/UX web
| Jonathan |structure file project and documentation file |


| Stakeholder | Anggota |
|--|--|
| Dokumentasi & API Docs | Laurencio, Shawn, Jonathan |
| Database | Ervian |
| Penyusunan File & Struktur Proyek | Shawn, Ervian, Jonathan |
| Design UI/UX | Laurencio, Shawn |
| Upload ke GitHub | Laurencio, Ervian |
| Penjelasan README | Shawn, Laurencio |
---

## 🛠️ Teknologi yang Digunakan
| 🧩 Komponen | ⚙️ Teknologi |
|:---|:---|
| **Back-End** | Express.js, Prisma ORM, SQL |
| **Front-End** | React js + Vite |
| **Keamanan** | JWT, bcrypt |
| **Penyimpanan** | Cloudinary / Local Storage (untuk file upload) |

---

## 📄 Lisensi

Project ini dibuat untuk keperluan akademik **Universitas Mikroskil, 2026**.

> Dibuat dengan 🚀 oleh **Tim Anonymous**
