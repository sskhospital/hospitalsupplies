import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Bell, 
  Check, 
  Smartphone, 
  Key, 
  ShieldCheck, 
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LineNotifyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LineNotifyModal: React.FC<LineNotifyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { lineConfig, updateLineConfig, sendMockLineNotify, lineNotifications } = useApp();

  const [token, setToken] = useState(lineConfig.token);
  const [targetGroup, setTargetGroup] = useState(lineConfig.targetGroup);
  const [notifyOnNew, setNotifyOnNew] = useState(lineConfig.notifyOnNewTicket);
  const [notifyOnStatus, setNotifyOnStatus] = useState(lineConfig.notifyOnStatusChange);
  const [notifyOnApproval, setNotifyOnApproval] = useState(lineConfig.notifyOnApprovalRequired);
  
  const [testMessage, setTestMessage] = useState(
    '🟢 [ทดสอบระบบ LINE Notify]\nศูนย์คอมพิวเตอร์ โรงพยาบาลสังขละบุรี\nระบบเชื่อมต่อพร้อมส่งการแจ้งเตือนงานซ่อมบำรุงแบบเรียลไทม์ 24 ชม.'
  );
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveSettings = () => {
    updateLineConfig({
      token,
      targetGroup,
      notifyOnNewTicket: notifyOnNew,
      notifyOnStatusChange: notifyOnStatus,
      notifyOnApprovalRequired: notifyOnApproval,
    });
    alert('บันทึกการตั้งค่า LINE Notify สำเร็จแล้ว');
  };

  const handleSendTest = () => {
    setIsSending(true);
    setTimeout(() => {
      sendMockLineNotify(testMessage, 'test');
      setIsSending(false);
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 2000);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#00B900] px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white text-[#00B900] flex items-center justify-center font-black text-sm">
              LINE
            </div>
            <div>
              <h2 className="text-base font-bold">การตั้งค่าและการแจ้งเตือนผ่าน LINE Notify</h2>
              <p className="text-xs text-emerald-100">ศูนย์สารสนเทศ โรงพยาบาลสังขละบุรี</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-black/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          
          {/* Status Bar */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-semibold text-emerald-900">สถานะการเชื่อมต่อ: พร้อมใช้งาน (Active)</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-mono">SSL Encrypted</span>
          </div>

          {/* Configuration Form */}
          <div className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                LINE Notify Access Token
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Token สำหรับส่งข้อความเข้ากลุ่ม LINE ช่างเทคนิคและผู้บริหาร รพ.สังขละบุรี
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                กลุ่ม LINE เป้าหมาย (Target Room / Group)
              </label>
              <input
                type="text"
                value={targetGroup}
                onChange={(e) => setTargetGroup(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            {/* Notification triggers */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="block font-bold text-slate-700">เงื่อนไขการส่งแจ้งเตือนอัตโนมัติ</label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyOnNew}
                  onChange={(e) => setNotifyOnNew(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-slate-700">แจ้งเตือนทันทีเมื่อมีรายการแจ้งซ่อมใหม่ (New Repair Ticket)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyOnStatus}
                  onChange={(e) => setNotifyOnStatus(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-slate-700">แจ้งเตือนเมื่อเปลี่ยนสถานะงาน (กำลังซ่อม, ซ่อมเสร็จ, ปิดงาน)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyOnApproval}
                  onChange={(e) => setNotifyOnApproval(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-slate-700">แจ้งเตือนผู้บริหารเมื่อมีคำขออนุมัติงบค่าอะไหล่</span>
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSaveSettings}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-900"
              >
                บันทึกการตั้งค่า Token
              </button>
            </div>
          </div>

          {/* Live LINE Simulator & Tester */}
          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200/80 space-y-3">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              กล่องทดสอบส่งข้อความและพรีวิวหน้าจอ LINE
            </h3>

            {/* Mock LINE Chat Bubble */}
            <div className="bg-[#7292ab] p-4 rounded-xl space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-[#00B900] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  LINE
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-white/90 font-medium">LINE Notify</span>
                  <div className="bg-white p-3 rounded-2xl rounded-tl-xs shadow-sm max-w-sm text-slate-800 text-xs whitespace-pre-line leading-relaxed font-sans">
                    {testMessage}
                  </div>
                  <span className="text-[9px] text-white/70 block pl-1">
                    {new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">แก้ไขข้อความทดสอบ:</label>
              <textarea
                rows={2}
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <button
              onClick={handleSendTest}
              disabled={isSending}
              className={`w-full py-2.5 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 shadow-sm ${
                sendSuccess 
                  ? 'bg-emerald-600' 
                  : 'bg-[#00B900] hover:bg-[#00a000] active:scale-98'
              }`}
            >
              {sendSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>ส่งการแจ้งเตือนสำเร็จแล้ว!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>ส่งข้อความทดสอบเข้า LINE ทันที</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
