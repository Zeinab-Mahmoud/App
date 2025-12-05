
import React from 'react';
import { UserRole } from '../types';
import { Scale, FileText, User, LayoutDashboard, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentRole, onRoleChange, currentPage, onNavigate }) => {
  
  const getNavItems = () => {
    switch (currentRole) {
      case UserRole.PRESIDENT:
        return [
          { id: 'dashboard', label: 'لوحة القيادة', icon: LayoutDashboard },
          { id: 'all-cases', label: 'جميع القضايا', icon: FileText },
        ];
      case UserRole.LAWYER:
        return [
          { id: 'dashboard', label: 'قضاياي', icon: FileText },
          { id: 'drafts', label: 'المسودات', icon: Scale },
        ];
      case UserRole.STUDENT:
        return [
          { id: 'dashboard', label: 'تظلماتي', icon: FileText },
          { id: 'new-case', label: 'رفع طلب جديد', icon: Scale },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-slate-700 flex items-center gap-3">
          <div className="p-2 bg-amber-500 rounded-lg">
            <Scale className="w-6 h-6 text-slate-900" />
          </div>
          <div>
            <h1 className="text-xl font-bold">النظام القضائي</h1>
            <p className="text-xs text-slate-400">الإدارة القانونية</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {getNavItems().map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentPage === item.id ? 'bg-amber-500 text-slate-900 font-bold' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Role Switcher (For Demo Purpose) */}
        <div className="p-4 bg-slate-800 border-t border-slate-700">
          <p className="text-xs text-slate-400 mb-2">تغيير المستخدم (تجريبي):</p>
          <div className="flex flex-col gap-2">
            {(Object.values(UserRole) as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => onRoleChange(role)}
                className={`text-xs px-3 py-2 rounded border ${
                  currentRole === role 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'border-slate-600 text-slate-400 hover:text-white'
                }`}
              >
                الدخول كـ {role}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8">
          <h2 className="text-xl font-bold text-slate-800">
             مرحباً، {currentRole}
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              {new Date().toLocaleDateString('ar-EG')}
            </span>
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-slate-500" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
