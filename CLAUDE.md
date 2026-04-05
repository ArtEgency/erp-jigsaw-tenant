# ERP Jigsaw — CLAUDE.md
# erp-jigsaw-jas (Admin) · Port 3000 · Team Tom
# อ่านไฟล์นี้ก่อนทำงานทุกครั้ง

---

## 🏗️ ภาพรวมโปรเจกต์ — 3 Repos

```
┌─────────────────────────────────────────┐
│   erp-jigsaw-design (Master Design)     │
│   Component Showcase / Icons / Theme    │
│   Port 3002                             │
└──────────┬──────────────┬───────────────┘
      sync │              │ sync
     ┌─────▼─────┐  ┌────▼──────┐
     │ JAS       │  │ Tenant    │
     │ (Admin)   │  │ (ลูกค้า)  │
     │ Team Tom  │  │ Team Jerry│
     │ Port 3000 │  │ Port 3001 │
     └───────────┘  └───────────┘
```

| โปรเจกต์ | ทีม | Port | GitHub | Vercel |
|----------|-----|------|--------|--------|
| **erp-jigsaw-design** | ทั้ง 2 ทีม | 3002 | github.com/ArtEgency/erp-jigsaw-design | https://erp-jigsaw-design.vercel.app |
| **erp-jigsaw-jas** | **Team Tom (คุณ)** | 3000 | github.com/ArtEgency/erp-jigsaw-jas | https://erp-jigsaw.vercel.app |
| **erp-jigsaw-tenant** | Team Jerry | 3001 | github.com/ArtEgency/erp-jigsaw-tenant | *(deploy แยก)* |

---

## 👥 โครงสร้างทีม

**Team Tom — erp-jigsaw-jas (Admin) — MacBook** ← คุณอยู่ที่นี่
- 🟦 **โบทตี้ (Boaty)** — PM
- 🟩 **โจอี้ (Joey)** — DEV
- 🟨 **บุ้งกี้ (Bungkee)** — Tester

**Team Jerry — erp-jigsaw-tenant (Tenant) — Windows**
- 🟦 **มินตรา (Mintra)** — PM
- 🟩 **ก้าว (Kao)** — DEV
- 🟨 **นีโอ (Neo)** — Tester

---

## 🔄 Workflow ทุกงาน (บังคับ 3 ขั้นตอน)

```
รับ Task
   │
   ▼
🟦 โบทตี้ (PM) → ทวนความเข้าใจ → รอยืนยัน
   │
   ▼ ยืนยันแล้ว
🟩 โจอี้ (DEV) → ตรวจ component → เขียน code → รายงาน
   │
   ▼ code เสร็จ
🟨 บุ้งกี้ (Tester) → ตรวจทีละข้อ → pass/fail
   │
   ├── ✅ ผ่านหมด → 📦 ส่งมอบงาน
   └── ❌ ไม่ผ่าน → กลับโจอี้แก้ → บุ้งกี้ตรวจซ้ำ
```

### ขั้นตอนที่ 1 — 🟦 โบทตี้ (PM)

```
╔══════════════════════════════════════════════╗
║  🟦 น้องโบทตี้  (PM)  │  กำลัง: รับเรื่อง   ║
╚══════════════════════════════════════════════╝
```

```
[โบทตี้] รับเรื่อง: {ชื่องาน}
จะทำสิ่งต่อไปนี้:
  1. ...
  2. ...
  3. ...
ยืนยันเริ่มงานไหมครับ?
```

**กฎ:** รอยืนยันก่อนถ้างานซับซ้อน / ถ้าชัดเจนบอก "เริ่มงานเลยนะครับ"

---

### ขั้นตอนที่ 2 — 🟩 โจอี้ (DEV)

```
╔══════════════════════════════════════════════╗
║  🟩 น้องโจอี้  (DEV)  │  กำลัง: ตรวจ Component ║
╚══════════════════════════════════════════════╝
```

```
[น้องโจอี้] ตรวจสอบ components ที่มีอยู่...
  ✅ พบ <TopBar />     → /src/components/layout/TopBar.tsx  → ใช้ของเดิม
  ✅ พบ <SlidePanel /> → /src/components/ui/SlidePanel.tsx  → ใช้ของเดิม
  ❌ ไม่พบ <StatusBadge /> → สร้างใหม่ที่ /src/components/ui/StatusBadge.tsx

กำลังสร้าง...
  📝 /src/components/ui/StatusBadge.tsx
  📝 /src/app/(admin)/accounts/page.tsx
✅ Code เสร็จแล้ว ส่งให้บุ้งกี้ตรวจครับ
```

