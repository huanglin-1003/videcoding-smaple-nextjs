# 資料庫設定指南

本專案已設定 Prisma ORM,支援 PostgreSQL (Vercel) 和 SQL Server。

## 📦 已安裝套件

- `prisma` - Prisma CLI 工具
- `@prisma/client` - Prisma Client (自動生成型別)
- `pg` - PostgreSQL 驅動
- `tedious` - SQL Server 驅動
- `dotenv` - 環境變數載入

## 🗂 檔案結構

```
├── prisma/
│   └── schema.prisma          # 資料模型定義
├── lib/
│   └── db/
│       └── prisma.ts          # Prisma Client 單例
├── .env.local                 # 本地環境變數 (gitignored)
├── .env.example               # 環境變數範本
├── .env.production            # 正式環境範本
└── prisma.config.ts           # Prisma 設定檔
```

## 🚀 快速開始

### 1. 設定環境變數

複製 `.env.example` 到 `.env.local`:

```bash
cp .env.example .env.local
```

### 2. 選擇資料庫並設定連線

#### 選項 A: PostgreSQL (Vercel) - 推薦

1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 建立新的 Postgres 資料庫
3. 複製連線字串到 `.env.local`:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"
```

#### 選項 B: SQL Server

1. 確保 SQL Server 已安裝並執行
2. 更新 `prisma/schema.prisma` 的 `provider`:

```prisma
datasource db {
  provider = "sqlserver" // 改為 sqlserver
  url      = env("DATABASE_URL")
}
```

3. 設定連線字串在 `.env.local`:

```env
DATABASE_URL="sqlserver://localhost:1433;database=breakfast_delivery;user=sa;password=YourPassword123;encrypt=true;trustServerCertificate=true"
```

### 3. 推送資料模型到資料庫

使用 `db push` (開發環境快速同步,不建立 migration):

```bash
npm run prisma:push
```

或使用 `migrate` (建立版本控制的 migration):

```bash
npm run prisma:migrate
```

### 4. (選用) 開啟 Prisma Studio 管理資料

```bash
npm run prisma:studio
```

會在瀏覽器開啟 `http://localhost:5555`,可視覺化管理資料。

## 📊 資料模型

根據 `specs/001-breakfast-delivery-app/data-model.md` 建立的模型:

### 主要實體

1. **User** - 使用者
   - 支援訂單歷史和認證

2. **Product** - 商品
   - 包含中英文名稱、價格、圖片、分類
   - Enum: `ProductCategory` (DRINK, MAIN, SIDE)

3. **Order** - 訂單
   - 訂單號、狀態、付款方式、預估時間
   - Enum: `OrderStatus` (PENDING, CONFIRMED, PREPARING, READY, DELIVERED, CANCELLED)

4. **OrderItem** - 訂單項目
   - 儲存商品名稱和價格快照(防止商品變更影響歷史訂單)

5. **PaymentMethod** - 付款方式
   - 支援信用卡、Mastercard、Visa、Apple Pay
   - Enum: `PaymentMethodType`

6. **PaymentIntent** - 付款意圖
   - 追蹤付款處理狀態
   - Enum: `PaymentStatus`

### 關聯設計

```
User (1) ←→ (N) Order
User (1) ←→ (N) PaymentMethod
Order (1) ←→ (N) OrderItem
Product (1) ←→ (N) OrderItem
```

## 💻 使用 Prisma Client

### 基本查詢範例

```typescript
import { prisma } from '@/lib/db/prisma'

// 取得所有商品
const products = await prisma.product.findMany({
  where: { isAvailable: true },
  orderBy: { category: 'asc' }
})

// 建立訂單
const order = await prisma.order.create({
  data: {
    orderNumber: '#123456',
    subtotal: 10.50,
    total: 10.50,
    status: 'PENDING',
    paymentMethod: 'CREDIT_CARD',
    items: {
      create: [
        {
          productId: 'soy-milk',
          productName: 'Soy Milk',
          quantity: 2,
          price: 2.00,
          subtotal: 4.00
        }
      ]
    }
  },
  include: { items: true }
})

// 取得使用者訂單歷史
const userOrders = await prisma.order.findMany({
  where: { userId: 'user-id' },
  include: { items: true },
  orderBy: { createdAt: 'desc' }
})
```

## 🛠 可用指令

| 指令 | 說明 |
|------|------|
| `npm run prisma:generate` | 重新生成 Prisma Client |
| `npm run prisma:studio` | 開啟 Prisma Studio 視覺化工具 |
| `npm run prisma:push` | 推送 schema 到資料庫 (不建立 migration) |
| `npm run prisma:migrate` | 建立並執行 migration |
| `npm run prisma:migrate:deploy` | 部署 migration 到正式環境 |
| `npm run prisma:format` | 格式化 schema.prisma |

## 🔄 切換資料庫

專案支援彈性切換 PostgreSQL 和 SQL Server:

1. 更新 `prisma/schema.prisma` 的 `provider`
2. 更新 `.env.local` 的 `DATABASE_URL`
3. 執行 `npm run prisma:generate`
4. 執行 `npm run prisma:push` 或 `npm run prisma:migrate`

## ⚠️ 注意事項

1. **不要提交 `.env.local`** - 已加入 .gitignore
2. **提交 `.env.example`** - 供團隊成員參考
3. **Migration 檔案** - `prisma/migrations/` 已 gitignored,若使用 migrate 請考慮是否提交
4. **正式環境** - 在 Vercel 等平台設定 `DATABASE_URL` 環境變數,不需要 .env 檔案

## 📚 相關資源

- [Prisma 官方文件](https://www.prisma.io/docs)
- [Next.js + Prisma 最佳實踐](https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices)
- [Vercel Postgres 文件](https://vercel.com/docs/storage/vercel-postgres)
- [本專案資料模型設計](./specs/001-breakfast-delivery-app/data-model.md)

## 🐛 常見問題

### Q: Prisma Client 找不到?
```bash
npm run prisma:generate
```

### Q: 資料庫連線失敗?
檢查 `.env.local` 的 `DATABASE_URL` 是否正確,並確認資料庫已啟動。

### Q: 修改 schema 後怎麼同步?
```bash
npm run prisma:push  # 或
npm run prisma:migrate
```

### Q: 如何重置資料庫?
```bash
npx prisma migrate reset
```

---

**設定完成!** 🎉 現在可以開始使用 Prisma 操作資料庫了。
