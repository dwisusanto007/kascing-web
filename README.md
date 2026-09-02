# Kascing.id — Website Frontend

Frontend Kascing.id: edukasi, riset, dan direktori produsen kascing (bekas cacing), dibangun sesuai backlog Trello
"Kascing Website - Frontend". Dibangun dengan Next.js (App Router), TypeScript, dan Tailwind CSS, memakai data mock
lokal (`src/lib/mock-data.ts`) — belum tersambung ke backend/API.

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

Perintah lain: `npm run build` (production build), `npm run lint` (ESLint).

## Deploy

Lihat [`DEPLOYMENT.md`](./DEPLOYMENT.md) untuk langkah setup di Vercel (build settings, environment variables,
custom domain, preview deployment per PR).

## Struktur

- `src/app/` — halaman (App Router): beranda, direktori, belajar-kascing, berita, riset, studi-kasus, sumber-daya.
- `src/components/ui/` — komponen dasar bersama: `Card`, `FilterDropdown`, `Modal`, `Skeleton`, `EmptyState`,
  `SectionErrorBoundary`, `Accordion`, `Breadcrumb`, `Pagination`, dll.
- `src/components/<fitur>/` — komponen khusus per halaman (mis. `direktori/DirectoryExplorer.tsx`).
- `src/lib/mock-data.ts` — seluruh data contoh (produsen, artikel, berita, riset, studi kasus, FAQ, dll).
- `src/lib/hooks/useAsyncData.ts` — hook yang mensimulasikan pemuatan data async (skeleton, error, slow-loading).

## Query param debug untuk QA

Karena belum ada backend nyata, beberapa kondisi tepi disimulasikan lewat query param — bisa ditambahkan ke URL
halaman mana pun yang memuat data (Beranda, Direktori, Belajar Kascing, Berita, Riset, Studi Kasus):

| Query param | Efek |
| --- | --- |
| `?debugEmpty=1` | Memaksa data kosong → menampilkan Empty State. |
| `?debugError=1` | Memaksa pemuatan data gagal → menampilkan Error Boundary + tombol "Coba lagi" (retry dibatasi 3x). |
| `?debugSlow=1` | Memaksa pemuatan lambat (>4 detik) → menampilkan pesan "Masih memuat...". |

Contoh: `/direktori?debugError=1`, `/belajar-kascing?debugEmpty=1`.

Kasus tepi lain yang bisa dites langsung:

- `/direktori/slug-tidak-ada` → halaman 404 custom.
- `/direktori/<slug>?debugNoContact=1` → profil produsen tanpa kontak (tombol "Hubungi" disabled/pesan info).
- Form pendaftaran (`/direktori/daftar`) dan form ajukan publikasi (`/riset`): validasi per field, upload file
  format/ukuran salah, submit ganda dicegah.
- Newsletter: email `sudah@terdaftar.com` mensimulasikan kondisi "email sudah terdaftar".
