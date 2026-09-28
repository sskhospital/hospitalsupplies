import React, { useState } from 'react';
import { 
  Laptop, 
  Search, 
  Plus, 
  QrCode, 
  Wrench, 
  History, 
  CheckCircle2, 
  AlertTriangle, 
  Printer, 
  Server, 
  X,
  Building,
  DollarSign,
  Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ComputerAsset } from '../types';
import { DEPARTMENTS } from '../data/mockData';

export const AssetManagementView: React.FC = () => {
  const { assets, addAsset, tickets, setSelectedTicket } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAssetForHistory, setSelectedAssetForHistory] = useState<ComputerAsset | null>(null);
  const [selectedAssetForQr, setSelectedAssetForQr] = useState<ComputerAsset | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Asset Form State
  const [newAssetCode, setNewAssetCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<any>('pc');
  const [newBrand, setNewBrand] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newSerial, setNewSerial] = useState('');
  const [newDepartment, setNewDepartment] = useState(DEPARTMENTS[0]);
  const [newBuilding, setNewBuilding] = useState('อาคารผู้ป่วยนอก (OPD)');
  const [newFloor, setNewFloor] = useState('ชั้น 1');
  const [newRoom, setNewRoom] = useState('ห้องตรวจ');
  const [newPrice, setNewPrice] = useState(24000);
  const [newSpecs, setNewSpecs] = useState('Core i5, RAM 16GB, SSD 512GB');

  const filteredAssets = assets.filter(a => {
    const matchSearch = 
      a.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchCat = categoryFilter === 'all' || a.category === categoryFilter;
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;

    return matchSearch && matchCat && matchStatus;
  });

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetCode || !newName) return;

    addAsset({
      assetCode: newAssetCode,
      name: newName,
      category: newCategory,
      brand: newBrand || 'HP',
      model: newModel || 'ProDesk',
      serialNumber: newSerial || `SN-${Date.now().toString().slice(-6)}`,
      department: newDepartment,
      building: newBuilding,
      floor: newFloor,
      room: newRoom,
      purchaseDate: new Date().toISOString().split('T')[0],
      warrantyExpiry: new Date(Date.now() + 3 * 365 * 86400000).toISOString().split('T')[0],
      purchasePrice: Number(newPrice),
      status: 'active',
      specs: newSpecs,
    });

    setShowAddModal(false);
    // Reset fields
    setNewAssetCode('');
    setNewName('');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
            <Laptop className="w-5 h-5 text-teal-600" />
            ทะเบียนครุภัณฑ์คอมพิวเตอร์ (IT Asset Inventory)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            โรงพยาบาลสังขละบุรี • ทะเบียนครุภัณฑ์พร้อมประวัติการซ่อมบำรุงและวิเคราะห์ความคุ้มค่า
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 self-start sm:self-auto transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มรายการครุภัณฑ์ใหม่</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="ค้นหาด้วย เลขครุภัณฑ์ (คร.7440...), ยี่ห้อ, รุ่น, แผนก, S/N..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            >
              <option value="all">-- ทุกประเภทอุปกรณ์ --</option>
              <option value="pc">เครื่องคอมพิวเตอร์ Desktop</option>
              <option value="aio">All-in-One PC</option>
              <option value="laptop">คอมพิวเตอร์โน้ตบุ๊ก</option>
              <option value="printer">เครื่องพิมพ์ / ฉลากยา</option>
              <option value="ups">เครื่องสำรองไฟฟ้า (UPS)</option>
              <option value="scanner">เครื่องสแกนเนอร์</option>
              <option value="network">อุปกรณ์เครือข่าย Switch/AP</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            >
              <option value="all">-- ทุกสถานะ --</option>
              <option value="active">พร้อมใช้งานปกติ</option>
              <option value="under_repair">อยู่ระหว่างการซ่อม</option>
              <option value="standby">เครื่องสำรอง</option>
              <option value="decommissioned">ปลดระวางแล้ว</option>
            </select>
          </div>

        </div>
      </div>

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssets.map((asset) => {
          const isHighCost = asset.totalRepairCost > (asset.purchasePrice * 0.5);
          const assetTickets = tickets.filter(t => t.assetId === asset.id || t.assetCode === asset.assetCode);

          return (
            <div
              key={asset.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                
                {/* Top Badge Row */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {asset.assetCode}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    asset.status === 'active' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : asset.status === 'under_repair'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {asset.status === 'active' ? '● ปกติ' : asset.status === 'under_repair' ? '● ซ่อมอยู่' : asset.status}
                  </span>
                </div>

                {/* Name & Brand */}
                <div>
                  <h3 className="text-sm font-bold text-slate-800 line-clamp-1">{asset.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {asset.brand} {asset.model} • S/N: {asset.serialNumber}
                  </p>
                </div>

                {/* Location & Specs */}
                <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 truncate">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-700 truncate">{asset.department}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 pl-5 truncate">
                    {asset.building} {asset.floor} {asset.room}
                  </p>
                  {asset.specs && (
                    <p className="text-[10px] text-slate-500 pl-5 truncate">
                      สเปก: {asset.specs}
                    </p>
                  )}
                </div>

                {/* Maintenance Cost Warning Pill */}
                {isHighCost && (
                  <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[10px] flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>
                      ค่าซ่อมสะสม ({asset.totalRepairCost.toLocaleString()} ฿) เกิน 50% ของราคาเครื่อง แนะนำเสนอซื้อทดแทน
                    </span>
                  </div>
                )}

                {/* Metrics row */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1 border-t border-slate-100">
                  <div className="bg-slate-50/80 p-1.5 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">ประวัติซ่อม</span>
                    <strong className="text-slate-800">{asset.totalRepairCount} ครั้ง</strong>
                  </div>
                  <div className="bg-slate-50/80 p-1.5 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">ค่าซ่อมสะสม</span>
                    <strong className="text-teal-700">{asset.totalRepairCost.toLocaleString()} ฿</strong>
                  </div>
                </div>

              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => setSelectedAssetForQr(asset)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
                  title="แสดง QR Code ติดเครื่อง"
                >
                  <QrCode className="w-4 h-4" />
                  <span className="text-[11px]">QR Tag</span>
                </button>

                <button
                  onClick={() => setSelectedAssetForHistory(asset)}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-medium"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>ดูประวัติ ({assetTickets.length})</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Asset Repair History Modal */}
      {selectedAssetForHistory && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">ประวัติการซ่อมบำรุงครุภัณฑ์</h3>
                <p className="text-xs text-teal-700 font-mono">
                  {selectedAssetForHistory.assetCode} - {selectedAssetForHistory.name}
                </p>
              </div>
              <button
                onClick={() => setSelectedAssetForHistory(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-xs">
              {tickets.filter(t => t.assetId === selectedAssetForHistory.id || t.assetCode === selectedAssetForHistory.assetCode).length === 0 ? (
                <p className="text-center text-slate-400 py-8">ไม่มีประวัติการแจ้งซ่อมสำหรับอุปกรณ์ชิ้นนี้</p>
              ) : (
                tickets
                  .filter(t => t.assetId === selectedAssetForHistory.id || t.assetCode === selectedAssetForHistory.assetCode)
                  .map(t => (
                    <div 
                      key={t.id}
                      onClick={() => {
                        setSelectedAssetForHistory(null);
                        setSelectedTicket(t);
                      }}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-teal-50 cursor-pointer transition-colors space-y-1"
                    >
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span className="font-mono font-bold text-slate-700">{t.id}</span>
                        <span>{new Date(t.createdAt).toLocaleDateString('th-TH')}</span>
                      </div>
                      <p className="font-semibold text-slate-800">{t.title}</p>
                      <div className="flex justify-between items-center text-[10px] text-slate-500">
                        <span>สถานะ: {t.status}</span>
                        <span className="text-teal-700 font-medium">ค่าใช้จ่าย: {t.actualCost.toLocaleString()} ฿</span>
                      </div>
                    </div>
                  ))
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedAssetForHistory(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Tag Modal */}
      {selectedAssetForQr && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="font-bold text-xs text-slate-700">สติกเกอร์ QR Tag ประจำเครื่อง</span>
              <button onClick={() => setSelectedAssetForQr(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* QR Mock Sticker */}
            <div className="border-2 border-dashed border-slate-400 p-4 rounded-xl bg-slate-50 space-y-2">
              <p className="font-bold text-xs text-slate-900">โรงพยาบาลสังขละบุรี</p>
              <p className="text-[10px] text-slate-500">ศูนย์คอมพิวเตอร์และสารสนเทศ โทร. 115</p>

              {/* QR Mock graphic */}
              <div className="w-32 h-32 mx-auto bg-white p-2 rounded-lg border border-slate-300 flex items-center justify-center shadow-xs">
                <div className="w-full h-full border-4 border-slate-900 grid grid-cols-6 grid-rows-6 gap-0.5 p-1">
                  <div className="bg-slate-900 col-span-2 row-span-2" />
                  <div className="bg-slate-900 col-span-2" />
                  <div className="bg-slate-900 col-span-2 row-span-2" />
                  <div className="bg-slate-900 col-span-1" />
                  <div className="bg-slate-900 col-span-2" />
                  <div className="bg-slate-900 col-span-2 row-span-2" />
                  <div className="bg-slate-900 col-span-1" />
                  <div className="bg-slate-900 col-span-2" />
                </div>
              </div>

              <p className="font-mono text-xs font-bold text-slate-900">{selectedAssetForQr.assetCode}</p>
              <p className="text-[11px] text-slate-700 font-medium truncate">{selectedAssetForQr.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{selectedAssetForQr.department}</p>
            </div>

            <div className="flex gap-2 justify-center">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>พิมพ์สติกเกอร์</span>
              </button>
              <button
                onClick={() => setSelectedAssetForQr(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-medium"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm">เพิ่มรายการครุภัณฑ์คอมพิวเตอร์ใหม่</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAsset} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">หมายเลขครุภัณฑ์ *</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น คร.7440-001-0230/69"
                    value={newAssetCode}
                    onChange={(e) => setNewAssetCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">ประเภทอุปกรณ์</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="pc">เครื่อง PC Desktop</option>
                    <option value="aio">All-in-One PC</option>
                    <option value="laptop">โน้ตบุ๊ก (Laptop)</option>
                    <option value="printer">เครื่องพิมพ์ (Printer)</option>
                    <option value="ups">เครื่องสำรองไฟ (UPS)</option>
                    <option value="network">สวิตช์เครือข่าย (Network)</option>
                    <option value="scanner">สแกนเนอร์ (Scanner)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">ชื่อรายการครุภัณฑ์ *</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น คอมพิวเตอร์ประมวลผลงานตรวจ OPD"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">ยี่ห้อ (Brand)</label>
                  <input
                    type="text"
                    placeholder="Dell, HP, Brother"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">รุ่น (Model)</label>
                  <input
                    type="text"
                    placeholder="OptiPlex 3080"
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Serial Number</label>
                  <input
                    type="text"
                    placeholder="SN-XXXXX"
                    value={newSerial}
                    onChange={(e) => setNewSerial(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">หน่วยงาน / แผนก</label>
                  <select
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">ราคาจัดซื้อ (บาท)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">คุณสมบัติเฉพาะ (Specs)</label>
                <input
                  type="text"
                  value={newSpecs}
                  onChange={(e) => setNewSpecs(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold"
                >
                  บันทึกลงทะเบียน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
