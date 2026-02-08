/*
 * HRMS Lite - Human Resource Management System
 * 
 * Developed by: Santosh Kumar
 * College: KR Mangalam University
 * 
 * A lightweight HRMS for managing employees and attendance
 */

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

// also export navigation context so dashboard can switch pages
export const NavigationContext = createContext();

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
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
      <NavigationContext.Provider value={setCurrentPage}>
        <div className="flex min-h-screen bg-slate-50">
          <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

          <main className="flex-1 flex flex-col min-h-screen">
            {/* mobile header */}
            <header className="flex lg:hidden items-center justify-between p-4 bg-white border-b border-slate-200">
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <div className="bg-blue-500 rounded-lg h-8 w-8 flex items-center justify-center text-white font-bold text-sm">HR</div>
                HRMS Lite
              </div>
              <button className="p-2 text-slate-600">
                <span className="material-symbols-outlined">menu</span>
              </button>
            </header>

            <div className="flex-1 p-6 lg:p-8">
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
      </NavigationContext.Provider>
    </ToastContext.Provider>
  );
}

export default App;
