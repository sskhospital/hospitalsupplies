import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Wrench, 
  CheckSquare, 
  Laptop, 
  Star, 
  BarChart3, 
  Settings, 
  PhoneCall, 
  X,
  ExternalLink,
  LogOut
} from 'lucide-react';
import { HospitalLogo } from './HospitalLogo';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenNewTicketModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpenMobile,
  onCloseMobile,
  onOpenNewTicketModal,
}) => {
  const { currentTab, setCurrentTab, currentUser, tickets, hospitalInfo, logout } = useApp();

  const pendingApprovalsCount = tickets.filter(
    t => t.status === 'approved_wait' && t.needsApproval && t.approvalStatus !== 'approved'
  ).length;

  const activeRepairCount = tickets.filter(
    t => t.status === 'pending' || t.status === 'in_progress' || t.status === 'waiting_parts'
  ).length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'แดชบอร์ดภาพรวม',
      subtitle: 'KPI & สรุปสถานะงาน',
      icon: <LayoutDashboard className="w-5 h-5" />,
      badge: null,
      roles: ['requester', 'technician', 'supervisor', 'executive'],
    },
    {
      id: 'tickets',
      label: 'ติดตามงานแจ้งซ่อม',
      subtitle: 'ประวัติและสถานะงาน',
      icon: <Wrench className="w-5 h-5" />,
      badge: activeRepairCount > 0 ? `${activeRepairCount}` : null,
      badgeColor: 'bg-teal-100 text-teal-700',
      roles: ['requester', 'technician', 'supervisor', 'executive'],
    },
    {
      id: 'approvals',
      label: 'อนุมัติการซ่อมและงบ',
      subtitle: 'พิจารณาเบิกจ่าย/อะไหล่',
      icon: <CheckSquare className="w-5 h-5" />,
      badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount}` : null,
      badgeColor: 'bg-amber-100 text-amber-800 font-bold animate-pulse',
      roles: ['supervisor', 'executive', 'technician'],
    },
    {
      id: 'assets',
      label: 'ทะเบียนครุภัณฑ์ IT',
      subtitle: 'จัดการประวัติคอมพิวเตอร์',
      icon: <Laptop className="w-5 h-5" />,
      badge: null,
      roles: ['requester', 'technician', 'supervisor', 'executive'],
    },
    {
      id: 'satisfaction',
      label: 'ประเมินความพึงพอใจ',
      subtitle: 'ผลสำรวจมาตรฐาน HA',
      icon: <Star className="w-5 h-5" />,
      badge: null,
      roles: ['requester', 'technician', 'supervisor', 'executive'],
    },
    {
      id: 'analytics',
      label: 'วิเคราะห์งบ & วางแผน',
      subtitle: 'Predictive Maintenance',
      icon: <BarChart3 className="w-5 h-5" />,
      badge: null,
      roles: ['supervisor', 'executive', 'technician'],
    },
    {
      id: 'settings',
      label: 'ระบบสำรอง & สิทธิ์ & API',
      subtitle: 'Cloud Backup & เชื่อม HIS',
      icon: <Settings className="w-5 h-5" />,
      badge: null,
      roles: ['supervisor', 'executive'],
    },
  ];

  // Filter items by role
  const visibleItems = navItems.filter(item => item.roles.includes(currentUser.role));

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    if (isOpenMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200/80 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0 flex flex-col justify-between ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top Header in Mobile */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 lg:hidden">
          <div className="flex items-center gap-2.5">
            <HospitalLogo className="w-8 h-8" />
            <span className="font-bold text-slate-800 text-sm">รพ.สังขละบุรี IT</span>
          </div>
          <button 
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Button & Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {/* Quick Ticket Action */}
          <div className="px-2 mb-3">
            <button
              onClick={() => {
                onOpenNewTicketModal();
                if (isOpenMobile) onCloseMobile();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm shadow-teal-600/20 transition-all active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>เปิดใบแจ้งซ่อมใหม่</span>
            </button>
          </div>

          <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            เมนูหลัก (Navigation)
          </div>

          {visibleItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all group ${
                  isActive
                    ? 'bg-teal-50/80 text-teal-800 font-medium shadow-xs border border-teal-200/60'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`${isActive ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-600'} transition-colors`}>
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs truncate">{item.label}</p>
                    <p className="text-[10px] text-slate-400 truncate">{item.subtitle}</p>
                  </div>
                </div>

                {item.badge && (
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${item.badgeColor || 'bg-slate-100 text-slate-600'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-2 px-1">
            <button
              onClick={() => {
                if (isOpenMobile) onCloseMobile();
                logout();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all border border-dashed border-rose-200/80"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span>ออกจากระบบ (Log Out)</span>
            </button>
          </div>
        </div>

        {/* Hospital Support Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70 m-3 rounded-2xl">
          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-lg bg-teal-100/60 text-teal-700 mt-0.5">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-800">ศูนย์คอมพิวเตอร์ รพ.</p>
              <p className="text-[11px] text-teal-700 font-medium">โทร. 034-595040 ต่อ 115</p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                บริการ 24 ชั่วโมง กรณีระบบวิกฤต (ER/OR)
              </p>
            </div>
          </div>
          
          <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
            <span>ปีงบประมาณ {hospitalInfo.fiscalYear}</span>
            <span className="text-slate-500 font-medium flex items-center gap-0.5">
              Smart Hospital <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
