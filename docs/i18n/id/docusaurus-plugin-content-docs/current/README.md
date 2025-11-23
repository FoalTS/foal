---
title: Introduksi
slug: /
---

## Apa itu Foal?

*Foal* (atau *FoalTS*) merupakan sebuah framework Node.JS untuk membangun aplikasi web.

Foal menghadirkan berbagai komponen siap pakai agar kita tak perlu membuat ulang. Kita diberikan sebuah medium lengkap untuk memulai membangun aplikasi web. Antara lain CLI, tes, utilitas frontend, script, otentifikasi, ORM, deploy, GraphQL, Swagger API, AWS, dll. Tak perlu susah payah mencari dan meramu sendiri berbagai package dari npm, semua telah disiapkan.

Namun meskipun menawarkan banyak fitur, Foal sendiri tetaplah simpel. Kerumitan yang tidak perlu bagi pengguna sengaja dihindarkan. Kode yang ringkas dan jelas pada saat membangun akan memudahkan pemeliharaan aplikasi tersebut di masa mendatang. Foal mendorong kita untuk lebih fokus ke kode daripada sibuk menelisik bagaimana internal sebuah framework bekerja.

Terakhir, Foal dibuat menggunakan TypeScript. Typescript sangat membantu dalam urusan type-checking dan memberi kita fitur terbaru dari ECMAScript. Kesalahan dalam kode pun dapat terdeteksi lebih dini. Typescript juga memberikan kita fitur auto-komplit dan dokumen API saat bekerja dalam editor.

## Kebijakan saat Develop

### Ribuan kali Tes

Pengetesan Foal senantiasa menjadi prioritas. Sangat penting bagi kami untuk menghadirkan sebuah produk handal yang benar-benar teruji. Per Desember 2020, Foal telah melalui lebih dari 2100 kali tes. 

### Dokumentasi

Fitur baru, apapun itu, kurang bermanfaat bila tidak disertai dengan petunjuk yang baik. Dokumentasi yang lengkap dan berkualitas adalah kunci dari sebuah framework. Sekiranya ada bagian yang terlewat atau kurang jelas tentang Foal, mohon berkenan melaporkannya via Github, dengan senang hati kami terima! 

### Stabilitas Produk

Kami mencurahkan segenap perhatian atas stabilitas produk. Untuk keterangan lebih lanjut, silakan rujuk [kebijakan dependensi](https://github.com/FoalTS/foal/blob/master/.github/CONTRIBUTING.MD#dependency-policy), [aturan versi semantik](https://github.com/FoalTS/foal/blob/master/.github/CONTRIBUTING.MD#semantic-versioning) dan [kebijakan dukungan jangka panjang](https://github.com/FoalTS/foal/blob/master/.github/CONTRIBUTING.MD#long-term-support-policy-and-schedule).

## Mulai

```
> npm install -g @foal/cli
> foal createapp my-app
> cd my-app
> npm run dev
```

Server develop sudah jalan! Coba buka `http://localhost:3001` dan lihat apa yang tampil!

👉 [Lanjutkan dengan tutorial](./tutorials/simple-todo-list/1-installation) 🌱
