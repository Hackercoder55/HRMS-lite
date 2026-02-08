/*
 * Sidebar component
 * by Santosh Kumar
 */

function Sidebar({ currentPage, onNavigate }) {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
        { id: 'employees', label: 'Employees', icon: 'people' },
        { id: 'attendance', label: 'Attendance', icon: 'event_available' },
    ];

    return (
        <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-slate-200 h-screen sticky top-0">
            <div className="flex flex-col h-full justify-between p-5">
                <div className="flex flex-col gap-8">
                    {/* logo */}
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-500 rounded-lg h-10 w-10 flex items-center justify-center text-white font-bold text-lg">
                            HR
                        </div>
                        <div>
                            <h1 className="text-slate-800 text-base font-semibold">HRMS Lite</h1>
                            <p className="text-slate-400 text-xs">Admin Portal</p>
                        </div>
                    </div>

                    {/* nav links */}
                    <nav className="flex flex-col gap-1">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full text-left ${currentPage === item.id
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                                onClick={() => onNavigate(item.id)}
                            >
                                <span className={`material-symbols-outlined text-xl ${currentPage === item.id ? 'text-blue-500' : 'text-slate-400'}`}>
                                    {item.icon}
                                </span>
                                <span className="text-sm font-medium">{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* user info */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                    <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-medium text-sm">
                        SK
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">Santosh Kumar</p>
                        <p className="text-xs text-slate-400 truncate">Admin Portal</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
