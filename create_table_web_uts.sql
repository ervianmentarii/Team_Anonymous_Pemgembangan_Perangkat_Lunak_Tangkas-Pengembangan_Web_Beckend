-- ============================================================
-- CREATE TABLE - Database: web_uts
-- Rewrite semua 8 tabel
-- Server: MySQL 8.0 | Charset: utf8mb4
-- ============================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS `web_uts`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE `web_uts`;

-- ============================================================
-- 1. TABLE: inf_dokter
--    Menyimpan data pribadi & profesi dokter
-- ============================================================

CREATE TABLE `inf_dokter` (
  `id`               INT            NOT NULL AUTO_INCREMENT,
  `nama_lengkap`     VARCHAR(255)   NOT NULL,
  `password`         VARCHAR(255)   NOT NULL,
  `email`            VARCHAR(255)   NOT NULL,
  `sub_spesialisasi` ENUM(
                       'Kardiologi Umum',
                       'Kardiologi Intervensi',
                       'Elektrofisiologi',
                       'Ekokardiografi',
                       'Kardiologi Anak',
                       'Bedah Kardiotoraks',
                       'Spesialis Gagal Jantung'
                     ) NOT NULL,
  `nomor_telepon`    VARCHAR(50)    NOT NULL,
  `mulai_praktik`    DATE           NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_dokter_email` (`email`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci
  COMMENT='Data profil dan profesi dokter';

-- ============================================================
-- 2. TABLE: inf_pasien
--    Menyimpan data pribadi pasien
-- ============================================================

CREATE TABLE `inf_pasien` (
  `id`             INT          NOT NULL AUTO_INCREMENT,
  `nama_lengkap`   VARCHAR(255) NOT NULL,
  `password`       VARCHAR(255) NOT NULL,
  `email`          VARCHAR(255) NOT NULL,
  `nik`            VARCHAR(16)  NOT NULL,
  `jenis_kelamin`  VARCHAR(20)  NOT NULL,
  `tanggal_lahir`  DATE         NOT NULL,
  `alamat`         TEXT,
  `nomor_telepon`  VARCHAR(50)  DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_pasien_email` (`email`),
  UNIQUE KEY `uq_pasien_nik`   (`nik`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci
  COMMENT='Data profil dan identitas pasien';

-- ============================================================
-- 3. TABLE: auth_user
--    Menyimpan akun login semua pengguna (Admin, Dokter, Pasien)
-- ============================================================

CREATE TABLE `auth_user` (
  `id`        INT          NOT NULL AUTO_INCREMENT,
  `email`     VARCHAR(255) NOT NULL,
  `password`  VARCHAR(255) NOT NULL,
  `role`      ENUM('ADMIN','DOKTER','PASIEN') NOT NULL,
  `dokterId`  INT          DEFAULT NULL,
  `pasienId`  INT          DEFAULT NULL,
  `createdAt` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_auth_email`    (`email`),
  UNIQUE KEY `uq_auth_dokterId` (`dokterId`),
  UNIQUE KEY `uq_auth_pasienId` (`pasienId`),
  CONSTRAINT `fk_auth_dokter`
    FOREIGN KEY (`dokterId`) REFERENCES `inf_dokter` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_auth_pasien`
    FOREIGN KEY (`pasienId`) REFERENCES `inf_pasien` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci
  COMMENT='Akun autentikasi untuk semua role pengguna';

-- ============================================================
-- 4. TABLE: inf_jadwal_dokter
--    Menyimpan jadwal praktik dokter per hari
-- ============================================================

CREATE TABLE `inf_jadwal_dokter` (
  `id`                INT  NOT NULL AUTO_INCREMENT,
  `id_dokter`         INT  NOT NULL,
  `hari`              ENUM('Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu') NOT NULL,
  `jam_buka`          TIME NOT NULL,
  `jam_tutup`         TIME NOT NULL,
  `durasi_slot_menit` INT  NOT NULL COMMENT 'Durasi tiap slot konsultasi dalam menit',
  PRIMARY KEY (`id`),
  KEY `idx_jadwal_dokter` (`id_dokter`),
  CONSTRAINT `fk_jadwal_dokter`
    FOREIGN KEY (`id_dokter`) REFERENCES `inf_dokter` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci
  COMMENT='Jadwal praktik dokter berdasarkan hari dan jam';

-- ============================================================
-- 5. TABLE: inf_janji_temu
--    Menyimpan data janji temu antara pasien dan dokter
-- ============================================================

CREATE TABLE `inf_janji_temu` (
  `id`           INT      NOT NULL AUTO_INCREMENT,
  `id_dokter`    INT      NOT NULL,
  `id_pasien`    INT      NOT NULL,
  `id_jadwal`    INT      NOT NULL,
  `waktu_janji`  DATETIME NOT NULL,
  `status`       ENUM('Terjadwal','Selesai','Dibatalkan') NOT NULL DEFAULT 'Terjadwal',
  `catatan`      TEXT,
  PRIMARY KEY (`id`),
  KEY `idx_janji_dokter`  (`id_dokter`),
  KEY `idx_janji_pasien`  (`id_pasien`),
  KEY `idx_janji_jadwal`  (`id_jadwal`),
  CONSTRAINT `fk_janji_dokter`
    FOREIGN KEY (`id_dokter`) REFERENCES `inf_dokter` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_janji_pasien`
    FOREIGN KEY (`id_pasien`) REFERENCES `inf_pasien` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_janji_jadwal`
    FOREIGN KEY (`id_jadwal`) REFERENCES `inf_jadwal_dokter` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci
  COMMENT='Data janji temu pasien dengan dokter';

-- ============================================================
-- 6. TABLE: filedocter
--    Menyimpan file dokumen milik dokter (KTP, BPJS, dll)
-- ============================================================

CREATE TABLE `filedocter` (
  `id`        INT          NOT NULL AUTO_INCREMENT,
  `dokterId`  INT          NOT NULL,
  `jenisFile` ENUM('KTP','BPJS','SELFIE_BPJS','LISENSI') NOT NULL,
  `filename`  VARCHAR(255) NOT NULL,
  `filepath`  VARCHAR(255) NOT NULL,
  `mimetype`  VARCHAR(100) NOT NULL,
  `size`      INT          NOT NULL COMMENT 'Ukuran file dalam bytes',
  `createdAt` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_filedocter_dokter` (`dokterId`),
  CONSTRAINT `fk_filedocter_dokter`
    FOREIGN KEY (`dokterId`) REFERENCES `inf_dokter` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci
  COMMENT='File dokumen identitas milik dokter';

-- ============================================================
-- 7. TABLE: filepasien
--    Menyimpan file dokumen milik pasien (KTP, BPJS, dll)
-- ============================================================

CREATE TABLE `filepasien` (
  `id`        INT          NOT NULL AUTO_INCREMENT,
  `pasienId`  INT          NOT NULL,
  `jenisFile` ENUM('KTP','BPJS','SELFIE_BPJS','LISENSI') NOT NULL,
  `filename`  VARCHAR(255) NOT NULL,
  `filepath`  VARCHAR(255) NOT NULL,
  `mimetype`  VARCHAR(100) NOT NULL,
  `size`      INT          NOT NULL COMMENT 'Ukuran file dalam bytes',
  `createdAt` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_filepasien_pasien` (`pasienId`),
  CONSTRAINT `fk_filepasien_pasien`
    FOREIGN KEY (`pasienId`) REFERENCES `inf_pasien` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci
  COMMENT='File dokumen identitas milik pasien';

-- ============================================================
-- 8. TABLE: audit_log
--    Menyimpan log aktivitas pemeriksaan pasien oleh dokter
-- ============================================================

CREATE TABLE `audit_log` (
  `id`         INT       NOT NULL AUTO_INCREMENT,
  `dokter_id`  INT       DEFAULT NULL,
  `pasien_id`  INT       DEFAULT NULL,
  `status`     ENUM('ONPROGRESS','REJECTED','SUCCESS') NOT NULL,
  `catatan`    TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_audit_dokter` (`dokter_id`),
  KEY `idx_audit_pasien` (`pasien_id`),
  CONSTRAINT `fk_audit_dokter`
    FOREIGN KEY (`dokter_id`) REFERENCES `inf_dokter` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_audit_pasien`
    FOREIGN KEY (`pasien_id`) REFERENCES `inf_pasien` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci
  COMMENT='Log aktivitas dan status pemeriksaan pasien';
