import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Wrench, 
  Printer, 
  Eye, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Laptop, 
  PlusCircle,
  Building,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Priority, TicketStatus, RepairTicket } from '../types';
import { DEPARTMENTS } from '../data/mockData';

export const RepairListView: React.FC = () => {
  const { 
    tickets, 
    setSelectedTicket, 
    setTicketToPrint, 
    setSatisfactionTicket,
    currentUser 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');

  // Status badges
  const statusBadges: Record<TicketStatus, { label: string; className: string }> = {
    pending: { label: 'รอดำเนินการ', className: 'bg-amber-50 text-amber-700 border-amber-200' },
    approved_wait: { label: 'รออนุมัติงบ', className: 'bg-rose-50 text-rose-700 border-rose-200' },
    in_progress: { label: 'กำลังซ่อม', className: 'bg-blue-50 text-blue-700 border-blue-200' },
    waiting_parts: { label: 'รออะไหล่', className: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    completed: { label: 'ซ่อมเสร็จสิ้น', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    closed: { label: 'ปิดงานแล้ว', className: 'bg-slate-100 text-slate-700 border-slate-200' },
  };

  const priorityBadges: Record<Priority, { label: string; className: string }> = {
    critical: { label: '🚨 ฉุกเฉินมาก', className: 'bg-red-500 text-white font-semibold' },
    high: { label: '🔴 เร่งด่วน', className: 'bg-amber-500 text-white' },
    medium: { label: '🟡 ปกติ', className: 'bg-blue-500 text-white' },
    low: { label: '🟢 ต่ำ', className: 'bg-slate-400 text-white' },
  };

  // Filter logic
  const filteredTickets = tickets.filter(ticket => {
    // Search keyword
    const matchSearch = 
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.requesterName.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchStatus = statusFilter === 'all' || ticket.status === statusFilter;

    // Priority filter
    const matchPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;

    // Department filter
    const matchDept = deptFilter === 'all' || ticket.department === deptFilter;

    return matchSearch && matchStatus && matchPriority && matchDept;
  });

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setDeptFilter('all');
  };

  return (
    <div className="space-y-5 pb-12">
      
      {/* Header & Stats Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-teal-600" />
            ติดตามสถานะและประวัติงานแจ้งซ่อม
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            โรงพยาบาลสังขละบุรี • ทั้งหมด {tickets.length} รายการ (พบ {filteredTickets.length} รายการตามตัวกรอง)
          </p>
        </div>

        {/* Status Quick Pills */}
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setStatusFilter('pending')}
            className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors font-medium"
          >
            รอดำเนินการ ({tickets.filter(t => t.status === 'pending').length})
          </button>
          <button
            onClick={() => setStatusFilter('in_progress')}
            className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 transition-colors font-medium"
          >
            กำลังซ่อม ({tickets.filter(t => t.status === 'in_progress').length})
          </button>
          <button
            onClick={() => setStatusFilter('approved_wait')}
            className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 transition-colors font-medium"
          >
            รออนุมัติ ({tickets.filter(t => t.status === 'approved_wait').length})
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Search box */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="ค้นหาด้วย เลขที่ใบงาน, เลขครุภัณฑ์, อาการเสีย, แผนก, ผู้แจ้ง..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          {/* Status Select */}
          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            >
              <option value="all">-- สถานะทั้งหมด --</option>
              <option value="pending">รอดำเนินการ</option>
              <option value="approved_wait">รออนุมัติงบ/อะไหล่</option>
              <option value="in_progress">กำลังซ่อม</option>
              <option value="waiting_parts">รออะไหล่</option>
              <option value="completed">ซ่อมเสร็จสิ้น</option>
              <option value="closed">ปิดงานแล้ว</option>
            </select>
          </div>

          {/* Priority Select */}
          <div className="sm:col-span-2">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            >
              <option value="all">-- ทุกความเร่งด่วน --</option>
              <option value="critical">🚨 ฉุกเฉิน</option>
              <option value="high">🔴 เร่งด่วน</option>
              <option value="medium">🟡 ปกติ</option>
              <option value="low">🟢 ต่ำ</option>
            </select>
          </div>

          {/* Reset button */}
          <div className="sm:col-span-2 flex items-center">
            <button
              onClick={resetFilters}
              className="w-full py-2 px-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs text-slate-600 flex items-center justify-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ล้างตัวกรอง</span>
            </button>
          </div>

        </div>

        {/* Department Filter row */}
        <div className="flex items-center gap-2 text-xs overflow-x-auto pb-1">
          <span className="text-slate-400 shrink-0 flex items-center gap-1 font-medium">
            <Building className="w-3.5 h-3.5" /> แผนก:
          </span>
          <button
            onClick={() => setDeptFilter('all')}
            className={`px-2.5 py-1 rounded-lg shrink-0 transition-colors ${
              deptFilter === 'all' 
                ? 'bg-teal-600 text-white font-medium' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ทุกแผนก
          </button>
          {DEPARTMENTS.slice(0, 6).map((dept) => (
            <button
              key={dept}
              onClick={() => setDeptFilter(dept)}
              className={`px-2.5 py-1 rounded-lg shrink-0 transition-colors truncate max-w-[160px] ${
                deptFilter === dept 
                  ? 'bg-teal-600 text-white font-medium' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets List Table (Desktop & Tablet) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredTickets.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Wrench className="w-10 h-10 mx-auto opacity-40 text-teal-600" />
            <p className="text-sm font-medium text-slate-600">ไม่พบรายการแจ้งซ่อมที่ตรงกับเงื่อนไข</p>
            <p className="text-xs">ลองค้นหาด้วยคำอื่น หรือกดล้างตัวกรอง</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                <tr>
                  <th className="p-3 pl-4">เลขที่ / ความเร่งด่วน</th>
                  <th className="p-3">ครุภัณฑ์คอมพิวเตอร์</th>
                  <th className="p-3">อาการเสียที่ได้รับแจ้ง</th>
                  <th className="p-3">แผนก / ผู้แจ้ง</th>
                  <th className="p-3">สถานะงาน</th>
                  <th className="p-3">ช่างผู้รับผิดชอบ</th>
                  <th className="p-3 pr-4 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTickets.map((ticket) => {
                  const statusConf = statusBadges[ticket.status] || statusBadges.pending;
                  const priorityConf = priorityBadges[ticket.priority] || priorityBadges.medium;

                  return (
                    <tr 
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      {/* ID & Priority */}
                      <td className="p-3 pl-4">
                        <div className="space-y-1">
                          <span className="font-mono font-bold text-slate-800 text-xs">
                            {ticket.id}
                          </span>
                          <div>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${priorityConf.className}`}>
                              {priorityConf.label}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Asset */}
                      <td className="p-3">
                        <div className="space-y-0.5 max-w-[200px]">
                          <p className="font-semibold text-slate-800 truncate">{ticket.assetName}</p>
                          <p className="font-mono text-[10px] text-teal-700">{ticket.assetCode}</p>
                        </div>
                      </td>

                      {/* Issue */}
                      <td className="p-3">
                        <div className="max-w-[260px]">
                          <p className="font-medium text-slate-800 line-clamp-1">{ticket.title}</p>
                          <p className="text-[10px] text-slate-400 line-clamp-1">{ticket.description}</p>
                        </div>
                      </td>

                      {/* Dept & Requester */}
                      <td className="p-3">
                        <div>
                          <p className="text-slate-700 font-medium">{ticket.department}</p>
                          <p className="text-[10px] text-slate-400">{ticket.requesterName} (โทร. {ticket.requesterPhone})</p>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-3">
                        <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full border font-medium ${statusConf.className}`}>
                          {statusConf.label}
                        </span>
                      </td>

                      {/* Technician */}
                      <td className="p-3 text-slate-600">
                        {ticket.assignedTechnicianName ? (
                          <span className="font-medium text-slate-700">{ticket.assignedTechnicianName}</span>
                        ) : (
                          <span className="text-slate-400 italic">ยังไม่มอบหมาย</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="p-3 pr-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setTicketToPrint(ticket)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                            title="พิมพ์ใบงานซ่อม"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setSelectedTicket(ticket)}
                            className="p-1.5 rounded-lg text-teal-600 hover:text-teal-800 hover:bg-teal-50 transition-colors"
                            title="ดูรายละเอียด"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