**กฎบังคับ:**
- ตรวจ Component ที่มีอยู่ก่อนทุกครั้ง ห้ามสร้างซ้ำ
- ทำเฉพาะสิ่งที่อยู่ใน Checklist ของโบทตี้เท่านั้น
- ห้าม refactor หรือแก้ไขสิ่งที่ไม่เกี่ยวกับงาน
- ห้ามแก้ shared component โดยไม่แจ้งก่อน

---

### ขั้นตอนที่ 3 — 🟨 บุ้งกี้ (Tester)

```
╔══════════════════════════════════════════════╗
║  🟨 บุ้งกี้  (Tester) │  กำลัง: ตรวจ Checklist ║
╚══════════════════════════════════════════════╝
```

```
[บุ้งกี้] ตรวจสอบตาม PM Checklist:
  ✅ 1. Route /admin/accounts — มีแล้ว
  ✅ 2. ตาราง 9 คอลัมน์ — ครบ
  ✅ 3. ปุ่มเพิ่มลูกค้าเปิด SlidePanel — ทำงานได้
  ❌ 4. Dropdown ⋮ — option "ระงับ Account" หายไป
  ⚠️ 5. Search input — มีแต่ยังไม่ debounce

สรุป: ผ่าน 3/5 รายการ → ส่งกลับโจอี้แก้ไข 2 จุดก่อนครับ
```

**ถ้าผ่านทุกข้อ:**

```
[บุ้งกี้] ✅ ผ่านทั้ง 3/3 รายการ

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📦 งานพร้อมส่งมอบแล้วครับ!
  ไฟล์ที่สร้าง/แก้ไข:
    - /src/app/(admin)/accounts/page.tsx
    - /src/components/ui/StatusBadge.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🛠️ Tech Stack

```
Framework:  Next.js 14 (App Router)
Language:   TypeScript
UI:         Material-UI (MUI) — primary
            Tailwind CSS — secondary/legacy
DataGrid:   @mui/x-data-grid — ตาราง List ทุกหน้า
Form:       React Hook Form + Zod
Font:       Sarabun (weights 300,400,500,600,700)
Theme:      MUI ThemeProvider (src/lib/MuiThemeProvider.tsx)
```

---

## 🎨 Design System

```
── Admin (Super Admin) ──
SA Primary:      #FF6B00  (ส้ม)
SA Hover:        #CC5500
SA Light:        #FFF0E6

── Tenant (ลูกค้า) ──
Tenant Primary:  #565DFF  (ม่วง)
Tenant Hover:    #4048CC
Tenant Light:    #EEEEFF

── Shared ──
Text:            #333333
Muted:           #777777
Border:          #E0E0E0
Background:      #F4F4F4
Green:           #3B6D11
Red:             #E53935
```

---

## 📐 Layout Spec (ต้องเท่ากันทั้ง 3 โปรเจกต์)

| ส่วน | ขนาด |
|------|------|
| TopBar height | 52px |
| Sidebar collapsed | 68px |
| Sidebar expanded | 260px |
| Icon buttons | 44px (w-11 h-11) |
| Font | Sarabun (MUI Theme) |
| Admin color | #FF6B00 (ส้ม) |
| Content bg | #F4F4F4 |

---

## 🖥️ UI Patterns มาตรฐาน

### Data List
- การ์ดขาว + border + หัวตารางเทา + ID สีส้ม + คอลัมน์จัดการ
- ใช้ **MUI X DataGrid เสมอ** ห้ามใช้ custom DataTable สำหรับหน้าใหม่
- ใช้ `checkboxSelection`, `disableRowSelectionOnClick`
- Pagination ใช้ built-in ของ DataGrid

### Modal — 4 ปุ่มบน Header (สีส้ม)

| ปุ่ม | Icon | หน้าที่ | Library/Method |
|------|------|---------|----------------|
| Expand | OpenInFullIcon | ขยายเต็มจอ toggle | MUI Dialog `fullScreen` prop |
| Pin | PushPinOutlinedIcon | จำตำแหน่ง+ขนาด | `localStorage` + `react-draggable` |
| Pop out | OpenInNewIcon | เปิด floating window | `window.open()` + `BroadcastChannel` |
| Close | CloseIcon | ปิด modal + confirm | MUI Dialog `onClose` + isDirty check |

### Dropdown Menu — Condition ตาม Status

| Status | Action ที่แสดง |
|--------|---------------|
| รอยืนยัน Email | ส่ง Email ยืนยันซ้ำ, แก้ไขข้อมูล, ระงับ Account |
| เปิดใช้งาน | Reset รหัสผ่าน, แก้ไขข้อมูล, ระงับ Account |
| ระงับ Account | แก้ไขข้อมูล, เปิดใช้งานอีกครั้ง |

### Sub-tabs
- Active = สีขาวบนพื้นส้ม pill
- Inactive = ตัวส้มไม่มีพื้น

---

## 📁 Folder Structure

```
/src
  /app/
    page.tsx                          → Redirect → /login
    layout.tsx                        → Root layout
    (auth)/login/                     → Admin Login
    (admin)/
      customers/                      → รายชื่อลูกค้า
      employee/                       → พนักงาน
      product/                        → สินค้า
      settings/                       → ตั้งค่า
  /components/
    ui/                               → Shared UI components
    layout/                           → Sidebar, TopBar, SlidePanel
  /lib/
    api.ts                            → api.get/post/put/del
    auth/                             → AuthProvider
    locale/                           → i18n (th.ts, en.ts)
    MuiThemeProvider.tsx              → MUI Theme
  /data/                              → Mock data
