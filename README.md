# Cuckoo — Sprint 2 prototype

Clickable SENG 321 prototype for permitted exterior vehicle photos and visible observations. React, TypeScript, TanStack navigation, Vite and Tailwind. No business HTTP calls, accounts, upload service, storage or payment service. All changes are in memory and disappear on reload. The demo role switcher preserves progress within the current session; Reset demo restores fixtures.

The interface and fixtures are Turkish-first. The original Lovable project uses TanStack Start and Bun. The [canonical Cuckoo frontend](https://github.com/ozgurfuruncu/SENG-CuckooApp/tree/develop/frontend) uses a separate Vite SPA and npm build.

## Demo walkthrough

1. **İşveren demosunu dene** düğmesiyle Deniz hesabına geçin. **Görev oluştur** ekranında zorunlu alanları doldurun, izin beyanını işaretleyin ve **Görevi yayınla** düğmesine basın.
2. **Demo hesabı seç** listesinden Sarah’ya geçin. İsteğe bağlı notla **Göreve başvur** düğmesine basın. **Yeniden başvur** aynı başvurunun kabul edilmediğini gösterir.
3. Deniz’e dönüp **Sarah Ahmed ata** düğmesine basın. Sarah’ya geçip bekletme kaydedilmeden önce **Kanıt gönder** adımını deneyin.
4. Deniz’e dönüp **Bekletmeyi kaydet** düğmesine basın. Sarah’ya geçin, 1–5 kurgusal fotoğraf seçin, 10–2.000 karakterlik gözlem notu yazın ve **Kanıt gönder** düğmesine basın.
5. Mert’e veya diğer işverene geçerek kanıtların görüntülenemediğini doğrulayın. Deniz’e dönün, **Kanıtları incele** bağlantısını açın ve isteğe bağlı bir inceleme notuyla **Düzeltme iste** düğmesine basın.
6. Sarah’ya geçip **Kanıtı düzelt** adımını tamamlayın. Deniz’e dönün ve **Onayla ve tamamla** düğmesine basın. **Görev tamamlandı** ekranında simüle ödemenin serbest bırakıldığını ve görev geçmişini görün.
7. İptal için Deniz olarak Çankaya’daki örnek görevi açın. **Görevi iptal et**, ardından **İptali onayla** düğmesine basın. Simüle bekletmenin kaldırıldığını görün. **Yeniden iptal et** değişiklik yapılmadan bir hata bildirimi gösterir.

No real money is moved. Sign-up and sign-in are fictional simulations; sign-in recognizes a demo email and any nonempty fictional password. Do not use real credentials.

## Figma capture

Each screen has a `data-screen` name. Evidence Review has desktop photo-gallery/review columns and a stacked mobile view. Use the same task with both roles rather than reloading, because data is deliberately not persisted. Both widths have been checked in the preview; Figma import itself has not been performed.

## Awaiting team review

- Final revision preconditions and review note policy
- Evidence download
- File limits beyond photo count
- Evidence retention
- Broader evidence visibility rules

These decisions remain visible in the demo bar; none adds functionality beyond the supplied draft demo rules. Ratings, suggestions, chat, ID/phone collection and real payments are not built.

## Local development and tests

```sh
bun install
bun run dev
bun run test
```

Open the local URL printed by `bun run dev` to use the interactive demo. The standalone `bun run build` produces the Lovable/Nitro Cloudflare output at `.output/server/index.mjs`. The local `bun run preview` command currently looks for `dist/server/server.js`, so use the development server for local browsing.

Twenty workflow tests cover permission, roles, city requirement, applications, assignment, hold, photo/note limits, evidence visibility, revision, approval/release, cancellation and terminal conflicts. Nine route checks cover the welcome, sign in, sign up, discovery, task creation, evidence and completion paths.

## Frontend synchronization

Start a topic branch from the latest Lovable `main`. Mirror the canonical frontend's files under `src/components/cuckoo`, `src/mock` and `src/assets`, plus `src/styles.css` and `src/lib/utils.ts`. Keep the files specific to this checkout, including `page-meta.ts`, file-based route wrappers, TanStack Start entry points, Vite configuration, and the Bun lockfile. Verify with `bun install --frozen-lockfile`, `bun run test`, and `bun run build` before publishing through the connected repository.
