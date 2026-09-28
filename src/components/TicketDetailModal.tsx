import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Star, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Trash2, 
  AlertCircle, 
  UserCheck, 
  Send,
  Building,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RepairTicket, TicketStatus, SparePartItem } from '../types';

interface TicketDetailModalProps {
  ticket: RepairTicket | null;
  onClose: () => void;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  ticket,
  onClose,
}) => {
  const { 
    currentUser, 
    updateTicketStatus, 
    setTicketToPrint, 
    setSatisfactionTicket, 
    spareParts,
  } = useApp();

  const [techNotes, setTechNotes] = useState(ticket?.technicianNotes || '');
  const [selectedPartId, setSelectedPartId] = useState('');
  const [partQty, setPartQty] = useState(1);
  const [tempParts, setTempParts] = useState<SparePartItem[]>(ticket?.partsUsed || []);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!ticket) return null;

  const isTechOrAdmin = currentUser.role === 'technician' || currentUser.role === 'supervisor' || currentUser.role === 'executive';

  const statusMap: Record<TicketStatus, { label: string; color: string; step: number }> = {
    pending: { label: 'รอดำเนินการรับเรื่อง', color: 'bg-amber-100 text-amber-800 border-amber-300', step: 1 },
    approved_wait: { label: 'รออนุมัติงบ/อะไหล่', color: 'bg-rose-100 text-rose-800 border-rose-300', step: 2 },
    in_progress: { label: 'กำลังซ่อมบำรุง', color: 'bg-blue-100 text-blue-800 border-blue-300', step: 3 },
    waiting_parts: { label: 'รออะไหล่/จัดซื้อ', color: 'bg-indigo-100 text-indigo-800 border-indigo-300', step: 3 },
    completed: { label: 'ซ่อมเสร็จสิ้น / รอส่งมอบ', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', step: 4 },
    closed: { label: 'ปิดงานเรียบร้อยแล้ว', color: 'bg-slate-100 text-slate-800 border-slate-300', step: 5 },
  };

  const handleAddPart = () => {
    if (!selectedPartId) return;
    const partObj = spareParts.find(p => p.id === selectedPartId);
    if (!partObj) return;

    const existingIndex = tempParts.findIndex(p => p.partId === selectedPartId);
    if (existingIndex >= 0) {
      const updated = [...tempParts];
      updated[existingIndex].quantity += partQty;
      setTempParts(updated);
    } else {
      setTempParts([
        ...tempParts,
        {
          partId: partObj.id,
          name: partObj.name,
          code: partObj.code,
          quantity: partQty,
          unitPrice: partObj.unitPrice,
        }
      ]);
    }
    setSelectedPartId('');
    setPartQty(1);
  };

  const handleRemovePart = (partId: string) => {
    setTempParts(tempParts.filter(p => p.partId !== partId));
  };

  const handleStatusChange = (newStatus: TicketStatus) => {
    setIsUpdating(true);
    updateTicketStatus(ticket.id, newStatus, techNotes, tempParts);
    setIsUpdating(false);
  };

  const totalPartsCost = tempParts.reduce((sum, p) => sum + (p.unitPrice * p.quantity), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm sm:text-base font-bold text-teal-400 bg-slate-800 px-2.5 py-1 rounded-lg">
              {ticket.id}
            </span>
            <div>
              <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${statusMap[ticket.status].color}`}>
                {statusMap[ticket.status].label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTicketToPrint(ticket)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="พิมพ์ใบแจ้งซ่อม"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Workflow Stepper */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
              ขั้นตอนการดำเนินงาน (Work Progress Timeline)
            </p>
            <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
              <div className={`p-2 rounded-xl ${statusMap[ticket.status].step >= 1 ? 'bg-teal-600 text-white font-semibold' : 'bg-slate-200 text-slate-500'}`}>
                1. แจ้งซ่อม
              </div>
              <div className={`p-2 rounded-xl ${statusMap[ticket.status].step >= 2 ? 'bg-teal-600 text-white font-semibold' : 'bg-slate-200 text-slate-500'}`}>
                2. วินิจฉัย/อะไหล่
              </div>
              <div className={`p-2 rounded-xl ${statusMap[ticket.status].step >= 3 ? 'bg-teal-600 text-white font-semibold' : 'bg-slate-200 text-slate-500'}`}>
                3. ดำเนินการซ่อม
              </div>
              <div className={`p-2 rounded-xl ${statusMap[ticket.status].step >= 4 ? 'bg-emerald-600 text-white font-semibold' : 'bg-slate-200 text-slate-500'}`}>
                4. ส่งมอบ & ประเมิน
              </div>
            </div>
          </div>

          {/* Ticket Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Left Box: Issue & Asset */}
            <div className="p-4 rounded-xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-800 text-sm">{ticket.title}</h3>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {ticket.description}
              </p>
              
              <div className="pt-2 border-t border-slate-100 space-y-1 text-slate-500">
                <div className="flex justify-between">
                  <span>ครุภัณฑ์:</span>
                  <span className="font-semibold text-slate-800">{ticket.assetName}</span>
                </div>
                <div className="flex justify-between">
                  <span>เลขรหัสครุภัณฑ์:</span>
                  <span className="font-mono text-teal-700 font-semibold">{ticket.assetCode}</span>
                </div>
                <div className="flex justify-between">
                  <span>ประเภทอาการ:</span>
                  <span className="capitalize">{ticket.symptomType}</span>
                </div>
              </div>
            </div>

            {/* Right Box: Requester & Location */}
            <div className="p-4 rounded-xl border border-slate-200 space-y-2 bg-slate-50/50">
              <h4 className="font-bold text-slate-700 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-teal-600" />
                สถานที่และผู้แจ้งซ่อม
              </h4>

              <div className="space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">หน่วยงาน:</span>
                  <span className="font-medium text-slate-800">{ticket.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ห้อง/ชั้น:</span>
                  <span>{ticket.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ผู้แจ้ง:</span>
                  <span className="font-medium text-slate-800">{ticket.requesterName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">เบอร์โทรศัพท์:</span>
                  <span className="text-teal-700 font-semibold">{ticket.requesterPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">วันที่ส่งเรื่อง:</span>
                  <span>
                    {new Date(ticket.createdAt).toLocaleDateString('th-TH', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Satisfaction Evaluation section if already rated */}
          {ticket.satisfactionRating && (
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5 text-xs">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  ผลการประเมินความพึงพอใจโดยผู้ใช้บริการ
                </span>
                <span className="text-sm font-bold text-amber-800">
                  {ticket.satisfactionRating.average} / 5.00 คะแนน
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-1">
                <div className="bg-white/80 p-1.5 rounded-lg">
                  <p className="text-slate-400">ความรวดเร็ว</p>
                  <p className="font-bold text-slate-700">{ticket.satisfactionRating.scoreSpeed} / 5</p>
                </div>
                <div className="bg-white/80 p-1.5 rounded-lg">
                  <p className="text-slate-400">คุณภาพการซ่อม</p>
                  <p className="font-bold text-slate-700">{ticket.satisfactionRating.scoreQuality} / 5</p>
                </div>
                <div className="bg-white/80 p-1.5 rounded-lg">
                  <p className="text-slate-400">การให้บริการ/สุภาพ</p>
                  <p className="font-bold text-slate-700">{ticket.satisfactionRating.scoreService} / 5</p>
                </div>
              </div>
              {ticket.satisfactionRating.comment && (
                <p className="text-[11px] italic text-slate-600 bg-white/60 p-2 rounded-lg">
                  "{ticket.satisfactionRating.comment}"
                </p>
              )}
            </div>
          )}

          {/* Technician Section: Notes & Parts */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-teal-600" />
              การบันทึกการซ่อมและเบิกอะไหล่ (สำหรับเจ้าหน้าที่ IT)
            </h4>

            {/* Diagnosis Notes */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                บันทึกการตรวจวินิจฉัย / ขั้นตอนการแก้ไข / สาเหตุ
              </label>
              <textarea
                rows={2}
                disabled={!isTechOrAdmin}
                value={techNotes}
                onChange={(e) => setTechNotes(e.target.value)}
                placeholder="ระบุการตรวจเช็ค เช่น ทำความสะอาดช่องต่อ, เปลี่ยนแรม, อัปเดตไดรเวอร์..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-teal-500/20 disabled:opacity-75"
              />
            </div>

            {/* Spare Parts Replacement Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-600">
                  รายการอะไหล่ที่เบิกใช้ในงานนี้
                </label>
                <span className="text-teal-700 font-bold">
                  รวมมูลค่า: {totalPartsCost.toLocaleString()} บาท
                </span>
              </div>

              {isTechOrAdmin && (
                <div className="flex gap-2">
                  <select
                    value={selectedPartId}
                    onChange={(e) => setSelectedPartId(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="">-- เลือกอะไหล่จากคลัง IT รพ. --</option>
                    {spareParts.map((sp) => (
                      <option key={sp.id} value={sp.id} disabled={sp.stockQty <= 0}>
                        {sp.code}: {sp.name} ({sp.unitPrice.toLocaleString()} บ. | คงเหลือ {sp.stockQty} {sp.unit})
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={partQty}
                    onChange={(e) => setPartQty(parseInt(e.target.value) || 1)}
                    className="w-16 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-center"
                  />

                  <button
                    type="button"
                    onClick={handleAddPart}
                    className="px-3 py-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-1 font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>เพิ่ม</span>
                  </button>
                </div>
              )}

              {/* Parts Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="p-2">รายการอะไหล่</th>
                      <th className="p-2 text-center">จำนวน</th>
                      <th className="p-2 text-right">ราคา/หน่วย</th>
                      <th className="p-2 text-right">รวมเงิน</th>
                      {isTechOrAdmin && <th className="p-2 text-center">จัดการ</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tempParts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-3 text-center text-slate-400">
                          ไม่มีการใช้อะไหล่ (แก้ไขเชิงเทคนิค/ซอฟต์แวร์/ทำความสะอาด)
                        </td>
                      </tr>
                    ) : (
                      tempParts.map((part) => (
                        <tr key={part.partId}>
                          <td className="p-2 font-medium text-slate-800">{part.name}</td>
                          <td className="p-2 text-center">{part.quantity}</td>
                          <td className="p-2 text-right">{part.unitPrice.toLocaleString()} ฿</td>
                          <td className="p-2 text-right font-semibold text-slate-800">
                            {(part.unitPrice * part.quantity).toLocaleString()} ฿
                          </td>
                          {isTechOrAdmin && (
                            <td className="p-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemovePart(part.partId)}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Action Transitions for Technician */}
            {isTechOrAdmin && (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  ปรับเปลี่ยนสถานะใบงานซ่อม (Status Actions)
                </label>
                <div className="flex flex-wrap gap-2">
                  {ticket.status === 'pending' && (
                    <button
                      onClick={() => handleStatusChange('in_progress')}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>รับงานและเริ่มซ่อมแซม</span>
                    </button>
                  )}

                  {ticket.status !== 'approved_wait' && totalPartsCost > 1500 && !ticket.approvedBy && (
                    <button
                      onClick={() => handleStatusChange('approved_wait')}
                      className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>ส่งขออนุมัติงบค่าอะไหล่</span>
                    </button>
                  )}

                  {ticket.status === 'in_progress' && (
                    <button
                      onClick={() => handleStatusChange('waiting_parts')}
                      className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>ปรับเป็น "รออะไหล่สั่งซื้อ"</span>
                    </button>
                  )}

                  {ticket.status !== 'completed' && ticket.status !== 'closed' && (
                    <button
                      onClick={() => handleStatusChange('completed')}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>ซ่อมเสร็จสิ้น (ส่งมอบงาน)</span>
                    </button>
                  )}

                  {ticket.status === 'completed' && (
                    <button
                      onClick={() => handleStatusChange('closed')}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold shadow-xs"
                    >
                      ปิดงานซ่อมบำรุง
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Satisfaction Button for Requester */}
            {(ticket.status === 'completed' || ticket.status === 'closed') && !ticket.satisfactionRating && (
              <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-teal-900 text-xs">งานซ่อมเสร็จเรียบร้อยแล้ว</h4>
                  <p className="text-[11px] text-teal-700">
                    โปรดร่วมประเมินความพึงพอใจเพื่อนำไปพัฒนาคุณภาพการบริการตามเกณฑ์ HA
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSatisfactionTicket(ticket);
                    onClose();
                  }}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 shrink-0"
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>ประเมินความพึงพอใจ</span>
                </button>
              </div>
            )}

          </div>

          {/* Audit Trail Logs */}
          <div className="pt-3 border-t border-slate-100">
            <h4 className="font-bold text-slate-700 text-xs mb-2">
              ประวัติการบันทึกงาน (Audit Trail & Activity Log)
            </h4>
            <div className="space-y-2">
              {ticket.logs.map((log) => (
                <div key={log.id} className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-[11px]">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="font-semibold text-slate-700">{log.actor} ({log.actorRole})</span>
                    <span>
                      {new Date(log.timestamp).toLocaleDateString('th-TH', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-teal-700 font-medium mt-0.5">{log.action}</p>
                  {log.notes && <p className="text-slate-600 mt-0.5 italic">"{log.notes}"</p>}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            onClick={() => setTicketToPrint(ticket)}
            className="px-3 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-white text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>พิมพ์ใบส่งซ่อม (Print Sheet)</span>
          </button>
          
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-medium transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
