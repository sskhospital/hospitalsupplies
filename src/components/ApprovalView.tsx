import React, { useState } from 'react';
import { 
  CheckSquare, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  DollarSign, 
  Clock, 
  Printer, 
  Eye,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RepairTicket } from '../types';

export const ApprovalView: React.FC = () => {
  const { tickets, approveTicket, setSelectedTicket, setTicketToPrint, currentUser } = useApp();

  const [approvalNotes, setApprovalNotes] = useState('');
  const [activeApprovalTicket, setActiveApprovalTicket] = useState<RepairTicket | null>(null);

  const pendingApprovals = tickets.filter(
    t => (t.status === 'approved_wait' || t.needsApproval) && t.approvalStatus !== 'approved' && t.approvalStatus !== 'rejected'
  );

  const approvedHistory = tickets.filter(
    t => t.approvalStatus === 'approved' || t.approvalStatus === 'rejected'
  );

  const handleAction = (ticketId: string, approved: boolean) => {
    approveTicket(ticketId, approved, approvalNotes);
    setActiveApprovalTicket(null);
    setApprovalNotes('');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-purple-600" />
            ระบบพิจารณาอนุมัติการซ่อมและเบิกจ่ายงบประมาณ
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            สำหรับหัวหน้ากลุ่มงานดิจิทัลและผู้อำนวยการโรงพยาบาลสังขละบุรี • รอดำเนินการ {pendingApprovals.length} รายการ
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4" />
          <span>สิทธิ์อนุมัติ: {currentUser.role === 'executive' ? 'ผู้อำนวยการ รพ.' : 'หัวหน้างาน IT'}</span>
        </div>
      </div>

      {/* Pending Approvals Queue */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <span>รายการที่รอการพิจารณาอนุมัติ (Pending Approvals)</span>
          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs">
            {pendingApprovals.length}
          </span>
        </h2>

        {pendingApprovals.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200/80 text-center text-slate-400 space-y-2">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 opacity-60" />
            <p className="text-sm font-medium text-slate-700">ไม่มีรายการค้างรออนุมัติในขณะนี้</p>
            <p className="text-xs">รายการขออนุมัติค่าอะไหล่หรืองานซ่อมพิเศษได้รับการพิจารณาครบถ้วนแล้ว</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingApprovals.map((ticket) => {
              const estimatedTotal = (ticket.partsUsed || []).reduce((s, p) => s + (p.unitPrice * p.quantity), 0) || ticket.estimatedCost;

              return (
                <div
                  key={ticket.id}
                  className="bg-white rounded-2xl border-2 border-amber-200 p-5 shadow-xs hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-sm font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                        {ticket.id}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                        รอการพิจารณาอนุมัติ
                      </span>
                      <span className="text-xs text-slate-400 hidden sm:inline">
                        แจ้งเมื่อ: {new Date(ticket.createdAt).toLocaleDateString('th-TH')}
                      </span>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs text-slate-500">วงเงินงบประมาณที่ขอเบิก: </span>
                      <span className="text-base font-bold text-rose-600 font-mono">
                        {estimatedTotal.toLocaleString()} บาท
                      </span>
                    </div>
                  </div>

                  {/* Body details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <p className="font-bold text-slate-800 text-sm">{ticket.title}</p>
                      <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        {ticket.description}
                      </p>
                      <div className="text-slate-500 text-[11px] pt-1">
                        <span>หน่วยงาน: <strong>{ticket.department}</strong> ({ticket.location})</span>
                        <br />
                        <span>ผู้แจ้ง: {ticket.requesterName} (โทร. {ticket.requesterPhone})</span>
                      </div>
                    </div>

                    <div className="space-y-2 bg-purple-50/40 p-3 rounded-xl border border-purple-100">
                      <p className="font-semibold text-purple-900 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-purple-600" />
                        ความเห็นและรายการอะไหล่ที่ช่างเทคนิคเสนอขอเบิก
                      </p>
                      
                      <p className="text-[11px] text-slate-700 italic">
                        "{ticket.technicianNotes || 'เสนอเปลี่ยนชิ้นส่วนเนื่องจากเสื่อมสภาพตามอายุการใช้งาน เพื่อความปลอดภัยของระบบโรงพยาบาล'}"
                      </p>

                      <div className="border border-purple-200 rounded-lg overflow-hidden bg-white">
                        <table className="w-full text-left text-[11px]">
                          <thead className="bg-purple-50/80 text-purple-900 border-b border-purple-100">
                            <tr>
                              <th className="p-1.5">อะไหล่ที่ขอเบิก</th>
                              <th className="p-1.5 text-center">จำนวน</th>
                              <th className="p-1.5 text-right">รวมเงิน</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {ticket.partsUsed.map(p => (
                              <tr key={p.partId}>
                                <td className="p-1.5">{p.name}</td>
                                <td className="p-1.5 text-center">{p.quantity}</td>
                                <td className="p-1.5 text-right font-medium">{(p.unitPrice * p.quantity).toLocaleString()} ฿</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Decision Actions */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-medium flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>ดูประวัติเครื่อง</span>
                      </button>
                      <button
                        onClick={() => setTicketToPrint(ticket)}
                        className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-medium flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>พิมพ์ใบเสนอราคา</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const reason = prompt('ระบุเหตุผลที่ไม่อนุมัติ (ถ้ามี):', 'ให้พิจารณาใช้เครื่องสำรอง หรือส่งซ่อมศูนย์บริการภายนอก');
                          if (reason !== null) {
                            handleAction(ticket.id, false);
                          }
                        }}
                        className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>ไม่อนุมัติ / ส่งคืน</span>
                      </button>

                      <button
                        onClick={() => {
                          const note = prompt('ระบุคำสั่งการหรือข้อกำหนดเพิ่มเติม (ถ้ามี):', 'อนุมัติเบิกจ่ายจากงบซ่อมบำรุง IT ปี 2569 ตามระเบียบพัสดุ');
                          if (note !== null) {
                            approveTicket(ticket.id, true, note);
                          }
                        }}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-emerald-600/30 flex items-center gap-1.5 transition-transform active:scale-95"
                      >
                        <Check className="w-4 h-4" />
                        <span>อนุมัติการซ่อมและเบิกจ่าย</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Approval History Archive */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-slate-800">
          ประวัติการพิจารณาอนุมัติที่ผ่านมา (Approval History)
        </h2>

        <div className="divide-y divide-slate-100 text-xs">
          {approvedHistory.slice(0, 5).map(t => (
            <div key={t.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-800">{t.id}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    t.approvalStatus === 'approved' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {t.approvalStatus === 'approved' ? '✓ อนุมัติแล้ว' : '✗ ไม่อนุมัติ'}
                  </span>
                  <span className="text-slate-500 font-medium">{t.assetName}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  ผู้อนุมัติ: {t.approvedBy || '-'} • ข้อคิดเห็น: {t.approvalNotes || '-'}
                </p>
              </div>

              <div className="text-right font-mono text-slate-700 font-medium">
                {t.actualCost || t.estimatedCost} ฿
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
