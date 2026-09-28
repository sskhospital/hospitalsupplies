# Sangkhlaburi Hospital IT Maintenance System
## ระบบซ่อมบำรุงครุภัณฑ์คอมพิวเตอร์ โรงพยาบาลสังขละบุรี (Supabase PostgreSQL)

ระบบบริหารจัดการงานซ่อมบำรุงครุภัณฑ์คอมพิวเตอร์และระบบสารสนเทศ โรงพยาบาลสังขละบุรี รองรับการแจ้งซ่อม ติดตามสถานะ อนุมัติงบประมาณ บริหารจัดการครุภัณฑ์ พร้อมเชื่อมต่อฐานข้อมูล **Supabase PostgreSQL** แบบเรียลไทม์

---

## 🚀 วิธีนำโปรเจกต์ขึ้นออนไลน์ผ่าน GitHub (GitHub Pages / Vercel / Netlify)

### ทางเลือกที่ 1: เผยแพร่อัตโนมัติผ่าน GitHub Pages (สร้างไว้ให้แล้วด้วย GitHub Actions)

โปรเจกต์นี้มีไฟล์ Workflow `.github/workflows/deploy.yml` พร้อมใช้งานเรียบร้อยแล้ว:

1. **สร้าง Repository บน GitHub**:
   - ไปที่ [github.com/new](https://github.com/new)
   - ตั้งชื่อคลังข้อมูล เช่น `sangkhlaburi-hospital-it`
   - เลือกเป็น **Public** หรือ **Private** แล้วกด **Create repository**

2. **Push โค้ดทั้งหมดขึ้น GitHub**:
   เปิด Terminal ในโฟลเดอร์โปรเจกต์แล้วรันคำสั่ง:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit with Firebase Firestore and GitHub Actions"
   git branch -M main
   git remote add origin https://github.com/<USERNAME>/<REPO_NAME>.git
   git push -u origin main
   ```

3. **เปิดใช้งาน GitHub Pages ใน Repository**:
   - ไปที่แท็บ **Settings** ของ Repository บน GitHub
   - เมนูด้านซ้ายเลือก **Pages**
   - ในหัวข้อ **Build and deployment > Source** ให้เปลี่ยนเป็น **GitHub Actions**
   - เมื่อ Push โค้ดขึ้นไปแล้ว ระบบจะ Build และ Deploy อัตโนมัติ พร้อมแสดง URL สำหรับเข้าใช้งานทันที เช่น `https://<USERNAME>.github.io/<REPO_NAME>/`

---

### ทางเลือกที่ 2: ออนไลน์ผ่าน Vercel หรือ Netlify (แนะนำสำหรับ Single Page App)

1. เชื่อมต่อบัญชี GitHub กับ [Vercel](https://vercel.com) หรือ [Netlify](https://www.netlify.com)
2. เลือก Repository `sangkhlaburi-hospital-it`
3. ตั้งค่า Build Command: `npm run build`
4. ตั้งค่า Output Directory: `dist`
5. กด **Deploy** จะได้ลิงก์โดเมนฟรีและ SSL (HTTPS) ทันที

---

## 🛠️ การพัฒนาในเครื่อง (Local Development)

```bash
# ติดตั้ง dependencies
npm install

# รันโหมด Development
npm run dev

# ทดสอบตรวจสอบโค้ด
npm run lint

# สร้างไฟล์ Production Build
npm run build
```

## ☁️ การเชื่อมต่อฐานข้อมูล Supabase PostgreSQL
ระบบเชื่อมต่อกับ **Supabase PostgreSQL Database** (`https://zduecibgqkzynjaelcwv.supabase.co`) เรียบร้อยแล้ว พร้อมระบบ Fallback อัตโนมัติ ป้องกันหน้าจอว่างเปล่า (Blank Screen) และรองรับการทำงานบน GitHub Pages อย่างสมบูรณ์แบบ
