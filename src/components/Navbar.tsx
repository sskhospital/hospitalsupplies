import React, { useState } from 'react';
import { 
  Building2, 
  Bell, 
  UserCircle, 
  PlusCircle, 
  Menu, 
  X, 
  Send, 
  ShieldCheck, 
  Wrench, 
  Sparkles,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { HospitalLogo } from './HospitalLogo';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface NavbarProps {
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
  onOpenNewTicketModal: () => void;
  onOpenLineModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileMenu,
  isMobileMenuOpen,
  onOpenNewTicketModal,
  onOpenLineModal,
}) => {
  const { 
    currentUser, 
    setCurrentUser, 
    users, 
    lineNotifications, 
    hospitalInfo,
    setCurrentTab,
    logout
  } = useApp();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const roleLabels: Record<UserRole, { title: string; badgeColor: string; icon: React.ReactNode }> = {
    requester: {
      title: 'ผู้ใช้งาน / เจ้าหน้าที่แผนก',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: <UserCircle className="w-3.5 h-3.5 text-emerald-600" />,
    },
    technician: {
      title: 'ช่างเทคนิคคอมพิวเตอร์',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: <Wrench className="w-3.5 h-3.5 text-blue-600" />,
    },
    supervisor: {
      title: 'หัวหน้างาน IT / ผู้ดูแลระบบ',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />,
    },
    executive: {
      title: 'ผู้บริหาร / ผู้อำนวยการ',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: <Sparkles className="w-3.5 h-3.5 text-amber-600" />,
    },
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Hospital Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div 
              onClick={() => setCurrentTab('dashboard')}
              className="flex items-center gap-3 cursor-pointer select-none group"
            >
              <div className="relative flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                <HospitalLogo className="w-10 h-10 sm:w-11 sm:h-11 drop-shadow-sm" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
                    {hospitalInfo.nameTh}
                  </span>
                  <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                    IT Service
                  </span>
                </div>
                <span className="text-xs text-slate-500 hidden sm:inline">
                  ระบบซ่อมบำรุงครุภัณฑ์คอมพิวเตอร์และเครือข่าย
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Supabase PostgreSQL Status Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border bg-emerald-50/70 border-emerald-200/80 text-emerald-900" title="สถานะการเชื่อมต่อฐานข้อมูล Supabase PostgreSQL">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-emerald-800">Supabase DB</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-100/80 px-1 rounded font-medium">Online</span>
            </div>

            {/* New Ticket Button */}
            <button
              onClick={onOpenNewTicketModal}
              className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm shadow-teal-600/30 transition-all hover:shadow active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">แจ้งซ่อมออนไลน์</span>
              <span className="sm:hidden">แจ้งซ่อม</span>
            </button>

            {/* LINE Notify Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="relative p-2 text-slate-600 hover:text-teal-600 hover:bg-teal-50/70 rounded-lg transition-colors"
                title="การแจ้งเตือน LINE Notify"
              >
                <Bell className="w-5 h-5" />
                {lineNotifications.length > 0 && (
                  <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                )}
              </button>

              {/* Notifications Popup */}
              {showNotifDropdown && (
                <div 
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200/80 p-3 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="font-semibold text-sm text-slate-900">LINE Notify Real-time</span>
                    </div>
                    <button
                      onClick={() => {
                        setShowNotifDropdown(false);
                        onOpenLineModal();
                      }}
                      className="text-xs text-teal-600 hover:underline flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      ตั้งค่า / ทดสอบ
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-2 pr-1 text-xs">
                    {lineNotifications.length === 0 ? (
                      <p className="text-center text-slate-400 py-6">ยังไม่มีการแจ้งเตือนล่าสุด</p>
                    ) : (
                      lineNotifications.map((notif) => (
                        <div 
                          key={notif.id}
                          className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 hover:bg-teal-50/40 transition-colors"
                        >
                          <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                            <span className="font-medium text-emerald-600">LINE รพ.สังขละบุรี</span>
                            <span>{notif.timestamp}</span>
                          </div>
                          <p className="text-slate-700 whitespace-pre-line leading-relaxed font-sans">
                            {notif.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="mt-2 pt-2 border-t border-slate-100 text-center">
                    <button
                      onClick={() => {
                        setShowNotifDropdown(false);
                        onOpenLineModal();
                      }}
                      className="text-xs text-slate-500 hover:text-slate-800 font-medium"
                    >
                      ดูประวัติและตั้งค่า Webhook ทั้งหมด →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher Menu */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left"
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-teal-500/40"
                />
                <div className="hidden md:flex flex-col">
                  <span className="text-xs font-semibold text-slate-800 max-w-[130px] truncate leading-tight">
                    {currentUser.name}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    {roleLabels[currentUser.role]?.icon}
                    <span className="text-[10px] text-slate-500 truncate max-w-[110px]">
                      {roleLabels[currentUser.role]?.title}
                    </span>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* Role Dropdown */}
              {showRoleDropdown && (
                <div 
                  className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200/80 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setShowRoleDropdown(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                      สลับบทบาทการใช้งาน (Role-based Access)
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      ทดลองใช้งานในมุมมองต่างๆ ได้ทันที
                    </p>
                  </div>

                  <div className="space-y-1">
                    {users.map((user) => {
                      const isCurrent = user.id === currentUser.id;
                      const roleConfig = roleLabels[user.role];
                      return (
                        <button
                          key={user.id}
                          onClick={() => setCurrentUser(user)}
                          className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-left transition-colors ${
                            isCurrent 
                              ? 'bg-teal-50 border border-teal-200/80 text-teal-900' 
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold truncate">{user.name}</span>
                              {isCurrent && (
                                <span className="text-[9px] bg-teal-600 text-white px-1.5 py-0.2 rounded-full font-medium">
                                  ใช้งานอยู่
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className={`text-[10px] px-1.5 py-0.2 rounded border ${roleConfig?.badgeColor}`}>
                                {roleConfig?.title}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">
                              {user.department}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 px-1 space-y-1">
                    <button
                      onClick={() => {
                        setShowRoleDropdown(false);
                        logout();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <LogOut className="w-3.5 h-3.5" />
                        ออกจากระบบ (Log Out)
                      </span>
                      <span className="text-[10px] text-slate-400">สิ้นสุดเซสชัน</span>
                    </button>
                    <div className="pt-1 px-2 text-[11px] text-slate-400 flex justify-between items-center">
                      <span>รพ.สังขละบุรี IT Connect</span>
                      <span className="text-teal-600 font-medium">SSL Encrypted</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Logout Icon Button on Navbar */}
            <button
              onClick={logout}
              title="ออกจากระบบ (Log Out)"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200/80 hover:border-rose-200 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>ออก</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
