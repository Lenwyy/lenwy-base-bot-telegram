# Lenwy Telegram

**Lenwy** Base Bot Telegram — dibangun dengan [Telegraf](https://telegraf.js.org/) (framework bot Telegram) dan module system ESM.

> Semua dokumentasi dan tampilan bot memakai Bahasa Indonesia.

## Fitur

| Perintah | Fungsi |
|---|---|
| `/start` | Halaman utama: foto + caption + tombol menu navigasi (callback) |
| `/chat` | Contoh perintah paling sederhana |
| `/tiktok` | Unduh video TikTok tanpa watermark (via API Makota) |
| `/ai` | Chat dengan AI untuk bertanya / minta penjelasan (via API Makota) |

> 🚧 **Dalam pengembangan:** `/komik` (cari komik/manga via API Makota) — resep lengkap ada di `langkah/07-komik.md`.

## Struktur Folder

```
LenwyTele/
├── package.json              - manifest & daftar library (type: module)
├── LenwySet.js               - titik masuk: banner + panggil Telegram/index.js
├── README.md                 - dokumen ini
├── AGENTS.md                 - panduan untuk AI / kontributor
├── step.md                   - catatan resep lama (format WhatsApp, bukan acuan)
├── langkah/                  - panduan build ulang bertahap (01–07, dijelaskan & dites)
└── Telegram/
    ├── len.js                - KONFIGURASI: token, ID owner, kunci API, pesan umum
    ├── index.js              - boot Telegraf (meluncurkan bot)
    ├── handler.js            - pemuat perintah + pemroses pesan + helper `leni`
    └── case/                 - perintah, satu folder per kategori
        ├── chat/chat.js              - /chat
        ├── owner/start.js            - /start
        ├── downloader/tiktok.js      - /tiktok
        └── ai/ai4chat.js             - /ai
```

Penjelasan singkat:

- **`LenwySet.js`** — menampilkan banner ASCII + info, lalu memanggil boot dari `Telegram/index.js`.
- **`Telegram/index.js`** — membuat instance Telegraf memakai `globalThis.tgToken` dan meluncurkannya (polling).
- **`Telegram/handler.js`** — dua tugas utama: (1) membaca semua file di `Telegram/case/<kategori>/*.js` ke dalam map `commands`, (2) membuat objek `leni` (helper `LenwyText`, `LenwyWait`, `LenwyImage`, `LenwyVideo`, dll.) yang dipakai semua perintah.
- **`Telegram/case/`** — setiap folder = satu kategori di menu `/start`; setiap file = satu (atau lebih) perintah. Tidak perlu didaftarkan manual.
- **`langkah/`** — panduan membangun ulang seluruh proyek ini langkah demi langkah, lengkap dengan penjelasan dan tes di tiap tahap (mulai dari `00-pendahuluan.md`).

## Konfigurasi `Telegram/len.js`

Semua pengaturan penting bot ada di SATU file: **`Telegram/len.js`**. Isinya variabel global
(`globalThis.X`) yang bisa diakses dari file mana pun tanpa import.

```js
globalThis.tgToken = "8787066689:XXXX"; // ← Token bot
globalThis.tgOwner = ["-"];    // ← ID Telegram pemilik bot
globalThis.makota  = "mki.XXXX";        // ← Kunci API Makota

globalThis.tgMess = {
  wait: "Tunggu Sebentar",
  error: "⚠️ Terjadi kesalahan, coba lagi.",
  owner: "⚠️ Fitur ini khusus Owner.",
  group: "⚠️ Fitur ini hanya bisa digunakan di grup.",
  private: "⚠️ Fitur ini hanya bisa digunakan di private chat.",
};
```

| Field | Isi | Cara mendapatkannya |
|---|---|---|
| `tgToken` | Token bot (string) | Chat **@BotFather** di Telegram → `/newbot` → salin token |
| `tgOwner` | ID owner dalam **array** (bisa lebih dari satu) | Chat **@userinfobot** → catat `id` kamu |
| `makota` | Kunci/token API Makota | Akun resmi di API Makota |
| `tgMess.wait` | Pesan ditampilkan saat bot sedang memproses | Bebas diedit |
| `tgMess.error` | Pesan saat terjadi kesalahan | Bebas diedit |
| `tgMess.owner` | Pesan jika perintah khusus owner dipakai bukan owner | Bebas diedit |
| `tgMess.group` | Pesan jika perintah khusus grup dipakai di luar grup | Bebas diedit |
| `tgMess.private` | Pesan jika perintah khusus private dipakai di luar private | Bebas diedit |

> ⚠️ **Penting:**
> - `tgOwner` dan `tgMess` boleh diubah bebas; `tgToken` dan `makota` bersifat rahasia.
> - Jangan pernah commit `len.js` ke repo publik — siapa pun yang memegang token bisa mengendalikan bot-mu.
> - Sesudah mengubah `len.js` **wajib restart bot** (file ini tidak ikut hot reload).
> - ⛔ Kunci `makota` saat ini sudah **di-revoke** oleh server: semua endpoint balas `401 "Token sudah di-revoke"`. Fitur `/tiktok`, `/ai`, dan `/komik` baru berfungsi setelah kunci aktif dimasukkan di sini.

## Instalasi & Menjalankan

```bash
npm install          # memasang library (telegraf, axios, chalk, figlet)
npm start            # menjalankan bot
```

Output saat berjalan: banner `Lenwy` → log `[OK]` untuk tiap perintah ter-muat → `☘️ Telegram Bot Connected!`.

**Hot reload:** mengubah file di dalam `Telegram/case/` otomatis dimuat ulang **tanpa restart**. Tapi perubahan pada `len.js`, `handler.js`, `index.js`, atau `LenwySet.js` memerlukan restart.

## Menambah Perintah Baru

1. Buat file di `Telegram/case/<kategori>/<nama>.js` (sertakan blok credit `Made By Lenwy` di atas).
2. Export `info` (`case`, `name`, `description`, `hidden`, `owner`/`group`/`private`) dan satu `default` handler `(leni)`.
3. Simpan → hot reload berjalan → `/start` → tombol **Menu** menampilkan perintah baru otomatis.

Contoh lengkap dan penjelasan tiap langkah: lihat `langkah/03-command-pertama.md` dan `langkah/04-start-bertahap.md`.

## Menjelajahi Kode

Untuk memahami cara kerja penuh dari nol, ikuti `langkah/00-pendahuluan.md` — panduan build bertahap yang menjelaskan setiap file beserta tes-nya.

---

☘️ **Made By Lenwy** — Copy, recode, reupload, reseller? Taruh credit ya :D
Mohon untuk tidak menghapus watermark di dalam kode.