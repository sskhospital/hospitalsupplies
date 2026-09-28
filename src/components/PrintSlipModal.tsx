import React from 'react';
import { X, Printer, Download, Building2 } from 'lucide-react';
import { HospitalLogo } from './HospitalLogo';
import { RepairTicket } from '../types';
import { HOSPITAL_INFO } from '../data/mockData';

interface PrintSlipModalProps {
  ticket: RepairTicket | null;
  onClose: () => void;
}

export const PrintSlipModal: React.FC<PrintSlipModalProps> = ({
  ticket,
  onClose,
}) => {
  if (!ticket) return null;

  const handlePrint = () => {
    window.print();
  };

  const totalCost = (ticket.partsUsed || []).reduce((s, p) => s + (p.unitPrice * p.quantity), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 animate-in fade-in duration-150">
      
      {/* Top Floating Actions for Screen View */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 print:hidden">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-lg flex items-center gap-1.5 transition-transform active:scale-95"
        >
          <Printer className="w-4 h-4" />
          <span>สั่งพิมพ์เอกสาร (Print)</span>
        </button>
        <button
          onClick={onClose}
          className="p-2 bg-white/90 hover:bg-white text-slate-700 rounded-xl shadow-lg border border-slate-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Printable Sheet (A4 format) */}
      <div className="bg-white rounded-xl shadow-2xl print:shadow-none w-full max-w-[210mm] min-h-[297mm] p-8 sm:p-12 print:p-6 text-slate-800 font-['Sarabun',sans-serif] my-8 print:my-0 text-xs leading-normal">
        
        {/* Document Header */}
        <div className="border-b-2 border-slate-800 pb-4 mb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <HospitalLogo className="w-16 h-16 shrink-0" />
              <div>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  {HOSPITAL_INFO.nameTh} ({HOSPITAL_INFO.nameEn})
                </h1>
                <p className="text-xs text-slate-600">
                  {HOSPITAL_INFO.department} • กลุ่มงานดิจิทัลและเทคโนโลยีสารสนเทศ
                </p>
                <p className="text-[10px] text-slate-500">
                  {HOSPITAL_INFO.subDistrict} {HOSPITAL_INFO.district} {HOSPITAL_INFO.province} โทร. {HOSPITAL_INFO.phone}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="border border-slate-400 p-2 rounded-lg inline-block bg-slate-50 text-center">
                <p className="text-[10px] text-slate-500">เลขที่ใบงานซ่อม (Job No.)</p>
                <p className="font-mono text-sm font-bold text-slate-900 tracking-wider">
                  {ticket.id}
                </p>
                {/* Barcode Mock */}
                <div className="mt-1 font-mono tracking-widest text-[9px] text-slate-600 select-none">
                  ||||| | |||| ||| || ||||
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 text-center">
            <h2 className="text-sm font-bold uppercase underline tracking-wide">
              ใบแจ้งซ่อมและรายงานผลการบำรุงรักษาครุภัณฑ์คอมพิวเตอร์
            </h2>
            <p className="text-[11px] text-slate-500">
              (Computer Equipment Maintenance Work Order & Service Slip)
            </p>
          </div>
        </div>

        {/* Section 1: Requester & Equipment Data */}
        <div className="border border-slate-300 rounded-lg p-3 mb-4 space-y-2 bg-slate-50/40">
          <h3 className="font-bold text-[11px] text-slate-800 border-b border-slate-200 pb-1 flex justify-between">
            <span>1. ข้อมูลการแจ้งซ่อมและครุภัณฑ์ (Equipment & Ticket Info)</span>
            <span>ระดับความเร่งด่วน: <strong className="uppercase font-mono">{ticket.priority}</strong></span>
          </h3>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            <div>
              <span className="text-slate-500">หมายเลขครุภัณฑ์: </span>
              <strong className="font-mono text-slate-900">{ticket.assetCode}</strong>
            </div>
            <div>
              <span className="text-slate-500">ชื่ออุปกรณ์: </span>
              <strong className="text-slate-900">{ticket.assetName}</strong>
            </div>
            <div>
              <span className="text-slate-500">หน่วยงาน / แผนก: </span>
              <span className="text-slate-900">{ticket.department}</span>
            </div>
            <div>
              <span className="text-slate-500">สถานที่ติดตั้ง: </span>
              <span className="text-slate-900">{ticket.location}</span>
            </div>
            <div>
              <span className="text-slate-500">ผู้แจ้งซ่อม: </span>
              <span className="text-slate-900">{ticket.requesterName}</span>
            </div>
            <div>
              <span className="text-slate-500">เบอร์โทรศัพท์ติดต่อ: </span>
              <span className="text-slate-900 font-mono">{ticket.requesterPhone}</span>
            </div>
            <div>
              <span className="text-slate-500">วันที่แจ้งซ่อม: </span>
              <span>
                {new Date(ticket.createdAt).toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <div>
              <span className="text-slate-500">สถานะปัจจุบัน: </span>
              <span className="font-semibold text-slate-800 uppercase">{ticket.status}</span>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-200">
            <p className="text-slate-500 font-medium">อาการเสีย / ปัญหาที่ได้รับแจ้ง:</p>
            <p className="font-semibold text-slate-800 mt-0.5">{ticket.title}</p>
            <p className="text-slate-600 mt-0.5 text-[11px] leading-relaxed">{ticket.description}</p>
          </div>
        </div>

        {/* Section 2: Technical Diagnosis & Spare Parts */}
        <div className="border border-slate-300 rounded-lg p-3 mb-4 space-y-2">
          <h3 className="font-bold text-[11px] text-slate-800 border-b border-slate-200 pb-1">
            2. ผลการตรวจวินิจฉัยและการดำเนินการของช่าง (Diagnosis & Repair Actions)
          </h3>

          <div className="min-h-[40px] text-[11px] text-slate-700 leading-relaxed bg-slate-50/50 p-2 rounded border border-slate-200">
            {ticket.technicianNotes || 'เข้าดำเนินการตรวจเช็คอุปกรณ์ ทำความสะอาดระบบ ทดสอบสัญญาณ และตรวจสอบตามมาตรฐานความปลอดภัยทางคอมพิวเตอร์โรงพยาบาล'}
          </div>

          {/* Spare parts used */}
          <div className="mt-2">
            <p className="text-slate-600 font-semibold mb-1 text-[11px]">รายการวัสดุ/อะไหล่ที่ใช้เบิกเปลี่ยน:</p>
            <table className="w-full border-collapse border border-slate-300 text-[11px]">
              <thead className="bg-slate-100">
                <tr>
                  <th className="border border-slate-300 p-1 text-center w-10">ลำดับ</th>
                  <th className="border border-slate-300 p-1 text-left">รหัสและรายการอะไหล่</th>
                  <th className="border border-slate-300 p-1 text-center w-16">จำนวน</th>
                  <th className="border border-slate-300 p-1 text-right w-24">ราคา/หน่วย (บาท)</th>
                  <th className="border border-slate-300 p-1 text-right w-24">รวมเงิน (บาท)</th>
                </tr>
              </thead>
              <tbody>
                {ticket.partsUsed && ticket.partsUsed.length > 0 ? (
                  ticket.partsUsed.map((p, idx) => (
                    <tr key={idx}>
                      <td className="border border-slate-300 p-1 text-center">{idx + 1}</td>
                      <td className="border border-slate-300 p-1">{p.code} - {p.name}</td>
                      <td className="border border-slate-300 p-1 text-center">{p.quantity}</td>
                      <td className="border border-slate-300 p-1 text-right">{p.unitPrice.toLocaleString()}</td>
                      <td className="border border-slate-300 p-1 text-right font-medium">{(p.unitPrice * p.quantity).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="border border-slate-300 p-2 text-center text-slate-400">
                      ไม่มีการเบิกใช้อะไหล่สิ้นเปลือง
                    </td>
                  </tr>
                )}
                <tr className="bg-slate-50 font-bold">
                  <td colSpan={4} className="border border-slate-300 p-1 text-right">รวมค่าใช้จ่ายทั้งสิ้น:</td>
                  <td className="border border-slate-300 p-1 text-right font-mono">{totalCost.toLocaleString()} บาท</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Signatures & Approvals */}
        <div className="border border-slate-300 rounded-lg p-3 grid grid-cols-3 gap-3 text-center text-[10px] print:text-[9px]">
          
          {/* Box 1: Requester */}
          <div className="border border-slate-200 p-2 rounded flex flex-col justify-between h-28">
            <p className="font-semibold text-slate-700">ผู้ส่งซ่อม / รับเครื่องคืน</p>
            <div className="border-b border-dotted border-slate-400 mx-4" />
            <div>
              <p className="text-slate-800">({ticket.requesterName})</p>
              <p className="text-slate-400">วันที่ ...../...../.........</p>
            </div>
          </div>

          {/* Box 2: Technician */}
          <div className="border border-slate-200 p-2 rounded flex flex-col justify-between h-28">
            <p className="font-semibold text-slate-700">ช่างเทคนิคผู้ดำเนินการ</p>
            <div className="border-b border-dotted border-slate-400 mx-4" />
            <div>
              <p className="text-slate-800">({ticket.assignedTechnicianName || 'นายชานนท์ สังขละสุข'})</p>
              <p className="text-slate-400">วันที่ ...../...../.........</p>
            </div>
          </div>

          {/* Box 3: Supervisor / Approval */}
          <div className="border border-slate-200 p-2 rounded flex flex-col justify-between h-28">
            <p className="font-semibold text-slate-700">หัวหน้ากลุ่มงานดิจิทัล / ผู้อนุมัติ</p>
            <div className="border-b border-dotted border-slate-400 mx-4" />
            <div>
              <p className="text-slate-800">({ticket.approvedBy || 'นายอภิสิทธิ์ มั่นคง'})</p>
              <p className="text-slate-400">วันที่ ...../...../.........</p>
            </div>
          </div>

        </div>

        {/* Footnote */}
        <div className="mt-4 text-center text-[9px] text-slate-400 border-t border-slate-200 pt-2 flex justify-between">
          <span>ระบบสารสนเทศงานซ่อมบำรุง รพ.สังขละบุรี • พิมพ์เมื่อ: {new Date().toLocaleString('th-TH')}</span>
          <span>เอกสารทางการสำหรับการเบิกจ่ายพัสดุและตรวจสอบคุณภาพ HA</span>
        </div>

      </div>

    </div>
  );
};
