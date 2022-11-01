---
title: Instalasi
id: tuto-1-installation
slug: 1-installation
---

Pada tutorial kali ini kita akan coba membuat aplikasi web dengan Foal. Aplikasinya berupa todo-list sederhana, di mana user bisa melakukan view, create dan delete catatan to-do mereka.

> **Yang diperlukan:**
>
> [Node.js](https://nodejs.org/en/) versi 16 ke atas

## Memulai Proyek Baru

Pertama-tama kita perlu menginstal Foal *Command Line Interface (CLI)* secara global. Foal CLI ini akan kita gunakan untuk memulai proyek baru serta membuat file pada saat develop.

```sh
npm install -g @foal/cli
```

Kemudian buat sebuah aplikasi baru.

```sh
foal createapp my-app
```

:::note

Ada kesulitan saat instalasi Foal? 👉 Silakan cek [halaman troubleshooting](./installation-troubleshooting).

:::note

Perintah `createapp` ini akan menghasilkan sebuah folder baru yang terstruktur. Sekaligus juga akan menginstal semua file dependency yang dibutuhkan. Mari kita lihat hasilnya:

```shell
my-app/
  config/
  node_modules/
  public/
  src/
    app/
    e2e/
    scripts/
  package.json
  tsconfig.*.json
  .eslintrc.js
```

Folder `my-app` merupakan folder induk proyek kita.
- Folder `config/` berisi file konfigurasi berbagai environment (produksi, tes, develop, e2e, dll)
- Folder `node_modules/` berisi semua file dependency yang diperlukan oleh proyek.
- Folder `public/` berisi file statis. Biasanya berupa file gambar, CSS dan Javascript.
- Folder `src/` berisi kode dari aplikasi yang kita bangun. 
  - Subfolder `app/` berisi kode utama kita (seperti controllers, services, hooks) 
  - Subfolder `e2e/` berisi tes end-to-end.
  - Subfolder `scripts/` berisi script untuk dijalankan di terminal/prompt sebagai command line (seperti: create-user) 
- File `package.json` berisi daftar dependency yang terinstal dan perintah menjalankan proyek.
- File `tsconfig.*.json` berisi konfigurasi kompilasi TypeScript.
- File `.eslintrc.js` berisi konfigurasi linting atau merapikan kode.

> **TypeScript**
>
> Bahasa yang dipergunakan dalam membangun aplikasi web dengan Foal adalah [TypeScript](https://www.typescriptlang.org/). TypeScript ini pada akhirnya dikompilasi menjadi JavaScript. Kelebihan penggunaan TypeScript antara lain tersedianya utilitas di saat develop dan memiliki fitur terbaru dari JavaScript.

## Jalankan Server

Mari kita lihat, apakah proyek kita bisa dijalankan. Eksekusi perintah berikut:

```
cd my-app
npm run dev
```

Seharusnya sekarang server sudah jalan.

> **Server** dengan mode develop akan memantau file kode kita, bila ada perubahan maka secara otomatis akan mengkompilasi ulang dan melakuan reload. Sehingga kita tidak perlu payah me-restart server setiap kali ada perubahan kode. Perlu dicatat bahwa mode ini hanya untuk saat develop, bukan untuk saat produksi. 

> **Port 3001 sudah dipakai server lain?**
>
> Kita bisa mengatur port di file `config/default.json`.

Buka [http://localhost:3001](http://localhost:3001) di browser. Seharusnya tampil tulisan *Welcome on board*.

Selamat, server kita sudah jalan!