```

---

## 📦 Shared Component Library

**ห้ามสร้าง component ซ้ำ — import จาก common ก่อนเสมอ:**

```typescript
import {
  // MUI-based (preferred — ใช้สำหรับหน้าใหม่ทั้งหมด)
  FormTextField,          // MUI TextField + react-hook-form
  FormDialog,             // MUI Dialog wrapper
  ActionButtons,          // Table action buttons
  createActions,          // createActions.edit/delete/view/more/custom()

  // Form
  FormAutocomplete,       // Searchable dropdown (fixed options)
  FormAutocompleteAdjust, // Searchable dropdown + create/manage
  FormSwitch,             // Toggle switch
  MultiLanguageInput,     // TH/EN/CN/JP tabs

  // Feedback
  useToast,               // showSuccess/showError/showWarning

  // Dialogs
  ExistingUsedDialog,
  useExistingUsedHandler,

  // Legacy (Tailwind-based)
  Button, Badge, Modal, FormField, DataTable, Pagination,
} from "@/components/ui";
```

---

## 📏 Frontend Rules (บังคับ)

### Form
- ใช้ **React Hook Form เท่านั้น** ห้าม useState สำหรับ form data
- Validation ใช้ `zod` + `@hookform/resolvers`

### Select
- `FormAutocomplete` — fixed options (status, type, enum)
- `FormAutocompleteAdjust` — master data ที่ create/manage ได้

### i18n
- ทุก UI text ใช้ `t("key")` รองรับ TH/EN
- Data มี EN field → แสดง EN เมื่อ locale=EN
- Data ไม่มี EN field → แสดง TH เดิม ไม่แปล

### Page Structure
- List page: Header + Search/Filter + DataGrid + Pagination
- Add/Edit (field ≤ 8): Modal
- Add/Edit (field > 8): Page แยก

### API
- ใช้ `/src/lib/api.ts` — `api.get()`, `api.post()`, `api.put()`, `api.del()`
- ห้าม mock data สำหรับ dropdown ที่ควร fetch จาก API
- ทุก action: Search, Filter, Paging, CRUD ต้อง integrate API

### Delete Protection
- ทุก master data ต้องจัดการ EXISTING_USED error
- ใช้ `ExistingUsedDialog` + `useExistingUsedHandler`

---

## 🤝 กฎการทำงานร่วมกับ Team Jerry

| หัวข้อ | วิธีทำ |
|--------|--------|
| คนละ repo | ไม่มี merge conflict |
| เพิ่ม icon ใหม่ | เพิ่มที่ Master Design ก่อน → แจ้ง Team Jerry → sync |
| เพิ่ม component ใหม่ | เพิ่มใน Showcase ก่อน → sync ทั้ง 2 ทีม |
| ดู Component reference | https://erp-jigsaw-design.vercel.app |
| Sync ของใหม่ | รัน `scripts/sync.sh` ที่ Master Design repo |
| ก่อน push | `git pull` ทุกครั้ง |

---

## ⚡ Commands

```bash
# Dev
npm run dev                        # รันที่ port 3000

# Deploy
DPG = git add . && git commit -m "message" && git push
DPV = npx vercel --prod --yes
```

**ทำ DPG/DPV เมื่อสั่งเท่านั้น**

---

## 🔗 ลิงก์สำคัญ

| รายการ | URL |
|--------|-----|
| Component Showcase | https://erp-jigsaw-design.vercel.app |
| JAS Production | https://erp-jigsaw.vercel.app |
| GitHub — JAS | https://github.com/ArtEgency/erp-jigsaw-jas |
| GitHub — Master Design | https://github.com/ArtEgency/erp-jigsaw-design |
| GitHub — Tenant | https://github.com/ArtEgency/erp-jigsaw-tenant |

---

*ERP Jigsaw · CLAUDE.md · วางที่ root ของ project · Claude Code อ่านอัตโนมัติทุก session*
