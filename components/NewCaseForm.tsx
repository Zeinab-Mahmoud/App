
import React, { useState } from 'react';
import { CaseCategory } from '../types';
import { Send } from 'lucide-react';

interface NewCaseFormProps {
  onSubmit: (data: any) => void;
  userRole: string;
}

export const NewCaseForm: React.FC<NewCaseFormProps> = ({ onSubmit, userRole }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: CaseCategory.GRIEVANCE,
    description: '',
    referralDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
        <h3 className="text-lg font-bold text-slate-800">تسجيل طلب / دعوى جديدة</h3>
        <p className="text-sm text-slate-500">يرجى ملء البيانات بدقة لضمان سرعة الإجراءات</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">عنوان الموضوع</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
            placeholder="مثال: تظلم من نتيجة مقرر..."
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">التصنيف</label>
            <select
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value as CaseCategory})}
            >
              {Object.values(CaseCategory).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">تاريخ تقديم الطلب</label>
            <input
              type="date"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              value={formData.referralDate}
              onChange={(e) => setFormData({...formData, referralDate: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">التفاصيل كاملة</label>
          <textarea
            required
            rows={5}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
            placeholder="اشرح تفاصيل المشكلة أو الطلب هنا..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-lg shadow-amber-500/20"
          >
            <Send className="w-4 h-4" />
            إرسال الطلب
          </button>
        </div>
      </form>
    </div>
  );
};
