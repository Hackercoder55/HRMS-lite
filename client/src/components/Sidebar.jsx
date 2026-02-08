function Sidebar({ currentPage, onNavigate }) {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
        { id: 'employees', label: 'Employees', icon: 'group' },
        { id: 'attendance', label: 'Attendance', icon: 'calendar_month' },
    ];

    return (
        <aside className="hidden lg:flex w-64 flex-col border-r border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 h-screen sticky top-0 shrink-0">
            <div className="flex flex-col h-full justify-between p-4">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3 px-2">
                        <div className="bg-primary rounded-xl h-10 w-10 shadow-lg shadow-primary/30 flex items-center justify-center text-white font-bold text-xl">
                            HR
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-slate-900 dark:text-white text-base font-semibold leading-tight">HRMS Lite</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Admin Portal</p>
                        </div>
                    </div>

                    <nav className="flex flex-col gap-1">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full text-left ${currentPage === item.id
                                    ? 'bg-primary/10 text-primary dark:bg-primary/20'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-primary dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-primary'
                                    }`}
                                onClick={() => onNavigate(item.id)}
                            >
                                <span className={`material-symbols-outlined text-[20px] ${currentPage === item.id ? 'filled' : ''}`}>
                                    {item.icon}
                                </span>
                                <span className="text-sm font-medium">{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                    <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                        AD
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate dark:text-white">Admin User</p>
                        <p className="text-xs text-slate-500 truncate dark:text-slate-400">admin@hrms.com</p>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
