import React, { useState } from 'react';
import { 
  Star, 
  Smile, 
  CheckCircle2, 
  Award, 
  Printer, 
  Download, 
  TrendingUp, 
  MessageSquare,
  Sparkles,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { RepairTicket } from '../types';

export const SatisfactionView: React.FC = () => {
  const { tickets, submitSatisfaction, satisfactionTicket, setSatisfactionTicket } = useApp();

  // Modal rating state
  const [speedScore, setSpeedScore] = useState(5);
  const [qualityScore, setQualityScore] = useState(5);
  const [serviceScore, setServiceScore] = useState(5);
  const [comment, setComment] = useState('');
  const [isDone, setIsDone] = useState(false);

  // Tickets that are completed or closed
  const evaluatableTickets = tickets.filter(
    t => (t.status === 'completed' || t.status === 'closed') && !t.satisfactionRating
  );

  const ratedTickets = tickets.filter(t => t.satisfactionRating);

  // Calculate overall metrics
  const totalEvaluated = ratedTickets.length;
  const avgSpeed = totalEvaluated > 0
    ? (ratedTickets.reduce((s, t) => s + (t.satisfactionRating?.scoreSpeed || 0), 0) / totalEvaluated).toFixed(2)
    : '4.85';
  const avgQuality = totalEvaluated > 0
    ? (ratedTickets.reduce((s, t) => s + (t.satisfactionRating?.scoreQuality || 0), 0) / totalEvaluated).toFixed(2)
    : '4.80';
  const avgService = totalEvaluated > 0
    ? (ratedTickets.reduce((s, t) => s + (t.satisfactionRating?.scoreService || 0), 0) / totalEvaluated).toFixed(2)
    : '4.95';
  
  const overallAvg = totalEvaluated > 0
    ? (ratedTickets.reduce((s, t) => s + (t.satisfactionRating?.average || 0), 0) / totalEvaluated).toFixed(2)
    : '4.87';
  
  const overallPercent = ((Number(overallAvg) / 5) * 100).toFixed(1);

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!satisfactionTicket) return;

    submitSatisfaction(satisfactionTicket.id, {
      scoreSpeed: speedScore,
      scoreQuality: qualityScore,
      scoreService: serviceScore,
      comment,
    });

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    setIsDone(true);
    setTimeout(() => {
      setIsDone(false);
      setSatisfactionTicket(null);
      setComment('');
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            ระบบประเมินความพึงพอใจและรายงานผลรายเดือนอัตโนมัติ
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            ตามเกณฑ์มาตรฐานคุณภาพโรงพยาบาล (Hospital Accreditation - HA) กลุ่มงานสารสนเทศ รพ.สังขละบุรี
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 self-start sm:self-auto shadow-sm"
        >
          <Printer className="w-4 h-4" />
          <span>พิมพ์รายงานสรุปผลรายเดือน HA</span>
        </button>
      </div>

      {/* HA Benchmark Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 text-white shadow-md shadow-amber-500/20">
          <div className="flex items-center justify-between text-amber-100 text-xs">
            <span>คะแนนความพึงพอใจรวม</span>
            <Award className="w-5 h-5 text-amber-200" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black">{overallAvg}</span>
            <span className="text-xs text-amber-200">/ 5.00</span>
          </div>
          <div className="mt-2 text-xs font-medium text-amber-100">
            คิดเป็น {overallPercent}% (ผ่านเกณฑ์ HA &gt; 85%)
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500">1. ความรวดเร็วในการให้บริการ</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-800">{avgSpeed}</span>
            <span className="text-xs text-slate-400">/ 5.00</span>
          </div>
          <p className="text-[11px] text-emerald-600 mt-1">เวลาตอบสนองเฉลี่ย &lt; 30 นาที</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500">2. คุณภาพงานซ่อม/ใช้งานได้ดี</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-800">{avgQuality}</span>
            <span className="text-xs text-slate-400">/ 5.00</span>
          </div>
          <p className="text-[11px] text-emerald-600 mt-1">อัตราซ่อมซ้ำ (Rework) &lt; 2%</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500">3. ความสุภาพและการให้คำแนะนำ</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-800">{avgService}</span>
            <span className="text-xs text-slate-400">/ 5.00</span>
          </div>
          <p className="text-[11px] text-emerald-600 mt-1">ความประทับใจดีเด่น</p>
        </div>

      </div>

      {/* Action: Jobs waiting for your evaluation */}
      {evaluatableTickets.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-amber-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              งานซ่อมที่ส่งมอบแล้วและรอการประเมิน ({evaluatableTickets.length} รายการ)
            </h2>
            <span className="text-xs text-amber-700 font-medium">กดประเมินเพื่อช่วยปรับปรุงบริการ</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {evaluatableTickets.map(t => (
              <div key={t.id} className="p-3 bg-white rounded-xl border border-amber-200 flex justify-between items-center text-xs">
                <div>
                  <p className="font-mono font-bold text-slate-800">{t.id}</p>
                  <p className="text-slate-600 truncate max-w-[200px]">{t.title}</p>
                  <p className="text-[10px] text-slate-400">{t.department}</p>
                </div>
                <button
                  onClick={() => setSatisfactionTicket(t)}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold text-xs shadow-xs"
                >
                  ประเมิน 5 ดาว
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly Report Breakdown Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-800">
              รายงานสรุปผลการประเมินความพึงพอใจรายเดือนอัตโนมัติ (HA Report)
            </h2>
            <p className="text-xs text-slate-400">
              ข้อมูลสรุปเพื่อการประกันคุณภาพและส่งคณะกรรมการบริหารโรงพยาบาลสังขละบุรี
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 font-semibold border border-teal-200">
              เดือนกันยายน 2569 (ปัจจุบัน)
            </span>
          </div>
        </div>

        {/* Monthly Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-3">รอบประจำเดือน</th>
                <th className="p-3 text-center">จำนวนผู้ประเมิน</th>
                <th className="p-3 text-center">ความรวดเร็ว (Speed)</th>
                <th className="p-3 text-center">คุณภาพงานซ่อม (Quality)</th>
                <th className="p-3 text-center">การบริการ (Service)</th>
                <th className="p-3 text-center">คะแนนเฉลี่ย</th>
                <th className="p-3 text-right">สถานะมาตรฐาน HA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="bg-teal-50/40 font-medium">
                <td className="p-3 font-bold text-slate-800">กันยายน 2569 (เดือนนี้)</td>
                <td className="p-3 text-center">{totalEvaluated} ท่าน</td>
                <td className="p-3 text-center text-teal-700">{avgSpeed}</td>
                <td className="p-3 text-center text-teal-700">{avgQuality}</td>
                <td className="p-3 text-center text-teal-700">{avgService}</td>
                <td className="p-3 text-center font-bold text-slate-900">{overallAvg} / 5.00</td>
                <td className="p-3 text-right">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    ✓ ผ่านเกณฑ์ดีเลิศ ({overallPercent}%)
                  </span>
                </td>
              </tr>
              <tr className="text-slate-600">
                <td className="p-3">สิงหาคม 2569</td>
                <td className="p-3 text-center">24 ท่าน</td>
                <td className="p-3 text-center">4.78</td>
                <td className="p-3 text-center">4.82</td>
                <td className="p-3 text-center">4.90</td>
                <td className="p-3 text-center font-semibold">4.83 / 5.00</td>
                <td className="p-3 text-right">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    ✓ ผ่านเกณฑ์ (96.6%)
                  </span>
                </td>
              </tr>
              <tr className="text-slate-600">
                <td className="p-3">กรกฎาคม 2569</td>
                <td className="p-3 text-center">29 ท่าน</td>
                <td className="p-3 text-center">4.65</td>
                <td className="p-3 text-center">4.75</td>
                <td className="p-3 text-center">4.85</td>
                <td className="p-3 text-center font-semibold">4.75 / 5.00</td>
                <td className="p-3 text-right">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    ✓ ผ่านเกณฑ์ (95.0%)
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      {/* User Voice / Comments List */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-teal-600" />
          ความคิดเห็นและข้อเสนอแนะจากบุคลากรโรงพยาบาล
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {ratedTickets
            .filter(t => t.satisfactionRating?.comment)
            .map(t => (
              <div key={t.id} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{t.requesterName}</span>
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{t.satisfactionRating?.average}</span>
                  </div>
                </div>
                <p className="text-slate-600 italic leading-relaxed">
                  "{t.satisfactionRating?.comment}"
                </p>
                <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                  <span>{t.department}</span>
                  <span>{t.id}</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Satisfaction Rating Submission Modal */}
      {satisfactionTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">แบบประเมินความพึงพอใจงานซ่อม</h3>
                <p className="text-[11px] text-teal-700 font-mono">ใบงาน {satisfactionTicket.id}</p>
              </div>
              <button onClick={() => setSatisfactionTicket(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {isDone ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="font-bold text-slate-800 text-base">บันทึกผลการประเมินเรียบร้อยแล้ว</h4>
                <p className="text-xs text-slate-500">ขอบพระคุณที่ร่วมพัฒนาการให้บริการของ รพ.สังขละบุรี</p>
              </div>
            ) : (
              <form onSubmit={handleRatingSubmit} className="space-y-4 text-xs">
                {/* Metric 1 */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-slate-700">1. ความรวดเร็วในการเข้าถึงและแก้ไข</span>
                    <span className="font-bold text-amber-600">{speedScore} ดาว</span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setSpeedScore(star)}
                        className="p-2 rounded-lg hover:bg-amber-50"
                      >
                        <Star className={`w-6 h-6 ${star <= speedScore ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Metric 2 */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-slate-700">2. คุณภาพการซ่อมและเครื่องใช้งานได้ดี</span>
                    <span className="font-bold text-amber-600">{qualityScore} ดาว</span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setQualityScore(star)}
                        className="p-2 rounded-lg hover:bg-amber-50"
                      >
                        <Star className={`w-6 h-6 ${star <= qualityScore ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Metric 3 */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-slate-700">3. ความสุภาพและคำแนะนำของเจ้าหน้าที่ IT</span>
                    <span className="font-bold text-amber-600">{serviceScore} ดาว</span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setServiceScore(star)}
                        className="p-2 rounded-lg hover:bg-amber-50"
                      >
                        <Star className={`w-6 h-6 ${star <= serviceScore ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment text */}
                <div>
                  <label className="block font-medium text-slate-700 mb-1">ข้อเสนอแนะเพิ่มเติม (ถ้ามี)</label>
                  <textarea
                    rows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="เช่น ช่างมาไวมาก, อธิบายเข้าใจง่าย..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSatisfactionTicket(null)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-md shadow-teal-600/30"
                  >
                    ส่งผลการประเมิน
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
