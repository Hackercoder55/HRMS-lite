import { useState } from 'react';
import { createContext, useContext } from 'react';
import './index.css';

import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import Toast from './components/Toast';

export const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    // auto dismiss
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'employees': return <Employees />;
      case 'attendance': return <Attendance />;
      default: return <Dashboard />;
    }
  };

  return (
    <ToastContext.Provider value={showToast}>
      <div className="relative flex min-h-screen w-full flex-row overflow-hidden bg-background-light dark:bg-background-dark">
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

        <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
          {/* mobile header */}
          <header className="flex lg:hidden items-center justify-between p-4 bg-white border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-white">
              <span className="text-primary material-symbols-outlined">dataset</span> HRMS Lite
            </div>
            <button className="p-2 text-slate-600 dark:text-slate-300">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </header>

          <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
            {renderPage()}
          </div>
        </main>

        {/* toasts */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
          {toasts.map(toast => (
            <Toast key={toast.id} message={toast.message} type={toast.type} />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export default App;
