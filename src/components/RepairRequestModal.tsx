import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  Search, 
  Send, 
  AlertCircle, 
  Laptop, 
  Check, 
  Printer,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Priority, ComputerAsset, RepairTicket } from '../types';
import { DEPARTMENTS } from '../data/mockData';

interface RepairRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RepairRequestModal: React.FC<RepairRequestModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { assets, currentUser, addTicket, setTicketToPrint, lineConfig } = useApp();

  const [assetSearch, setAssetSearch] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<ComputerAsset | null>(null);
  
  const [customAssetCode, setCustomAssetCode] = useState('');
  const [customAssetName, setCustomAssetName] = useState('');
  const [department, setDepartment] = useState(currentUser.department || DEPARTMENTS[0]);
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [symptomType, setSymptomType] = useState<'hardware' | 'software' | 'network' | 'printer' | 'other'>('hardware');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requesterName, setRequesterName] = useState(currentUser.name);
  const [requesterPhone, setRequesterPhone] = useState(currentUser.phone);

  const [createdTicket, setCreatedTicket] = useState<RepairTicket | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Filter assets for autocomplete
  const filteredAssets = assetSearch.trim()
    ? assets.filter(a => 
        a.assetCode.toLowerCase().includes(assetSearch.toLowerCase()) ||
        a.name.toLowerCase().includes(assetSearch.toLowerCase()) ||
        a.serialNumber.toLowerCase().includes(assetSearch.toLowerCase())
      )
    : [];

  const handleSelectAsset = (asset: ComputerAsset) => {
    setSelectedAsset(asset);
    setCustomAssetCode(asset.assetCode);
    setCustomAssetName(asset.name);
    setDepartment(asset.department);
    setLocation(`${asset.building} ${asset.floor} ${asset.room}`);
    setAssetSearch('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('กรุณาระบุอาการเสียหรือหัวข้อการแจ้งซ่อม');
      return;
    }

    setIsSubmitting(true);

    const assetCodeToUse = selectedAsset ? selectedAsset.assetCode : (customAssetCode || 'คร.รพ.สังขละบุรี-ชั่วคราว');
    const assetNameToUse = selectedAsset ? selectedAsset.name : (customAssetName || 'อุปกรณ์คอมพิวเตอร์');
    const assetIdToUse = selectedAsset ? selectedAsset.id : '';

    const newTicket = await addTicket({
      assetId: assetIdToUse,
      assetCode: assetCodeToUse,
      assetName: assetNameToUse,
      assetCategory: selectedAsset?.category || 'other',
      department,
      location: location || 'ภายในแผนก',
      requesterName: requesterName || currentUser.name,
      requesterPhone: requesterPhone || currentUser.phone,
      requesterUserId: currentUser.id,
      priority,
      title,
      description: description || 'ไม่มีรายละเอียดเพิ่มเติม',
      symptomType,
      partsUsed: [],
      estimatedCost: 0,
      needsApproval: false,
    });

    setIsSubmitting(false);
    setCreatedTicket(newTicket);
  };

  const handleResetAndClose = () => {
    setCreatedTicket(null);
    setSelectedAsset(null);
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-emerald-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-teal-200" />
            <div>
              <h2 className="text-base font-bold">แจ้งซ่อมครุภัณฑ์คอมพิวเตอร์ออนไลน์</h2>
              <p className="text-xs text-teal-100">ศูนย์เทคโนโลยีสารสนเทศ โรงพยาบาลสังขละบุรี</p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {createdTicket ? (
          /* Success Screen */
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>
            
            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                เปิดใบแจ้งซ่อมสำเร็จ
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">
                เลขที่ใบงาน: <span className="text-teal-700 font-mono">{createdTicket.id}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                ระบบได้ส่งการแจ้งเตือนไปยังช่างเทคนิคผ่านระบบและ LINE Notify เรียบร้อยแล้ว ท่านสามารถพิมพ์ใบส่งซ่อมเพื่อนำมาติดที่ตัวเครื่อง
              </p>
            </div>

            {/* Quick Preview Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-500">ครุภัณฑ์:</span>
                <span className="font-semibold text-slate-800">{createdTicket.assetName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">เลขรหัส:</span>
                <span className="font-mono text-slate-800">{createdTicket.assetCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">แผนก:</span>
                <span className="text-slate-800">{createdTicket.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">อาการเสีย:</span>
                <span className="text-slate-800 font-medium">{createdTicket.title}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                onClick={() => {
                  setTicketToPrint(createdTicket);
                  handleResetAndClose();
                }}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>พิมพ์ใบส่งซ่อม / สติกเกอร์ติดเครื่อง</span>
              </button>
              <button
                onClick={handleResetAndClose}
                className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm"
              >
                เสร็จสิ้น / ปิดหน้าต่าง
              </button>
            </div>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            
            {/* Asset Selection Section */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                1. เลือกครุภัณฑ์จากระบบ หรือค้นหาด้วยเลขครุภัณฑ์ / ซีเรียลนัมเบอร์
              </label>

              {selectedAsset ? (
                <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-teal-600 text-white">
                      <Laptop className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-teal-900">{selectedAsset.name}</p>
                      <p className="text-[11px] text-teal-700 font-mono">
                        เลขครุภัณฑ์: {selectedAsset.assetCode} • SN: {selectedAsset.serialNumber}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {selectedAsset.department} ({selectedAsset.building} {selectedAsset.room})
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedAsset(null)}
                    className="text-xs text-rose-600 hover:underline px-2 py-1"
                  >
                    เปลี่ยน
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="พิมพ์เลขครุภัณฑ์ (เช่น คร.7440...) หรือชื่ออุปกรณ์เพื่อค้นหา..."
                      value={assetSearch}
                      onChange={(e) => setAssetSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                    />
                  </div>

                  {filteredAssets.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-xl max-h-48 overflow-y-auto z-20 divide-y divide-slate-100">
                      {filteredAssets.map(asset => (
                        <div
                          key={asset.id}
                          onClick={() => handleSelectAsset(asset)}
                          className="p-2.5 hover:bg-teal-50 cursor-pointer text-xs transition-colors flex justify-between items-center"
                        >
                          <div>
                            <p className="font-semibold text-slate-800">{asset.name}</p>
                            <p className="text-[10px] font-mono text-teal-700">{asset.assetCode} • {asset.brand} {asset.model}</p>
                          </div>
                          <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                            {asset.department}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <input
                        type="text"
                        placeholder="หรือระบุเลขครุภัณฑ์เอง (ถ้าหาไม่พบ)"
                        value={customAssetCode}
                        onChange={(e) => setCustomAssetCode(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="ชื่ออุปกรณ์ (เช่น เครื่องพิมพ์ Brother, จอ Dell)"
                        value={customAssetName}
                        onChange={(e) => setCustomAssetName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Department & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  2. หน่วยงาน / แผนกที่ใช้งาน
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500/20"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  อาคาร / ชั้น / ห้อง
                </label>
                <input
                  type="text"
                  placeholder="เช่น อาคารอุบัติเหตุ ชั้น 1 โต๊ะพยาบาล"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            {/* Urgency & Symptom Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  3. ระดับความเร่งด่วนของงาน
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className={`w-full px-3 py-2 border rounded-xl text-xs font-medium ${
                    priority === 'critical' 
                      ? 'bg-red-50 border-red-300 text-red-700' 
                      : priority === 'high' 
                      ? 'bg-amber-50 border-amber-300 text-amber-800' 
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <option value="critical">🚨 ฉุกเฉินมาก (กระทบงานรักษาผู้ป่วย ER/OR/ICU)</option>
                  <option value="high">🔴 เร่งด่วน (ผู้ป่วยรอรับบริการ/จุดบริการหลัก)</option>
                  <option value="medium">🟡 ปกติ (มีเครื่องสำรองใช้งานได้)</option>
                  <option value="low">🟢 ต่ำ (งานทั่วไป/วางแผนล่วงหน้า)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ประเภทอาการเสีย
                </label>
                <select
                  value={symptomType}
                  onChange={(e) => setSymptomType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="hardware">ฮาร์ดแวร์ / เครื่องเปิดไม่ติด / ดับเอง</option>
                  <option value="printer">เครื่องพิมพ์ / ฉลากยา / บาร์โค้ด / หมึก</option>
                  <option value="network">ระบบเครือข่ายอินเทอร์เน็ต / LAN / Wi-Fi</option>
                  <option value="software">ระบบสารสนเทศ รพ. / HOSxP / Windows</option>
                  <option value="other">อุปกรณ์เสริมอื่นๆ (UPS, Scan, เมาส์)</option>
                </select>
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  4. อาการเสียที่พบ (สั้นๆ กระชับ) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น เปิดไม่ติด มีกลิ่นไหม้, พิมพ์สติกเกอร์ยาไม่ชัดเจน, ต่อสาย LAN แล้วไม่มีสัญญาณ"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  รายละเอียดเพิ่มเติม (พฤติกรรมก่อนเกิดเหตุ, ข้อความแจ้งเตือน Error)
                </label>
                <textarea
                  rows={3}
                  placeholder="เช่น เกิดขึ้นหลังจากไฟกระพริบเมื่อเช้า, มีหน้าต่างเตือน Error Code 0x000000..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            {/* Contact Person */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  ชื่อผู้ประสานงาน / ผู้แจ้ง
                </label>
                <input
                  type="text"
                  value={requesterName}
                  onChange={(e) => setRequesterName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  เบอร์โทรศัพท์ติดต่อกลับ / เบอร์ภายใน
                </label>
                <input
                  type="text"
                  value={requesterPhone}
                  onChange={(e) => setRequesterPhone(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* LINE Notify Alert Note */}
            {lineConfig.enabled && (
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-[11px] text-emerald-800 flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  ระบบจะส่งข้อความแจ้งเตือนอัตโนมัติเข้า <strong>{lineConfig.targetGroup}</strong> ทันทีที่กดส่ง
                </span>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-teal-600/30 transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>ส่งข้อมูลแจ้งซ่อม</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
