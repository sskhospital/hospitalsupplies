# Sangkhlaburi Hospital IT Maintenance System

React + Vite ระบบซ่อมบำรุงครุภัณฑ์ IT สำหรับโรงพยาบาลสังขละบุรี เชื่อมต่อ Supabase และ deploy ผ่าน GitHub Pages

## 1. Supabase

1. เปิด Supabase Project
2. ไปที่ **SQL Editor**
3. เปิดไฟล์ `supabase/schema.sql`
4. Run ทั้งไฟล์
5. ตรวจสอบว่า tables เหล่านี้ถูกสร้าง:
   - `users`
   - `tickets`
   - `assets`
   - `spare_parts`
   - `system_config`

### Local development

คัดลอก `.env.example` เป็น `.env.local` แล้วกำหนด:

```env
VITE_SUPABASE_URL=https://zduecibgqkzynjaelcwv.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_PUBLIC_KEY
```

จากนั้น:

```bash
npm install
npm run dev
```

## 2. GitHub

สร้าง repository แล้ว push โปรเจกต์นี้ขึ้น GitHub:

```bash
git init
git add .
git commit -m "feat: connect Supabase and GitHub Pages"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

## 3. GitHub Secrets

ที่ Repository > **Settings > Secrets and variables > Actions** > **New repository secret** ให้สร้าง:

- `VITE_SUPABASE_URL` = `https://zduecibgqkzynjaelcwv.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = Supabase **anon/public** key
- `GEMINI_API_KEY` = ใส่เฉพาะกรณีที่ใช้งาน Gemini

Workflow `.github/workflows/deploy.yml` จะนำ Secrets เหล่านี้ไปใช้ตอน `npm run build`

## 4. GitHub Pages

ไปที่ Repository > **Settings > Pages**

ตั้ง **Source = GitHub Actions**

เมื่อ push ไป branch `main` ระบบจะ build และ deploy อัตโนมัติ

## หมายเหตุด้านความปลอดภัย

Supabase `anon/public` key สามารถอยู่ใน frontend ได้ตามการออกแบบของ Supabase แต่ **ห้ามนำ service_role key ไปใส่ใน React/Vite หรือ GitHub Pages**

ใน schema ปัจจุบันเปิด RLS policy สำหรับ `anon` เพื่อให้ระบบเดิมทำงานได้ทันที ซึ่งเหมาะกับการทดสอบ/ติดตั้งเบื้องต้นเท่านั้น หากใช้กับข้อมูลจริงของโรงพยาบาล ควรย้ายระบบ login ไปใช้ **Supabase Auth** และกำหนด RLS ตามบทบาทผู้ใช้งานก่อนใช้งานจริง

นอกจากนี้ระบบเดิมเก็บ `password` ในตาราง `users` ซึ่งไม่ควรใช้กับ production; ควรย้าย authentication ไป Supabase Auth
