# Docker 開發環境指南

本專案使用 Docker Compose 提供本地開發資料庫環境，支援 PostgreSQL 和 SQL Server。

## 📋 目錄

- [快速開始](#快速開始)
- [服務說明](#服務說明)
- [常用指令](#常用指令)
- [資料庫管理](#資料庫管理)
- [連線資訊](#連線資訊)
- [故障排除](#故障排除)

## 🚀 快速開始

### 前置需求

1. **安裝 Docker Desktop**
   - [下載 Docker Desktop](https://www.docker.com/products/docker-desktop)
   - macOS: `brew install --cask docker`
   - Windows: 下載安裝程式執行
   - Linux: 參考[官方文件](https://docs.docker.com/engine/install/)

2. **確認 Docker 安裝成功**
   ```bash
   docker --version
   docker-compose --version
   ```

### 一鍵啟動

```bash
# 複製環境變數範本
cp .env.example .env.local

# 啟動並設定所有資料庫服務
npm run db:setup
```

這會自動完成:
1. ✓ 啟動 PostgreSQL 和 SQL Server 容器
2. ✓ 執行資料庫初始化腳本
3. ✓ 測試資料庫連線
4. ✓ 生成 Prisma Client
5. ✓ 推送資料模型到資料庫

完成後就可以開始開發了:

```bash
npm run dev
```

## 📦 服務說明

### PostgreSQL (推薦用於開發)

- **Image**: `postgres:16-alpine`
- **Port**: `5432`
- **Container Name**: `breakfast-postgres`
- **預設帳號**: `postgres` / `postgres`
- **資料庫**: `breakfast_delivery`
- **資料持久化**: 使用 Docker Volume `postgres_data`

### SQL Server

- **Image**: `mcr.microsoft.com/mssql/server:2022-latest`
- **Port**: `1433`
- **Container Name**: `breakfast-sqlserver`
- **預設帳號**: `sa` / `YourStrong@Password123`
- **資料庫**: `breakfast_delivery`
- **資料持久化**: 使用 Docker Volume `sqlserver_data`
- **版本**: Developer Edition (免費)

### pgAdmin (選用)

PostgreSQL 的網頁管理介面，使用 `--profile tools` 啟動。

- **Port**: `5050`
- **預設帳號**: `admin@breakfast.local` / `admin`

```bash
docker-compose --profile tools up -d
```

## 🛠 常用指令

### 基本操作

```bash
# 啟動所有資料庫服務 (背景執行)
npm run db:start

# 停止所有服務
npm run db:stop

# 重啟所有服務
npm run db:restart

# 查看容器狀態
npm run db:ps

# 查看即時日誌 (所有服務)
npm run db:logs

# 查看 PostgreSQL 日誌
npm run db:logs:postgres

# 查看 SQL Server 日誌
npm run db:logs:sqlserver
```

### 清理與重置

```bash
# 停止並刪除容器 (保留資料卷)
docker-compose down

# 完全清除 (刪除容器和所有資料)
npm run db:clean

# 清除未使用的 Docker 資源
docker system prune -a
```

### 資料庫測試

```bash
# 測試當前資料庫連線
npm run db:test

# 測試 PostgreSQL
npm run db:test:postgres

# 測試 SQL Server
npm run db:test:sqlserver

# 測試所有資料庫
npm run db:test:all
```

### 切換資料庫

```bash
# 互動式選擇
npm run db:switch

# 快速切換到 PostgreSQL
npm run db:switch:postgres

# 快速切換到 SQL Server
npm run db:switch:sqlserver
```

## 💾 資料庫管理

### Prisma Studio

視覺化管理資料庫內容:

```bash
npm run prisma:studio
```

開啟 http://localhost:5555 即可使用。

### pgAdmin (PostgreSQL 專用)

```bash
# 啟動 pgAdmin
docker-compose --profile tools up -d

# 開啟 http://localhost:5050
# 登入: admin@breakfast.local / admin

# 新增伺服器連線:
# - Host: postgres (容器名稱)
# - Port: 5432
# - Username: postgres
# - Password: postgres
```

### 直接連線資料庫

#### PostgreSQL

```bash
# 使用 psql
docker exec -it breakfast-postgres psql -U postgres -d breakfast_delivery

# 常用指令:
\dt          # 列出所有資料表
\d tablename # 查看資料表結構
\q           # 退出
```

#### SQL Server

```bash
# 使用 sqlcmd
docker exec -it breakfast-sqlserver /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P 'YourStrong@Password123'

# 切換資料庫
USE breakfast_delivery;
GO

# 列出所有資料表
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE';
GO

# 退出
EXIT
```

## 🔌 連線資訊

### PostgreSQL 連線字串

```env
# 從本機連線
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/breakfast_delivery?schema=public"

# 從 Docker 容器內連線
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/breakfast_delivery?schema=public"
```

### SQL Server 連線字串

```env
# 從本機連線
DATABASE_URL="sqlserver://localhost:1433;database=breakfast_delivery;user=sa;password=YourStrong@Password123;encrypt=true;trustServerCertificate=true"

# 從 Docker 容器內連線
DATABASE_URL="sqlserver://sqlserver:1433;database=breakfast_delivery;user=sa;password=YourStrong@Password123;encrypt=true;trustServerCertificate=true"
```

### 使用其他資料庫工具連線

| 工具 | PostgreSQL | SQL Server |
|------|-----------|-----------|
| DBeaver | ✅ | ✅ |
| DataGrip | ✅ | ✅ |
| Azure Data Studio | ❌ | ✅ |
| pgAdmin | ✅ | ❌ |
| TablePlus | ✅ | ✅ |

連線參數:
- **Host**: `localhost`
- **Port**: PostgreSQL `5432` / SQL Server `1433`
- **Username**: PostgreSQL `postgres` / SQL Server `sa`
- **Password**: PostgreSQL `postgres` / SQL Server `YourStrong@Password123`

## 🐛 故障排除

### 容器啟動失敗

```bash
# 查看詳細錯誤訊息
docker-compose logs

# 檢查 port 是否被佔用
lsof -i :5432  # PostgreSQL
lsof -i :1433  # SQL Server

# 強制重建容器
docker-compose down
docker-compose up -d --force-recreate
```

### 資料庫連線失敗

1. **確認容器正在運行**
   ```bash
   npm run db:ps
   ```

2. **檢查健康狀態**
   ```bash
   docker-compose ps
   ```
   Status 應該顯示 `healthy`

3. **查看容器日誌**
   ```bash
   npm run db:logs:postgres
   npm run db:logs:sqlserver
   ```

4. **測試連線**
   ```bash
   npm run db:test:all
   ```

### SQL Server 密碼不符合要求

SQL Server 密碼必須符合:
- 至少 8 個字元
- 包含大寫字母
- 包含小寫字母
- 包含數字
- 包含特殊字元

預設密碼 `YourStrong@Password123` 已符合要求。

### Port 被佔用

```bash
# macOS/Linux
sudo lsof -i :5432
sudo kill -9 <PID>

# Windows
netstat -ano | findstr :5432
taskkill /PID <PID> /F

# 或修改 docker-compose.yml 使用不同 port:
ports:
  - "15432:5432"  # 使用 15432 代替 5432
```

### 磁碟空間不足

```bash
# 查看 Docker 使用空間
docker system df

# 清理未使用的資源
docker system prune -a --volumes

# 僅清理特定資源
docker volume prune  # 清理未使用的資料卷
docker image prune   # 清理未使用的映像檔
```

### 資料損壞或需要重置

```bash
# 完全清除並重新開始
npm run db:clean
npm run db:setup
```

### M1/M2 Mac 相容性問題

SQL Server 官方映像檔支援 ARM64 架構，但如果遇到問題:

```bash
# 使用 Rosetta 2 模擬 x86
docker-compose down
export DOCKER_DEFAULT_PLATFORM=linux/amd64
docker-compose up -d
```

或在 `docker-compose.yml` 中指定 platform:

```yaml
sqlserver:
  platform: linux/amd64
  image: mcr.microsoft.com/mssql/server:2022-latest
```

## 📚 進階配置

### 自訂資料庫初始化

編輯初始化腳本:
- PostgreSQL: `scripts/db/init-postgres.sql`
- SQL Server: `scripts/db/init-sqlserver.sql`

重新啟動容器以套用變更:

```bash
npm run db:clean
npm run db:start
```

### 效能調整

編輯 `docker-compose.yml` 調整資源限制:

```yaml
services:
  postgres:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
```

### 資料備份與還原

#### PostgreSQL

```bash
# 備份
docker exec breakfast-postgres pg_dump -U postgres breakfast_delivery > backup.sql

# 還原
docker exec -i breakfast-postgres psql -U postgres breakfast_delivery < backup.sql
```

#### SQL Server

```bash
# 備份
docker exec breakfast-sqlserver /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P 'YourStrong@Password123' \
  -Q "BACKUP DATABASE breakfast_delivery TO DISK='/var/opt/mssql/backup.bak'"

# 還原
docker exec breakfast-sqlserver /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P 'YourStrong@Password123' \
  -Q "RESTORE DATABASE breakfast_delivery FROM DISK='/var/opt/mssql/backup.bak'"
```

## 🔒 安全注意事項

⚠️ **僅供開發環境使用**

本 Docker 設定使用預設密碼和簡化的安全設定，**不適合用於正式環境**。

正式環境建議:
- 使用強密碼並存放在安全的密碼管理工具
- 啟用 SSL/TLS 加密連線
- 設定防火牆規則限制存取
- 定期備份資料
- 使用託管資料庫服務 (Vercel Postgres, Azure SQL, AWS RDS)

## 📖 相關資源

- [Docker Compose 官方文件](https://docs.docker.com/compose/)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
- [SQL Server Docker Hub](https://hub.docker.com/_/microsoft-mssql-server)
- [Prisma 多資料庫支援](https://www.prisma.io/docs/concepts/database-connectors)
- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - 資料庫設定完整指南

---

**快樂開發！** 🐳 如有問題請參考故障排除章節或開啟 Issue。
