
# OOSA SDK

![CI](https://github.com/your-org/oosa-sdk/actions/workflows/ci.yml/badge.svg)
![Coverage](https://coveralls.io/repos/github/your-org/oosa-sdk/badge.svg?branch=main)

OOSA SDK 是基於 OpenAPI 自動產生型別的 TypeScript 前端工具包，支援 Zod 型別驗證、React Query hooks、Vitest 單元測試與測試涵蓋率報告。

---

## 📦 安裝依賴

```bash
pnpm install
```

### 自動產生 SDK：
```bash
pnpm generate:sdk
# 或（如果你使用 zod 客戶端）
pnpm generate:zod
```

### 執行測試：
```bash
pnpm test
pnpm vitest run --coverage
```

---

## 🔧 需要安裝的開發套件（已內建）

```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom zod @openapitools/openapi-generator-cli eslint typescript
```

---

## 📁 專案結構

```
src/
├── hooks/                # React Query hooks
│   ├── useUser.ts        # 含 Zod 驗證
│   ├── useEvent.ts
│   ├── useIdea.ts
├── apis/                 # API 抽象層（可選）
├── schemas/              # Zod 驗證結構
├── generated/            # OpenAPI Generator 輸出 (typescript-axios)
├── generated-zod/        # Zod schema + endpoint（可選）
```

---

## 🧪 Coverage

```bash
pnpm vitest run --coverage
# 然後開啟 coverage/index.html 查看報表
```

---

## 🧬 Zod 驗證

在 hook 中自動驗證資料結構：

```ts
const res = await api.getUserById({ id });
const parsed = UserSchema.safeParse(res);
if (!parsed.success) throw new Error("Invalid shape");
```

---

## 🛠 建議用法

- GitHub Actions 執行 lint/test/coverage
- 結合 Coveralls.io 顯示 badge
- 用 `openapi-zod-client` or `openapi-generator-cli` 自動產生 SDK

---
