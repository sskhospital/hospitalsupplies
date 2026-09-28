import React from 'react';
import { 
  Wrench, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  Star, 
  ArrowRight, 
  Flame, 
  Printer, 
  CheckSquare, 
  Laptop, 
  Building
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Priority, TicketStatus } from '../types';

export const DashboardView: React.FC = () => {
  const { 
    tickets, 
    assets, 
    currentUser, 
    setSelectedTicket, 
    setTicketToPrint, 
    setCurrentTab,
    hospitalInfo 
  } = useApp();

  // Metrics calculations
  const totalTickets = tickets.length;
  const pendingTickets = tickets.filter(t => t.status === 'pending').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress' || t.status === 'waiting_parts').length;
  const approvalWaitTickets = tickets.filter(t => t.status === 'approved_wait').length;
  const completedTickets = tickets.filter(t => t.status === 'completed' || t.status === 'closed').length;
  const criticalTickets = tickets.filter(t => t.priority === 'critical' && t.status !== 'closed');

  // Budget calculations
  const totalActualCost = tickets.reduce((sum, t) => sum + (t.actualCost || 0), 0);
  const budgetPercentage = Math.min(100, Math.round((totalActualCost / hospitalInfo.budgetAllocated) * 100));

  // Satisfaction average
  const ratedTickets = tickets.filter(t => t.satisfactionRating?.average);
  const avgSatisfaction = ratedTickets.length > 0
    ? (ratedTickets.reduce((sum, t) => sum + (t.satisfactionRating?.average || 0), 0) / ratedTickets.length).toFixed(2)
    : '4.85';

  // Department distribution
  const deptCounts: Record<string, number> = {};
  tickets.forEach(t => {
    deptCounts[t.department] = (deptCounts[t.department] || 0) + 1;
  });
  const topDepts = Object.entries(deptCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Status mapping
  const statusBadges: Record<TicketStatus, { label: string; className: string }> = {
    pending: { label: 'รอดำเนินการ', className: 'bg-amber-50 text-amber-700 border-amber-200' },
    approved_wait: { label: 'รออนุมัติงบ', className: 'bg-rose-50 text-rose-700 border-rose-200' },
    in_progress: { label: 'กำลังซ่อม', className: 'bg-blue-50 text-blue-700 border-blue-200' },
    waiting_parts: { label: 'รออะไหล่', className: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    completed: { label: 'ซ่อมเสร็จสิ้น', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    closed: { label: 'ปิดงานแล้ว', className: 'bg-slate-100 text-slate-700 border-slate-200' },
  };

  const priorityBadges: Record<Priority, { label: string; className: string }> = {
    critical: { label: 'ฉุกเฉิน (วิกฤต)', className: 'bg-red-500 text-white font-semibold' },
    high: { label: 'เร่งด่วน', className: 'bg-amber-500 text-white' },
    medium: { label: 'ปกติ', className: 'bg-blue-500 text-white' },
    low: { label: 'ต่ำ', className: 'bg-slate-400 text-white' },
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Welcome & Hospital Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 p-6 sm:p-8 text-white shadow-lg shadow-teal-900/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-teal-50 text-xs font-medium border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              ระบบซ่อมบำรุงออนไลน์ รพ.สังขละบุรี • ปีงบประมาณ {hospitalInfo.fiscalYear}
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
              สวัสดี, {currentUser.name}
            </h1>
            <p className="text-teal-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
              ยินดีต้อนรับสู่ระบบบริหารจัดการงานซ่อมบำรุงและครุภัณฑ์คอมพิวเตอร์ ตรวจสอบสถานะงานแบบเรียลไทม์ แจ้งเตือนผ่าน LINE Notify และพร้อมรองรับการเชื่อมต่อระบบโรงพยาบาล
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setCurrentTab('tickets')}
              className="px-4 py-2 bg-white text-teal-800 hover:bg-teal-50 text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Wrench className="w-4 h-4 text-teal-600" />
              <span>ติดตามงานซ่อม</span>
            </button>
            {(currentUser.role === 'supervisor' || currentUser.role === 'executive') && (
              <button
                onClick={() => setCurrentTab('approvals')}
                className="px-4 py-2 bg-teal-800/60 hover:bg-teal-800 text-white border border-teal-400/30 text-xs sm:text-sm font-semibold rounded-xl transition-all active:scale-95 flex items-center gap-1.5"
              >
                <CheckSquare className="w-4 h-4 text-amber-300" />
                <span>พิจารณาอนุมัติ ({approvalWaitTickets})</span>
              </button>
            )}
          </div>
        </div>

        {/* Subtle decorative circles */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute right-40 top-0 w-48 h-48 rounded-full bg-emerald-400/10 blur-xl pointer-events-none" />
      </div>

      {/* Critical / Urgent Maintenance Alert Banner if any */}
      {criticalTickets.length > 0 && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200/80 text-red-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-red-100 text-red-600 shrink-0">
              <Flame className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-red-800 flex items-center gap-2">
                <span>มีงานซ่อมระดับฉุกเฉินวิกฤต (Critical) จำนวน {criticalTickets.length} รายการ</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-red-600 text-white font-medium">
                  กระทบการรักษา
                </span>
              </h2>
              <p className="text-xs text-red-700 mt-0.5">
                {criticalTickets[0].department}: {criticalTickets[0].title}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedTicket(criticalTickets[0])}
            className="self-end sm:self-center px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition-colors shrink-0 shadow-xs flex items-center gap-1"
          >
            <span>จัดการงานนี้ทันที</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Card 1: Total & In Progress */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">งานซ่อมทั้งหมด</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">{totalTickets}</span>
            <span className="text-xs text-slate-400">รายการ</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-teal-500" />
            <span>รอดำเนินการ {pendingTickets} • กำลังซ่อม {inProgressTickets}</span>
          </div>
        </div>

        {/* Card 2: Approvals Waiting */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">รออนุมัติงบ/อะไหล่</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-amber-600">{approvalWaitTickets}</span>
            <span className="text-xs text-slate-400">รายการ</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>วงเงินเสนอซ่อม</span>
            <span className="font-semibold text-slate-700">4,850 ฿</span>
          </div>
        </div>

        {/* Card 3: Completion & Success Rate */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">ซ่อมสำเร็จแล้ว</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-600">{completedTickets}</span>
            <span className="text-xs text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
              {Math.round((completedTickets / Math.max(1, totalTickets)) * 100)}%
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            <span>เฉลี่ย MTTR: </span>
            <span className="font-medium text-slate-800">2.4 ชม./เคส</span>
          </div>
        </div>

        {/* Card 4: Satisfaction */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">ความพึงพอใจเฉลี่ย</span>
            <div className="p-2 rounded-xl bg-yellow-50 text-yellow-600">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">{avgSatisfaction}</span>
            <span className="text-xs text-slate-400">/ 5.00 ดาว</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 font-medium">
            ผ่านเกณฑ์มาตรฐาน HA รพ. (&gt;85%)
          </div>
        </div>

      </div>

      {/* Budget & Equipment Health Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Budget Status Widget */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-teal-600" />
                งบประมาณซ่อมบำรุง IT ปี {hospitalInfo.fiscalYear}
              </h2>
              <span className="text-xs font-semibold text-teal-700">{budgetPercentage}%</span>
            </div>
            
            <div className="mt-4">
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${budgetPercentage}%` }}
                />
              </div>
            </div>

            <div className="mt-3 flex justify-between items-center text-xs">
              <span className="text-slate-500">ใช้ไปแล้ว: <strong className="text-slate-800">{totalActualCost.toLocaleString()} บาท</strong></span>
              <span className="text-slate-500">วงเงินทั้งหมด: <strong className="text-slate-800">{hospitalInfo.budgetAllocated.toLocaleString()} บาท</strong></span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">งบประมาณคงเหลือ</span>
            <span className="font-bold text-emerald-700">
              {(hospitalInfo.budgetAllocated - totalActualCost).toLocaleString()} บาท
            </span>
          </div>
        </div>

        {/* Top Broken Departments */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-indigo-600" />
              แผนกที่มีการแจ้งซ่อมสูงสุด
            </h2>
            <span className="text-[11px] text-slate-400">สถิติ 30 วัน</span>
          </div>

          <div className="space-y-2">
            {topDepts.map(([dept, count], idx) => (
              <div key={dept} className="flex items-center justify-between text-xs py-1 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-semibold">
                    {idx + 1}
                  </span>
                  <span className="text-slate-700 font-medium truncate max-w-[170px]">{dept}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-700 text-[11px]">
                  {count} งาน
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment Asset Health */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Laptop className="w-4 h-4 text-teal-600" />
                สถานะครุภัณฑ์คอมพิวเตอร์ทั้งหมด
              </h2>
              <span className="text-xs font-semibold text-slate-700">{assets.length} ชิ้น</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
                <p className="text-[11px] text-emerald-800 font-medium">พร้อมใช้งานปกติ</p>
                <p className="text-lg font-bold text-emerald-700">
                  {assets.filter(a => a.status === 'active').length}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100">
                <p className="text-[11px] text-rose-800 font-medium">อยู่ระหว่างซ่อม</p>
                <p className="text-lg font-bold text-rose-700">
                  {assets.filter(a => a.status === 'under_repair').length}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">ระบบสำรองข้อมูล Cloud</span>
            <span className="text-teal-600 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-teal-500" /> ซิงค์อัตโนมัติ
            </span>
          </div>
        </div>

      </div>

      {/* Recent Work Orders Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-800">
              รายการแจ้งซ่อมล่าสุด (Recent Repair Tickets)
            </h2>
            <p className="text-xs text-slate-400">
              แสดงรายการงานซ่อมล่าสุดที่ส่งเข้ามาในระบบ
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('tickets')}
            className="text-xs text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1 hover:underline"
          >
            <span>ดูทั้งหมด ({tickets.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tickets List */}
        <div className="divide-y divide-slate-100 overflow-x-auto">
          {tickets.slice(0, 5).map((ticket) => {
            const statusConfig = statusBadges[ticket.status] || statusBadges.pending;
            const priorityConfig = priorityBadges[ticket.priority] || priorityBadges.medium;

            return (
              <div 
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className="p-4 sm:px-5 hover:bg-slate-50/80 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800">
                      {ticket.id}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${priorityConfig.className}`}>
                      {priorityConfig.label}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusConfig.className}`}>
                      {statusConfig.label}
                    </span>
                    <span className="text-[11px] text-slate-400 hidden sm:inline">
                      {ticket.department}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                    {ticket.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                    <span className="text-teal-700 font-medium">
                      ครุภัณฑ์: {ticket.assetName} ({ticket.assetCode})
                    </span>
                    <span>ผู้แจ้ง: {ticket.requesterName}</span>
                    <span>
                      {new Date(ticket.createdAt).toLocaleDateString('th-TH', {
                        day: 'numeric',
                        month: 'short',
                        year: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setTicketToPrint(ticket)}
                    className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                    title="พิมพ์ใบแจ้งซ่อม"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedTicket(ticket)}
                    className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-medium transition-colors"
                  >
                    ดูรายละเอียด
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
