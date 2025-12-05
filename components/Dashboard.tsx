
import React from 'react';
import { CaseFile, CaseStatus, UserRole } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Search, Filter } from 'lucide-react';

interface DashboardProps {
  cases: CaseFile[];
  role: UserRole;
  onSelectCase: (c: CaseFile) => void;
}

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#6366f1', '#8b5cf6'];

export const Dashboard: React.FC<DashboardProps> = ({ cases, role, onSelectCase }) => {
  
  // Calculate Stats
  const statusStats = [
    { name: 'جديد', value: cases.filter(c => c.status === CaseStatus.NEW).length },
    { name: 'قيد الدراسة', value: cases.filter(c => c.status === CaseStatus.UNDER_REVIEW).length },
    { name: 'تم الفصل', value: cases.filter(c => c.status === CaseStatus.RESOLVED).length },
  ];

  const categoryStats = Array.from(new Set(cases.map(c => c.category))).map(cat => ({
    name: cat,
    value: cases.filter(c => c.category === cat).length
  }));

  // Filter cases logic for view
  const displayCases = cases.filter(c => {
    if (role === UserRole.STUDENT) return c.plaintiff.includes('طالب') || c.plaintiff === "أحمد محمد (طالب)"; // Simulating current user check
    if (role === UserRole.LAWYER) return true; // Lawyer sees all assigned (mock: sees all for demo)
    return true; // President sees all
  });

  return (
    <div className="space-y-8">
      
      {/* President & Lawyer Stats View */}
      {role !== UserRole.STUDENT && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <h3 className="text-slate-500 text-sm font-medium">إجمالي القضايا</h3>
            <p className="text-3xl font-bold text-slate-800 mt-2">{cases.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <h3 className="text-slate-500 text-sm font-medium">قيد الدراسة</h3>
            <p className="text-3xl font-bold text-amber-500 mt-2">
              {cases.filter(c => c.status === CaseStatus.UNDER_REVIEW).length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <h3 className="text-slate-500 text-sm font-medium">تم الفصل</h3>
            <p className="text-3xl font-bold text-green-500 mt-2">
              {cases.filter(c => c.status === CaseStatus.RESOLVED).length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <h3 className="text-slate-500 text-sm font-medium">تظلمات</h3>
            <p className="text-3xl font-bold text-blue-500 mt-2">
              {cases.filter(c => c.title.includes('تظلم')).length}
            </p>
          </div>
        </div>
      )}

      {/* Charts Section for President */}
      {role === UserRole.PRESIDENT && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-80">
            <h3 className="font-bold text-slate-800 mb-4">توزيع القضايا حسب الحالة</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-80">
             <h3 className="font-bold text-slate-800 mb-4">القضايا حسب التصنيف</h3>
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={categoryStats}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
                 <XAxis dataKey="name" />
                 <YAxis />
                 <Tooltip />
                 <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={40} />
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Case List Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="font-bold text-lg text-slate-800">
            {role === UserRole.STUDENT ? 'ملفاتي وقضاياي' : 'سجل القضايا الواردة'}
          </h3>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="بحث برقم القضية أو العنوان..." 
                className="w-full pl-4 pr-10 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
            <button className="bg-slate-100 hover:bg-slate-200 p-2 rounded-lg border border-slate-200 transition-colors">
              <Filter className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 text-slate-600 text-sm font-medium">
              <tr>
                <th className="px-6 py-4">رقم القضية</th>
                <th className="px-6 py-4">العنوان</th>
                <th className="px-6 py-4">التصنيف</th>
                <th className="px-6 py-4">المدعي</th>
                <th className="px-6 py-4">تاريخ الإحالة</th>
                <th className="px-6 py-4">الحالة</th>
                <th className="px-6 py-4">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayCases.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-mono text-sm text-slate-500">{c.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{c.title}</td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">{c.category}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{c.plaintiff}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{c.referralDate}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                      c.status === CaseStatus.RESOLVED ? 'bg-green-100 text-green-700' :
                      c.status === CaseStatus.NEW ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => onSelectCase(c)}
                      className="text-amber-600 hover:text-amber-700 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      عرض التفاصيل
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {displayCases.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              لا توجد قضايا لعرضها حالياً
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
