
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { NewCaseForm } from './components/NewCaseForm';
import { CaseDetails } from './components/CaseDetails';
import { MOCK_CASES } from './constants';
import { CaseFile, CaseStatus, UserRole } from './types';

const App = () => {
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(UserRole.PRESIDENT);
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [cases, setCases] = useState<CaseFile[]>(MOCK_CASES);
  const [selectedCase, setSelectedCase] = useState<CaseFile | null>(null);

  const handleRoleChange = (role: UserRole) => {
    setCurrentUserRole(role);
    setCurrentPage('dashboard');
    setSelectedCase(null);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setSelectedCase(null);
  };

  const handleCreateCase = (data: any) => {
    const newCase: CaseFile = {
      id: `CASE-${new Date().getFullYear()}-${String(cases.length + 1).padStart(3, '0')}`,
      title: data.title,
      description: data.description,
      category: data.category,
      referralDate: data.referralDate,
      status: CaseStatus.NEW,
      plaintiff: currentUserRole === UserRole.STUDENT ? 'أحمد محمد (طالب)' : 'عضو هيئة تدريس',
      logs: [{ date: new Date().toISOString().split('T')[0], action: 'إنشاء الطلب', user: currentUserRole }]
    };
    setCases([newCase, ...cases]);
    setCurrentPage('dashboard');
  };

  const handleUpdateStatus = (id: string, status: CaseStatus) => {
    const updatedCases = cases.map(c => {
      if (c.id === id) {
        return { 
          ...c, 
          status, 
          completionDate: status === CaseStatus.RESOLVED ? new Date().toISOString().split('T')[0] : c.completionDate 
        };
      }
      return c;
    });
    setCases(updatedCases);
    if (selectedCase) {
      setSelectedCase(updatedCases.find(c => c.id === id) || null);
    }
  };

  const renderContent = () => {
    if (selectedCase) {
      return (
        <CaseDetails 
          caseData={selectedCase} 
          currentUserRole={currentUserRole}
          onBack={() => setSelectedCase(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      );
    }

    switch (currentPage) {
      case 'dashboard':
      case 'all-cases':
        return (
          <Dashboard 
            cases={cases} 
            role={currentUserRole}
            onSelectCase={setSelectedCase}
          />
        );
      case 'new-case':
        return <NewCaseForm onSubmit={handleCreateCase} userRole={currentUserRole} />;
      default:
        return (
           <Dashboard 
            cases={cases} 
            role={currentUserRole}
            onSelectCase={setSelectedCase}
          />
        );
    }
  };

  return (
    <Layout
      currentRole={currentUserRole}
      onRoleChange={handleRoleChange}
      currentPage={currentPage}
      onNavigate={handleNavigate}
    >
      {renderContent()}
    </Layout>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
