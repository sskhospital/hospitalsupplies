import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  PhoneCall, 
  UserCheck, 
  Wrench, 
  Sparkles, 
  Building2,
  KeyRound,
  Laptop
} from 'lucide-react';
import { HospitalLogo } from './HospitalLogo';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const LoginView: React.FC = () => {
  const { login, loginAsRole, users, hospitalInfo } = useApp();

  const [identifier, setIdentifier] = useState('chanon.s@skh.moph.go.th');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const result = await login(identifier, password);
    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง โปรดตรวจสอบอีกครั้ง');
    }
  };

  const handleQuickRoleLogin = (role: UserRole) => {
    setIsLoading(true);
    setTimeout(() => {
      loginAsRole(role);
      setIsLoading(false);
    }, 300);
  };

  const roleConfigs: Record<UserRole, { title: string; color: string; bg: string; border: string; desc: string; icon: React.ReactNode }> = {
    requester: {
      title: 'เจ้าหน้าที่แผนก / พยาบาล',
      color: 'text-emerald-700',
      bg: 'bg-emerald-50 hover:bg-emerald-100/70',
      border: 'border-emerald-200',
      desc: 'เปิดแจ้งซ่อม ติดตามสถานะงาน ประเมินความพึงพอใจ',
      icon: <Laptop className="w-4 h-4 text-emerald-600" />,
    },
    technician: {
      title: 'ช่างเทคนิคคอมพิวเตอร์',
      color: 'text-blue-700',
      bg: 'bg-blue-50 hover:bg-blue-100/70',
      border: 'border-blue-200',
      desc: 'รับงานซ่อม วินิจฉัย เบิกอะไหล่ อัปเดตสถานะงาน',
      icon: <Wrench className="w-4 h-4 text-blue-600" />,
    },
    supervisor: {
      title: 'หัวหน้างาน IT / ผู้ดูแลระบบ',
      color: 'text-purple-700',
      bg: 'bg-purple-50 hover:bg-purple-100/70',
      border: 'border-purple-200',
      desc: 'อนุมัติงบ/อะไหล่ จัดการทะเบียนครุภัณฑ์ สำรองข้อมูล',
      icon: <ShieldCheck className="w-4 h-4 text-purple-600" />,
    },
    executive: {
      title: 'ผู้อำนวยการ / ผู้บริหาร',
      color: 'text-amber-800',
      bg: 'bg-amber-50 hover:bg-amber-100/70',
      border: 'border-amber-200',
      desc: 'แดชบอร์ดงบประมาณ KPI การซ่อมบำรุง วางแผนปี 2570',
      icon: <Sparkles className="w-4 h-4 text-amber-600" />,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-['Prompt',sans-serif] text-slate-800">
      
      {/* Top hospital badge */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between text-white/80 py-2">
        <div className="flex items-center gap-2.5">
          <HospitalLogo className="w-9 h-9" />
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-white tracking-wide">{hospitalInfo.nameTh}</p>
            <p className="text-[10px] text-teal-300 font-sans">{hospitalInfo.nameEn}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 text-teal-100">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>ระบบสารสนเทศความปลอดภัยสูง SSL 256-bit</span>
        </div>
      </div>

      {/* Main Login Card Container */}
      <div className="max-w-5xl w-full mx-auto my-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Hospital & System Introduction */}
        <div className="lg:col-span-5 bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-800 rounded-3xl p-6 sm:p-8 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden border border-teal-500/30">
          
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-teal-50 text-[11px] font-medium border border-white/25">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              IT Maintenance & Asset Management
            </div>

            <div className="flex items-center gap-4 pt-2">
              <HospitalLogo className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-md bg-white p-1 rounded-full shrink-0" />
              <div>
                <h1 className="text-lg sm:text-xl font-bold leading-tight">
                  ระบบซ่อมบำรุงครุภัณฑ์คอมพิวเตอร์
                </h1>
                <p className="text-sm text-teal-100 font-medium mt-0.5">
                  โรงพยาบาลสังขละบุรี
                </p>
                <p className="text-xs text-teal-200">
                  จ.กาญจนบุรี • ปีงบประมาณ {hospitalInfo.fiscalYear}
                </p>
              </div>
            </div>

            <p className="text-xs text-teal-50/90 leading-relaxed pt-2">
              ระบบศูนย์กลางการแจ้งซ่อมอุปกรณ์คอมพิวเตอร์และระบบเครือข่าย ติดตามสถานะงานแบบเรียลไทม์ 
              แจ้งเตือนผ่าน LINE Notify พร้อมระบบอนุมัติงบประมาณและวิเคราะห์ความคุ้มค่าการถือครองทรัพย์สิน
            </p>

            {/* Feature Pills */}
            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2.5 bg-black/15 p-2 rounded-xl border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>แจ้งซ่อมสะดวกรวดเร็ว รองรับมือถือและคอมพิวเตอร์</span>
              </div>
              <div className="flex items-center gap-2.5 bg-black/15 p-2 rounded-xl border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>แจ้งเตือนสถานะงานเข้า LINE Notify กลุ่มศูนย์คอมฯ 24 ชม.</span>
              </div>
              <div className="flex items-center gap-2.5 bg-black/15 p-2 rounded-xl border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>แดชบอร์ดผู้บริหาร วิเคราะห์งบประมาณและประเมิน HA</span>
              </div>
            </div>
          </div>

          {/* Hospital Helpline Footer in Left Card */}
          <div className="relative z-10 pt-6 mt-6 border-t border-teal-600/60 flex items-center justify-between text-[11px] text-teal-100">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-amber-300" />
              <span>สายด่วนศูนย์ IT: <strong>โทร. 115</strong></span>
            </div>
            <span>ฉุกเฉิน ER/OR 24 ชม.</span>
          </div>

          {/* Decorative blur backdrop */}
          <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />
          <div className="absolute -left-12 -top-12 w-64 h-64 rounded-full bg-teal-400/20 blur-3xl pointer-events-none" />
        </div>

        {/* Right Side: Authentication Forms */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 flex flex-col justify-between space-y-6">
          
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-teal-600" />
                  เข้าสู่ระบบงาน (System Sign In)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  กรุณากรอกข้อมูลบัญชีผู้ใช้งาน หรือเลือกเข้าใช้งานด่วนตามสิทธิ์
                </p>
              </div>

              <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                Single Sign-On
              </span>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Standard Login Form */}
            <form onSubmit={handleStandardLogin} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  อีเมลเจ้าหน้าที่ / รหัสพนักงาน (Email or Staff ID)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="เช่น chanon.s@skh.moph.go.th หรือ ชื่อผู้ใช้"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">
                    รหัสผ่าน (Password)
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('กรณีลืมรหัสผ่าน กรุณาติดต่อศูนย์คอมพิวเตอร์และสารสนเทศ โรงพยาบาลสังขละบุรี โทร. 034-595040 ต่อ 115 หรือ 114 เพื่อรีเซ็ตรหัสผ่าน')}
                    className="text-[11px] text-teal-600 hover:underline"
                  >
                    ลืมรหัสผ่าน?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="รหัสผ่านเข้าสู่ระบบ"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-xs text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    title={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  * รหัสผ่านทดสอบเริ่มต้นคือ <strong className="text-slate-700 font-mono">password123</strong>
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500 w-3.5 h-3.5"
                  />
                  <span className="text-slate-600 text-[11px]">จดจำการเข้าสู่ระบบในอุปกรณ์นี้</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white rounded-xl font-semibold shadow-md shadow-teal-600/30 transition-all flex items-center justify-center gap-2 text-xs"
              >
                {isLoading ? (
                  <span>กำลังตรวจสอบสิทธิ์...</span>
                ) : (
                  <>
                    <span>เข้าสู่ระบบ (Sign In)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Role-based Access Section (1-Click Login for Seamless Demo) */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                เข้าสู่ระบบด่วนตามระดับสิทธิ์ (1-Click Demo Login)
              </span>
              <span className="text-[10px] text-slate-400">เลือกระดับบทบาทได้ทันที</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {users.map((user) => {
                const cfg = roleConfigs[user.role];
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleQuickRoleLogin(user.role)}
                    className={`p-2.5 rounded-xl border text-left transition-all group flex items-start gap-2.5 ${cfg.border} ${cfg.bg}`}
                  >
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 mt-0.5 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 truncate text-[11px]">
                          {user.name}
                        </span>
                      </div>
                      <span className={`inline-block text-[10px] font-semibold ${cfg.color}`}>
                        {cfg.title}
                      </span>
                      <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                        {cfg.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Compliance & Security Notice */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 gap-2">
            <span>© 2569 {hospitalInfo.nameTh} สงวนลิขสิทธิ์</span>
            <span className="flex items-center gap-1 text-slate-500">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              มาตรฐาน PDPA และความมั่นคงปลอดภัยไซเบอร์ สธ.
            </span>
          </div>

        </div>

      </div>

      {/* Bottom Footer Credits */}
      <div className="max-w-6xl w-full mx-auto text-center text-[11px] text-white/50 py-1">
        ศูนย์คอมพิวเตอร์และเทคโนโลยีสารสนเทศ (IT Center) {hospitalInfo.nameTh} {hospitalInfo.province}
      </div>

    </div>
  );
};
