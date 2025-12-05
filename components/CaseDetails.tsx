
import React, { useState } from 'react';
import { CaseFile, CaseStatus, UserRole } from '../types';
import { Clock, Calendar, User, FileText, CheckCircle, BrainCircuit, PenTool } from 'lucide-react';
import { summarizeCaseLegally, draftLegalOpinion } from '../services/geminiService';

interface CaseDetailsProps {
  caseData: CaseFile;
  currentUserRole: UserRole;
  onBack: () => void;
  onUpdateStatus: (id: string, status: CaseStatus) => void;
}

export const CaseDetails: React.FC<CaseDetailsProps> = ({ caseData, currentUserRole, onBack, onUpdateStatus }) => {
  const [aiLoading, setAiLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(caseData.aiSummary || null);
  const [draft, setDraft] = useState<string | null>(null);

  const handleSummarize = async () => {
    setAiLoading(true);
    const result = await summarizeCaseLegally(caseData);
    setSummary(result);
    setAiLoading(false);
  };

  const handleDraft = async () => {
    setAiLoading(true);
    const result = await draftLegalOpinion(caseData, "قبول الطلب شكلاً وموضوعاً");
    setDraft(result);
    setAiLoading(false);
  };

  const getStatusColor = (status: CaseStatus) => {
    switch (status) {
      case CaseStatus.NEW: return 'bg-blue-100 text-blue-800';
      case CaseStatus.UNDER_REVIEW: return 'bg-amber-100 text-amber-800';
      case CaseStatus.RESOLVED: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <button onClick={onBack} className="text-slate-500 hover:text-slate-800 flex items-center gap-2 mb-4">
        ← العودة للقائمة
      </button>

      {/* Header Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(caseData.status)}`}>
                {caseData.status}
              </span>
              <span className="text-slate-400 text-sm">#{caseData.id}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">{caseData.title}</h1>
            <div className="flex items-center gap-6 text-slate-500 text-sm">
              <span className="flex items-center gap-1"><User className="w-4 h-4" /> مقدم الطلب: {caseData.plaintiff}</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> تاريخ الإحالة: {caseData.referralDate}</span>
              {caseData.completionDate && (
                <span className="flex items-center gap-1 text-green-600"><CheckCircle className="w-4 h-4" /> تم الفصل: {caseData.completionDate}</span>
              )}
            </div>
          </div>
          
          {/* Action Buttons for Lawyer/President */}
          {currentUserRole !== UserRole.STUDENT && (
            <div className="flex flex-col gap-2">
               <button 
                onClick={handleSummarize}
                disabled={aiLoading}
                className="bg-purple-50 text-purple-700 hover:bg-purple-100 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors border border-purple-200"
              >
                <BrainCircuit className="w-4 h-4" />
                {aiLoading ? 'جاري التحليل...' : 'تلخيص ذكي للقضية'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-500" />
              تفاصيل الموضوع
            </h3>
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">
              {caseData.description}
            </p>
          </div>

          {/* AI Output Section */}
          {(summary || draft) && (
             <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl shadow-sm border border-purple-100">
                <h3 className="font-bold text-purple-800 mb-4 flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5" />
                  تحليلات الذكاء الاصطناعي (Gemini)
                </h3>
                {summary && (
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-purple-900 mb-2">الملخص التنفيذي:</h4>
                    <div className="bg-white/80 p-4 rounded-lg text-slate-700 text-sm border border-purple-100">
                      {summary}
                    </div>
                  </div>
                )}
                {draft && (
                   <div>
                    <h4 className="text-sm font-bold text-purple-900 mb-2">مسودة الرأي القانوني:</h4>
                    <div className="bg-white/80 p-4 rounded-lg text-slate-700 text-sm border border-purple-100 whitespace-pre-line">
                      {draft}
                    </div>
                  </div>
                )}
             </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
           {/* Actions Card */}
           {currentUserRole !== UserRole.STUDENT && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4">إجراءات إدارية</h3>
              
              <div className="space-y-3">
                 <div>
                   <label className="text-xs font-medium text-slate-500 mb-1 block">حالة الملف</label>
                   <select 
                    className="w-full p-2 border border-slate-300 rounded-md text-sm"
                    value={caseData.status}
                    onChange={(e) => onUpdateStatus(caseData.id, e.target.value as CaseStatus)}
                   >
                     {Object.values(CaseStatus).map(s => <option key={s} value={s}>{s}</option>)}
                   </select>
                 </div>
                 
                 <button 
                   onClick={handleDraft}
                   className="w-full bg-slate-800 text-white py-2 rounded-md text-sm hover:bg-slate-700 flex items-center justify-center gap-2"
                 >
                   <PenTool className="w-4 h-4" />
                   صياغة رأي قانوني
                 </button>
              </div>
            </div>
           )}

           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <h3 className="font-bold text-slate-800 mb-4">بيانات التتبع</h3>
             <ul className="space-y-4 text-sm">
               <li className="flex justify-between border-b pb-2">
                 <span className="text-slate-500">التصنيف</span>
                 <span className="font-medium">{caseData.category}</span>
               </li>
               <li className="flex justify-between border-b pb-2">
                 <span className="text-slate-500">تاريخ الإحالة</span>
                 <span className="font-medium">{caseData.referralDate}</span>
               </li>
               <li className="flex justify-between border-b pb-2">
                 <span className="text-slate-500">تاريخ الاستلام</span>
                 <span className="font-medium">{caseData.receiptDate || '-'}</span>
               </li>
               <li className="flex justify-between">
                 <span className="text-slate-500">المسؤول</span>
                 <span className="font-medium text-amber-600">{caseData.assignedLawyer || 'غير معين'}</span>
               </li>
             </ul>
           </div>
        </div>
      </div>
    </div>
  );
};
