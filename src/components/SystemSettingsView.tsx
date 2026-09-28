import React, { useState } from 'react';
import { 
  Settings, 
  Cloud, 
  Database, 
  Users, 
  Download, 
  Upload, 
  RefreshCw, 
  CheckCircle2, 
  ShieldCheck, 
  Key, 
  UserPlus, 
  AlertTriangle,
  Server,
  Lock,
  RotateCcw,
  GitBranch,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { DEPARTMENTS } from '../data/mockData';

export const SystemSettingsView: React.FC = () => {
  const { 
    users, 
    addUser, 
    updateUserRole, 
    apiConfig, 
    updateApiConfig, 
    triggerHisSync, 
    isSyncingHis,
    exportBackupJson, 
    importBackupJson, 
    resetToDefaultData,
    lastBackupTime,
    hospitalInfo,
    isSupabaseConnected,
    isLoadingSupabase,
    supabaseError,
    refreshFromSupabase
  } = useApp();

  const [activeTab, setActiveTab] = useState<'backup' | 'api' | 'users' | 'github'>('backup');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  // Add User Form State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('requester');
  const [newUserDept, setNewUserDept] = useState(DEPARTMENTS[0]);
  const [newUserPhone, setNewUserPhone] = useState('');

  // API Config Local State
  const [endpointUrl, setEndpointUrl] = useState(apiConfig.endpointUrl);
  const [apiKey, setApiKey] = useState(apiConfig.apiKey);
  const [hisProvider, setHisProvider] = useState(apiConfig.hisProvider);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState(false);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) return;

    addUser({
      name: newUserName,
      email: newUserEmail || `${newUserName.toLowerCase().replace(/\s+/g, '')}@skh.moph.go.th`,
      role: newUserRole,
      department: newUserDept,
      phone: newUserPhone || '034-595040',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    });

    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = await importBackupJson(content);
        if (success) {
          alert('กู้คืนข้อมูลสำรองของโรงพยาบาลสำเร็จแล้ว ระบบพร้อมทำงานทันที');
        } else {
          alert('รูปแบบไฟล์สำรองไม่ถูกต้อง ไม่สามารถกู้คืนได้');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleSyncNow = async () => {
    const ok = await triggerHisSync();
    if (ok) {
      setSyncSuccessMsg(true);
      setTimeout(() => setSyncSuccessMsg(false), 3000);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-teal-600" />
            ระบบสำรองข้อมูล Cloud, เชื่อมต่อ API และจัดการสิทธิ์ผู้ใช้งาน
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            โรงพยาบาลสังขละบุรี • มาตรฐานความปลอดภัยข้อมูลสารสนเทศภาครัฐและกระทรวงสาธารณสุข
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('backup')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'backup' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Cloud className="w-3.5 h-3.5 text-teal-600" />
            <span>สำรองข้อมูล Cloud</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'api' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-teal-600" />
            <span>เชื่อมต่อ API ฐานข้อมูล</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'users' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-teal-600" />
            <span>สิทธิ์ผู้ใช้ (RBAC)</span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'github' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5 text-teal-600" />
            <span>ออนไลน์ผ่าน GitHub</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Cloud & Backup */}
      {activeTab === 'backup' && (
        <div className="space-y-6">

          {/* Supabase PostgreSQL Production Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-white to-teal-500/5 border border-emerald-300/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-600 text-white shadow-xs">
                    <Database className="w-5 h-5" />
                  </span>
                  <h2 className="text-base font-bold text-slate-900">
                    Supabase PostgreSQL Database
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  ฐานข้อมูลหลัก PostgreSQL บน Supabase สำหรับจัดเก็บใบแจ้งซ่อม, ทะเบียนครุภัณฑ์, อะไหล่ และข้อมูลระบบโรงพยาบาลสังขละบุรี
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${
                  isSupabaseConnected 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : isLoadingSupabase 
                    ? 'bg-amber-50 text-amber-700 border-amber-200' 
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    isSupabaseConnected ? 'bg-emerald-500 animate-pulse' : isLoadingSupabase ? 'bg-amber-500 animate-spin' : 'bg-rose-500'
                  }`} />
                  {isSupabaseConnected ? 'เชื่อมต่อแล้ว (Connected)' : isLoadingSupabase ? 'กำลังเชื่อมต่อ...' : 'ไม่สามารถเชื่อมต่อได้'}
                </span>

                <button
                  type="button"
                  onClick={() => refreshFromSupabase()}
                  disabled={isLoadingSupabase}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:border-emerald-400 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isLoadingSupabase ? 'animate-spin' : ''}`} />
                  <span>โหลดข้อมูลสด</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white border border-emerald-200/60 shadow-xs">
                <span className="text-slate-400 block text-[11px]">Supabase Project URL</span>
                <span className="font-mono font-semibold text-slate-800 truncate block">zduecibgqkzynjaelcwv.supabase.co</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-emerald-200/60 shadow-xs">
                <span className="text-slate-400 block text-[11px]">Database Engine</span>
                <span className="font-semibold text-emerald-700">PostgreSQL (Relational DB)</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-emerald-200/60 shadow-xs">
                <span className="text-slate-400 block text-[11px]">Data Replication</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Auto-Synchronized
                </span>
              </div>
            </div>

            {supabaseError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>ข้อผิดพลาดจาก Supabase: {supabaseError}</span>
              </div>
            )}
          </div>
          
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-teal-600" />
                  ระบบสำรองข้อมูลอัตโนมัติ (Automated Cloud Backup)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  ระบบสำรองฐานข้อมูลประวัติการแจ้งซ่อมและทะเบียนครุภัณฑ์แบบเรียลไทม์
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                สถานะระบบ Cloud: ปกติ (99.99% Uptime)
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">เซิร์ฟเวอร์สำรองข้อมูล:</span>
                <span className="font-mono text-slate-800">cloud-backup.skh.moph.go.th (Secure High Availability)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ความถี่การสำรองข้อมูลอัตโนมัติ:</span>
                <span className="font-semibold text-slate-800">ทุกๆ 24 ชั่วโมง (และบันทึกลง Local Cache ทุกการเปลี่ยนแปลง)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">การสำรองข้อมูลล่าสุด:</span>
                <span className="text-teal-700 font-semibold">{new Date(lastBackupTime).toLocaleString('th-TH')}</span>
              </div>
            </div>

            {/* Manual Export & Import */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3">
              <button
                onClick={exportBackupJson}
                className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 transition-transform active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>ดาวน์โหลดไฟล์สำรองข้อมูล (Export JSON Backup)</span>
              </button>

              <label className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-slate-500" />
                <span>กู้คืนข้อมูลจากไฟล์ (Restore Backup JSON)</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => {
                  if (confirm('คุณต้องการรีเซ็ตข้อมูลทั้งหมดกลับสู่ค่าเริ่มต้นของโรงพยาบาลสังขละบุรีหรือไม่?')) {
                    resetToDefaultData();
                  }
                }}
                className="px-3.5 py-2.5 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-medium flex items-center gap-1.5 ml-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>รีเซ็ตฐานข้อมูลเริ่มต้น</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: HIS & API Integration */}
      {activeTab === 'api' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-600" />
                การเชื่อมต่อ API กับระบบโรงพยาบาลเดิม (HIS Database Sync)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                รองรับ HOSxP, JHCIS และระบบฐานข้อมูลครุภัณฑ์กระทรวงสาธารณสุข
              </p>
            </div>

            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200">
              RESTful API / Webhook
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                โปรแกรมสารสนเทศโรงพยาบาลที่ใช้งาน (HIS Provider)
              </label>
              <select
                value={hisProvider}
                onChange={(e) => setHisProvider(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option value="HOSxP">HOSxP (Hospital OS & DB)</option>
                <option value="JHCIS">JHCIS (รพ.สต. และชุมชน)</option>
                <option value="CustomAPI">ระบบเชื่อมต่อ API ภายนอกกำหนดเอง</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                รอบการซิงค์ข้อมูลอัตโนมัติ (Sync Frequency)
              </label>
              <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                <option>ทุก 6 ชั่วโมง (แนะนำสำหรับโรงพยาบาลชุมชน)</option>
                <option>ทุก 1 ชั่วโมง</option>
                <option>Real-time Webhook</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                API Endpoint URL
              </label>
              <input
                type="text"
                value={endpointUrl}
                onChange={(e) => setEndpointUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                API Key / Bearer Authentication Token
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* Sync status alert */}
          {syncSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                เชื่อมต่อและซิงค์ข้อมูลสำเร็จ! รายการครุภัณฑ์และสถานะงานตรงกับฐานข้อมูล HOSxP เรียบร้อยแล้ว
              </span>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              ซิงค์สำเร็จล่าสุด: {new Date(apiConfig.lastSyncTimestamp).toLocaleString('th-TH')}
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  updateApiConfig({ endpointUrl, apiKey, hisProvider });
                  alert('บันทึกการตั้งค่าการเชื่อมต่อ API เรียบร้อยแล้ว');
                }}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl font-semibold"
              >
                บันทึกการตั้งค่า
              </button>
              <button
                type="button"
                onClick={handleSyncNow}
                disabled={isSyncingHis}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingHis ? 'animate-spin' : ''}`} />
                <span>{isSyncingHis ? 'กำลังซิงค์ข้อมูล...' : 'ทดสอบการเชื่อมต่อ API ทันที'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Users & RBAC */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-600" />
                การจัดการผู้ใช้งานและการกำหนดสิทธิ์ (Role-Based Access Control)
              </h2>
              <p className="text-xs text-slate-400">
                กำหนดระดับการเข้าถึงข้อมูลตามหน้าที่ความรับผิดชอบเพื่อความปลอดภัยสูงสุด
              </p>
            </div>

            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs self-start sm:self-auto"
            >
              <UserPlus className="w-4 h-4" />
              <span>เพิ่มผู้ใช้งานใหม่</span>
            </button>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="p-3">บุคลากร</th>
                  <th className="p-3">แผนก / หน่วยงาน</th>
                  <th className="p-3">สิทธิ์การเข้าถึง (Role)</th>
                  <th className="p-3">เบอร์โทรศัพท์ติดต่อ</th>
                  <th className="p-3 text-right">ปรับเปลี่ยนสิทธิ์</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80'}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-semibold text-slate-800">{u.name}</p>
                          <p className="text-[10px] text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 text-slate-700 font-medium">
                      {u.department}
                    </td>

                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        u.role === 'requester' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        u.role === 'technician' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        u.role === 'supervisor' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {u.role === 'requester' ? 'ผู้ใช้งานทั่วไป (แจ้งซ่อม/ติดตาม)' :
                         u.role === 'technician' ? 'ช่างเทคนิคคอมพิวเตอร์ (รับงาน/ซ่อม)' :
                         u.role === 'supervisor' ? 'หัวหน้างาน IT / ดูแลระบบ' :
                         'ผู้บริหาร / ผู้อำนวยการ รพ.'}
                      </span>
                    </td>

                    <td className="p-3 font-mono text-slate-600">
                      {u.phone}
                    </td>

                    <td className="p-3 text-right">
                      <select
                        value={u.role}
                        onChange={(e) => updateUserRole(u.id, e.target.value as UserRole)}
                        className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      >
                        <option value="requester">ผู้ใช้งานทั่วไป</option>
                        <option value="technician">ช่างเทคนิค IT</option>
                        <option value="supervisor">หัวหน้างาน IT</option>
                        <option value="executive">ผู้บริหาร รพ.</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: GitHub Deployment */}
      {activeTab === 'github' && (
        <div className="space-y-6">
          {/* Main Info Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
                  <GitBranch className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    คู่มือการนำเว็ปแอปพริเคชันขึ้นออนไลน์ผ่าน GitHub
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-500/20 text-teal-300 border border-teal-400/30">
                      CI/CD Ready
                    </span>
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    ระบบได้เตรียมไฟล์คอนฟิก GitHub Actions (<code className="text-teal-300">.github/workflows/deploy.yml</code>) และ relative base path ไว้ให้เรียบร้อยแล้ว
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-slate-700/60">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="text-slate-400 block text-[11px]">Firebase Database</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Cloud Firestore เชื่อมต่อแล้ว
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="text-slate-400 block text-[11px]">GitHub Actions Workflow</span>
                <span className="font-mono text-teal-300 text-[11px] truncate block mt-0.5">.github/workflows/deploy.yml</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="text-slate-400 block text-[11px]">Asset Paths</span>
                <span className="font-semibold text-amber-300 mt-0.5 block">base: './' (พร้อม GitHub Pages)</span>
              </div>
            </div>
          </div>

          {/* Step by Step Instructions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Option 1: GitHub Pages */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 font-bold flex items-center justify-center text-xs">
                    1
                  </span>
                  <h3 className="font-bold text-slate-800 text-sm">
                    วิธีที่ 1: ออนไลน์ฟรีผ่าน GitHub Pages
                  </h3>
                </div>
                <span className="text-[11px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-medium">แนะนำ</span>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <p className="font-semibold text-slate-800">ขั้นตอนที่ 1: สร้าง Repository บน GitHub</p>
                  <p className="text-slate-500">ไปที่ <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-teal-600 underline font-medium inline-flex items-center gap-0.5">github.com/new <ExternalLink className="w-3 h-3" /></a> แล้วตั้งชื่อเช่น <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">sangkhlaburi-hospital-it</code></p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-800">ขั้นตอนที่ 2: รันคำสั่ง Git Push ขึ้น GitHub</p>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(`git init\ngit add .\ngit commit -m "feat: initial commit"\ngit branch -M main\ngit remote add origin https://github.com/<USERNAME>/sangkhlaburi-hospital-it.git\ngit push -u origin main`, 'git-cmd')}
                      className="text-[11px] text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
                    >
                      {copiedCmd === 'git-cmd' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCmd === 'git-cmd' ? 'คัดลอกแล้ว' : 'คัดลอกคำสั่ง'}</span>
                    </button>
                  </div>
                  <pre className="p-2.5 rounded-lg bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto leading-relaxed">
git init{'\n'}
git add .{'\n'}
git commit -m "feat: initial commit"{'\n'}
git branch -M main{'\n'}
git remote add origin https://github.com/&lt;USERNAME&gt;/sangkhlaburi-hospital-it.git{'\n'}
git push -u origin main
                  </pre>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <p className="font-semibold text-slate-800">ขั้นตอนที่ 3: เปิดใช้งาน GitHub Pages</p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-600">
                    <li>ไปที่แท็บ <strong>Settings</strong> ของ Repo บน GitHub</li>
                    <li>เลือกเมนูด้านซ้าย <strong>Pages</strong></li>
                    <li>ตรง <strong>Build and deployment &gt; Source</strong> เลือกเป็น <strong className="text-teal-700">GitHub Actions</strong></li>
                    <li>รอประมาณ 1 นาที ระบบจะ Deploy ให้อัตโนมัติและให้ลิงก์เว็บทันที!</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Option 2: Vercel / Netlify */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 font-bold flex items-center justify-center text-xs">
                    2
                  </span>
                  <h3 className="font-bold text-slate-800 text-sm">
                    วิธีที่ 2: เชื่อม GitHub เข้ากับ Vercel / Netlify
                  </h3>
                </div>
                <span className="text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-medium">เร็ว & เสถียรสูง</span>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <p className="font-semibold text-slate-800">ขั้นตอนที่ 1: ล็อกอิน Vercel ด้วย GitHub</p>
                  <p className="text-slate-500">ไปที่ <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-teal-600 underline font-medium inline-flex items-center gap-0.5">vercel.com <ExternalLink className="w-3 h-3" /></a> หรือ <a href="https://www.netlify.com" target="_blank" rel="noreferrer" className="text-teal-600 underline font-medium inline-flex items-center gap-0.5">netlify.com <ExternalLink className="w-3 h-3" /></a> แล้วกด Login with GitHub</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <p className="font-semibold text-slate-800">ขั้นตอนที่ 2: นำเข้า Repository</p>
                  <p className="text-slate-500">กดปุ่ม <strong>Add New &gt; Project</strong> แล้วเลือก Repository <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">sangkhlaburi-hospital-it</code></p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <p className="font-semibold text-slate-800">ขั้นตอนที่ 3: ตรวจสอบ Build Settings & Deploy</p>
                  <ul className="space-y-1 text-slate-600 font-mono text-[11px]">
                    <li>• Framework: <strong className="text-slate-800 font-sans">Vite</strong></li>
                    <li>• Build Command: <code className="bg-slate-200 px-1 rounded text-teal-800">npm run build</code></li>
                    <li>• Output Directory: <code className="bg-slate-200 px-1 rounded text-teal-800">dist</code></li>
                  </ul>
                  <p className="text-slate-500 pt-1">กดปุ่ม <strong>Deploy</strong> คุณจะได้โดเมนพร้อมใช้แบบ HTTPS ทันที เช่น <code className="text-teal-700 font-mono">https://sangkhla-it.vercel.app</code></p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-slate-800 text-sm pb-2 border-b border-slate-100">
              เพิ่มผู้ใช้งานใหม่และกำหนดระดับสิทธิ์
            </h3>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">ชื่อ-นามสกุล / ตำแหน่ง *</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น นพ.สมศักดิ์ แพทย์เวร"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">อีเมลทางการของ รพ.</label>
                <input
                  type="email"
                  placeholder="somsak@skh.moph.go.th"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">แผนก / หน่วยงาน</label>
                <select
                  value={newUserDept}
                  onChange={(e) => setNewUserDept(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">ระดับสิทธิ์การเข้าถึง (Role)</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                >
                  <option value="requester">ผู้ใช้งานทั่วไป (แจ้งซ่อมและติดตามงาน)</option>
                  <option value="technician">ช่างเทคนิค IT (รับงาน บันทึกอาการ เบิกอะไหล่)</option>
                  <option value="supervisor">หัวหน้างาน IT (อนุมัติงาน จัดการครุภัณฑ์และสิทธิ์)</option>
                  <option value="executive">ผู้บริหาร รพ. (ดูแดชบอร์ดงบประมาณ อนุมัติจัดซื้อ)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">เบอร์โทรศัพท์ติดต่อ / เบอร์ภายใน</label>
                <input
                  type="text"
                  placeholder="034-595040 ต่อ 120"
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold"
                >
                  บันทึกผู้ใช้
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
