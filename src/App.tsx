import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { RepairListView } from './components/RepairListView';
import { ApprovalView } from './components/ApprovalView';
import { AssetManagementView } from './components/AssetManagementView';
import { SatisfactionView } from './components/SatisfactionView';
import { BudgetAnalyticsView } from './components/BudgetAnalyticsView';
import { SystemSettingsView } from './components/SystemSettingsView';
import { RepairRequestModal } from './components/RepairRequestModal';
import { TicketDetailModal } from './components/TicketDetailModal';
import { PrintSlipModal } from './components/PrintSlipModal';
import { LineNotifyModal } from './components/LineNotifyModal';
import { LoginView } from './components/LoginView';

import { 
  LayoutDashboard, 
  Wrench, 
  PlusCircle, 
  Laptop, 
  Menu,
  CheckSquare,
  Star
} from 'lucide-react';

function AppContent() {
  const { 
    currentTab, 
    setCurrentTab, 
    selectedTicket, 
    setSelectedTicket, 
    ticketToPrint, 
    setTicketToPrint,
    currentUser,
    tickets,
    isAuthenticated
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [isLineModalOpen, setIsLineModalOpen] = useState(false);

  // If user is not authenticated, show the login view
  if (!isAuthenticated) {
    return <LoginView />;
  }

  const pendingApprovalsCount = tickets.filter(
    t => t.status === 'approved_wait' && t.needsApproval && t.approvalStatus !== 'approved'
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Prompt',sans-serif]">
      
      {/* Top Navigation Bar */}
      <Navbar 
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
        onOpenNewTicketModal={() => setIsNewTicketOpen(true)}
        onOpenLineModal={() => setIsLineModalOpen(true)}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Desktop Sidebar & Mobile Drawer */}
        <Sidebar
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          onOpenNewTicketModal={() => setIsNewTicketOpen(true)}
        />

        {/* Content Area */}
        <main className="flex-1 min-w-0 p-3 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          {currentTab === 'dashboard' && <DashboardView />}
          {currentTab === 'tickets' && <RepairListView />}
          {currentTab === 'approvals' && <ApprovalView />}
          {currentTab === 'assets' && <AssetManagementView />}
          {currentTab === 'satisfaction' && <SatisfactionView />}
          {currentTab === 'analytics' && <BudgetAnalyticsView />}
          {currentTab === 'settings' && <SystemSettingsView />}
        </main>

      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 flex items-center justify-around shadow-lg">
        
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
            currentTab === 'dashboard' ? 'text-teal-600 font-semibold' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">แดชบอร์ด</span>
        </button>

        <button
          onClick={() => setCurrentTab('tickets')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
            currentTab === 'tickets' ? 'text-teal-600 font-semibold' : 'text-slate-500'
          }`}
        >
          <Wrench className="w-5 h-5" />
          <span className="text-[10px]">ติดตามงาน</span>
        </button>

        {/* Center Highlighted New Request Button */}
        <button
          onClick={() => setIsNewTicketOpen(true)}
          className="flex flex-col items-center justify-center -mt-5"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white flex items-center justify-center shadow-lg shadow-teal-600/30 active:scale-95 transition-transform">
            <PlusCircle className="w-6 h-6" />
          </div>
          <span className="text-[10px] text-teal-700 font-bold mt-0.5">แจ้งซ่อม</span>
        </button>

        {(currentUser.role === 'supervisor' || currentUser.role === 'executive') ? (
          <button
            onClick={() => setCurrentTab('approvals')}
            className={`relative flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
              currentTab === 'approvals' ? 'text-teal-600 font-semibold' : 'text-slate-500'
            }`}
          >
            <CheckSquare className="w-5 h-5" />
            <span className="text-[10px]">อนุมัติ</span>
            {pendingApprovalsCount > 0 && (
              <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>
        ) : (
          <button
            onClick={() => setCurrentTab('satisfaction')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
              currentTab === 'satisfaction' ? 'text-teal-600 font-semibold' : 'text-slate-500'
            }`}
          >
            <Star className="w-5 h-5" />
            <span className="text-[10px]">ประเมิน</span>
          </button>
        )}

        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-slate-500"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px]">เมนูทั้งหมด</span>
        </button>

      </div>

      {/* Modals */}
      <RepairRequestModal
        isOpen={isNewTicketOpen}
        onClose={() => setIsNewTicketOpen(false)}
      />

      <TicketDetailModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />

      <PrintSlipModal
        ticket={ticketToPrint}
        onClose={() => setTicketToPrint(null)}
      />

      <LineNotifyModal
        isOpen={isLineModalOpen}
        onClose={() => setIsLineModalOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
