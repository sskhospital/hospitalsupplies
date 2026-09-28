import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  Sparkles, 
  Printer, 
  Download, 
  FileSpreadsheet, 
  Building, 
  Laptop,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BudgetAnalyticsView: React.FC = () => {
  const { assets, tickets, hospitalInfo, currentUser } = useApp();

  // Find assets recommended for replacement
  const replacementCandidates = assets.filter(a => {
    const costRatio = a.totalRepairCost / (a.purchasePrice || 1);
    return costRatio >= 0.45 || a.totalRepairCount >= 4;
  });

  // Calculate current year spending
  const totalActualCost = tickets.reduce((s, t) => s + (t.actualCost || 0), 0);
  const remainingBudget = hospitalInfo.budgetAllocated - totalActualCost;

  // Department cost breakdown
  const deptCostMap: Record<string, number> = {};
  tickets.forEach(t => {
    deptCostMap[t.department] = (deptCostMap[t.department] || 0) + (t.actualCost || 0);
  });
  const deptCosts = Object.entries(deptCostMap).sort((a, b) => b[1] - a[1]);

  // Projected budget for next fiscal year (2570)
  const projectedNextYearBudget = Math.round(hospitalInfo.budgetAllocated * 1.08); // +8% inflation & expansion
  const estimatedSavingIfReplaced = replacementCandidates.reduce((s, a) => s + (a.totalRepairCost * 0.7), 0);

  const handleExportCsv = () => {
    const headers = 'เลขครุภัณฑ์,ชื่ออุปกรณ์,แผนก,ราคาจัดซื้อ(บาท),ค่าซ่อมสะสม(บาท),จำนวนครั้งที่ซ่อม,ข้อเสนอแนะ\n';
    const rows = assets.map(a => {
      const recommendation = (a.totalRepairCost / a.purchasePrice) >= 0.5 
        ? 'เสนอปลดระวาง/ซื้อทดแทนในปีงบประมาณ 2570' 
        : 'บำรุงรักษาตามรอบปกติ';
      return `"${a.assetCode}","${a.name}","${a.department}",${a.purchasePrice},${a.totalRepairCost},${a.totalRepairCount},"${recommendation}"`;
    }).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sangkhlaburi_budget_planning_${hospitalInfo.fiscalYear}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Executive Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200">
              Executive AI & Financial Analytics
            </span>
            <span className="text-xs text-slate-400">สำหรับผู้อำนวยการและผู้บริหารโรงพยาบาล</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-800 mt-1 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-600" />
            วิเคราะห์เชิงลึกเพื่อการวางแผนงบประมาณและการปลดระวางครุภัณฑ์
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            โรงพยาบาลสังขละบุรี • วิเคราะห์ TCO (Total Cost of Ownership) และคาดการณ์งบประมาณปี 2570
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>ส่งออกตาราง Excel/CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-teal-600/20"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์รายงานเสนอผู้บริหาร</span>
          </button>
        </div>
      </div>

      {/* Top 3 Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Budget Status */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs font-medium text-slate-500">งบประมาณซ่อมบำรุง IT ปี {hospitalInfo.fiscalYear}</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              {totalActualCost.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">/ {hospitalInfo.budgetAllocated.toLocaleString()} ฿</span>
          </div>
          
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-teal-500 h-full rounded-full" 
              style={{ width: `${Math.min(100, Math.round((totalActualCost / hospitalInfo.budgetAllocated) * 100))}%` }} 
            />
          </div>

          <div className="mt-2 text-[11px] text-slate-500 flex justify-between">
            <span>ใช้ไปแล้ว {Math.round((totalActualCost / hospitalInfo.budgetAllocated) * 100)}%</span>
            <span className="font-semibold text-emerald-600">เหลือ {remainingBudget.toLocaleString()} ฿</span>
          </div>
        </div>

        {/* Card 2: High Maintenance Alert */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs font-medium text-slate-500">ครุภัณฑ์ที่ควรเสนอซื้อทดแทน</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-rose-600">
              {replacementCandidates.length}
            </span>
            <span className="text-xs text-slate-400">เครื่อง (ค่าซ่อมเกิน 50%)</span>
          </div>
          <p className="mt-3 text-[11px] text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-100 leading-relaxed">
            หากจัดซื้อทดแทน จะประหยัดงบซ่อมจุกจิกได้ประมาณ <strong>{Math.round(estimatedSavingIfReplaced).toLocaleString()} บาท/ปี</strong>
          </p>
        </div>

        {/* Card 3: Forecast Next Year */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs font-medium text-slate-500">คาดการณ์กรอบงบประมาณปี 2570</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-indigo-700">
              {projectedNextYearBudget.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">บาท</span>
          </div>
          <p className="mt-3 text-[11px] text-indigo-900 bg-indigo-50 p-2 rounded-lg border border-indigo-100 leading-relaxed">
            คำนวณตามอัตราการขยายตัวของระบบสารสนเทศ (OPD Paperless, เครื่องอ่านสมาร์ทการ์ด)
          </p>
        </div>

      </div>

      {/* Critical Insight: High Maintenance Machines (Replacement Recommendation Table) */}
      <div className="bg-white rounded-2xl p-6 border-2 border-rose-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              รายงานวิเคราะห์ครุภัณฑ์ที่มีภาระค่าซ่อมสูง (High-Maintenance Assets)
            </h2>
            <p className="text-xs text-slate-500">
              ระบบตรวจพบอุปกรณ์ที่มีค่าซ่อมสะสมใกล้เคียงหรือเกินมูลค่าจัดซื้อเดิม สมควรเสนอปลดระวางและจัดซื้อทดแทน
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
            ข้อเสนอแนะสำหรับคำของบประมาณปี 2570
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-3">เลขครุภัณฑ์ / อุปกรณ์</th>
                <th className="p-3">หน่วยงานที่ใช้งาน</th>
                <th className="p-3 text-right">ราคาจัดซื้อเดิม</th>
                <th className="p-3 text-center">ความถี่ซ่อม</th>
                <th className="p-3 text-right">ค่าซ่อมสะสม</th>
                <th className="p-3 text-center">สัดส่วนค่าซ่อม</th>
                <th className="p-3 text-right">ข้อเสนอแนะเชิงนโยบาย</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {replacementCandidates.map(candidate => {
                const ratio = Math.round((candidate.totalRepairCost / candidate.purchasePrice) * 100);

                return (
                  <tr key={candidate.id} className="hover:bg-rose-50/40">
                    <td className="p-3">
                      <p className="font-bold text-slate-800">{candidate.name}</p>
                      <p className="font-mono text-[10px] text-teal-700">{candidate.assetCode} ({candidate.brand} {candidate.model})</p>
                    </td>
                    <td className="p-3 text-slate-700 font-medium">
                      {candidate.department}
                    </td>
                    <td className="p-3 text-right font-mono text-slate-600">
                      {candidate.purchasePrice.toLocaleString()} ฿
                    </td>
                    <td className="p-3 text-center font-bold text-rose-700">
                      {candidate.totalRepairCount} ครั้ง
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-rose-600">
                      {candidate.totalRepairCost.toLocaleString()} ฿
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                        {ratio}%
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <span className="font-semibold text-rose-700 text-[11px]">
                        ★ เสนอปลดระวางและตั้งงบจัดซื้อใหม่
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Department Breakdown & Spare Parts Consumption */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Department Cost Center */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Building className="w-4 h-4 text-teal-600" />
              ค่าใช้จ่ายซ่อมบำรุงจำแนกตามแผนก (Cost Center)
            </h3>
            <span className="text-xs text-slate-400">หน่วย: บาท</span>
          </div>

          <div className="space-y-3">
            {deptCosts.slice(0, 6).map(([dept, cost]) => {
              const pct = totalActualCost > 0 ? Math.round((cost / totalActualCost) * 100) : 0;

              return (
                <div key={dept} className="space-y-1 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-700 truncate max-w-[240px]">{dept}</span>
                    <span className="text-slate-900 font-mono font-bold">{cost.toLocaleString()} ฿ ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-teal-600 h-full rounded-full" 
                      style={{ width: `${Math.max(5, pct)}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Future Budget Recommendations for Hospital Board */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            แนวทางการเพิ่มประสิทธิภาพการบริหารทรัพย์สิน รพ.สังขละบุรี
          </h3>

          <div className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
            <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-100 flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-teal-900 block font-semibold">1. สัญญาบำรุงรักษาเชิงป้องกัน (Preventive Maintenance - PM)</strong>
                <span>กำหนดทำความสะอาดเป่าฝุ่นและตรวจสอบแบตเตอรี่ UPS ทุก 3 เดือน สำหรับแผนกวิกฤต (ER, OR, LR, Lab) เพื่อยืดอายุการใช้งาน 30%</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-indigo-900 block font-semibold">2. การสำรองอะไหล่ส่วนกลาง (Centralized Spare Parts Stock)</strong>
                <span>สำรองหัวพิมพ์ความร้อน (Thermal Head) และแบตเตอรี่ UPS ไว้ที่ศูนย์ IT เพื่อลดเวลา Downtime ในช่วงวันหยุดราชการ</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-900 block font-semibold">3. บูรณาการ API ฐานข้อมูล HOSxP & ครุภัณฑ์</strong>
                <span>ซิงค์ข้อมูลรหัสพัสดุกรมบัญชีกลางกับระบบฐานข้อมูล HIS อัตโนมัติ เพื่อการตัดจำหน่ายครุภัณฑ์ที่แม่นยำ</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
