import { useState, useEffect } from 'react';
import { attendanceApi } from '../api';

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadStats();
    }, []);

    async function loadStats() {
        try {
            setLoading(true);
            const res = await attendanceApi.getStats();
            setStats(res.data);
        } catch (err) {
            setError(err.message || 'Failed to load stats');
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Overview of your workforce metrics and recent activity.</p>
                </div>
                <div className="flex items-center justify-center py-20">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h2>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-6 dark:bg-slate-900 dark:border-slate-800">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                        onClick={loadStats}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const { summary, employeeStats } = stats;
    const totalMarked = summary.presentToday + summary.absentToday;
    const attendanceRate = totalMarked > 0 ? Math.round((summary.presentToday / totalMarked) * 100) : 0;

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Overview of your workforce metrics and recent activity.</p>
                </div>
                <button
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-600 transition-all shadow-sm shadow-blue-200 dark:shadow-none"
                    onClick={() => window.location.href = '#employees'}
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    Add Employee
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-slate-200/60 dark:bg-slate-900 dark:border-slate-700">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Employees</p>
                            <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{summary.totalEmployees}</h3>
                        </div>
                        <div className="rounded-lg bg-blue-50 p-2 text-primary dark:bg-blue-900/20 dark:text-blue-400">
                            <span className="material-symbols-outlined">group</span>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-xs text-slate-400">Active workforce members</span>
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-slate-200/60 dark:bg-slate-900 dark:border-slate-700">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Today's Present</p>
                            <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{summary.presentToday}</h3>
                        </div>
                        <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                            <span className="material-symbols-outlined">check_circle</span>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{attendanceRate}%</span>
                        <span className="text-xs text-slate-400">attendance rate today</span>
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-slate-200/60 dark:bg-slate-900 dark:border-slate-700">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Today's Absent</p>
                            <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{summary.absentToday}</h3>
                        </div>
                        <div className="rounded-lg bg-rose-50 p-2 text-rose-500 dark:bg-rose-900/20 dark:text-rose-400">
                            <span className="material-symbols-outlined">cancel</span>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-xs font-medium text-amber-500 dark:text-amber-400">{summary.notMarkedToday} not marked</span>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:bg-slate-900 dark:border-slate-700 overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Employee Summary</h3>
                    <button className="text-sm font-medium text-primary hover:text-blue-700 dark:hover:text-blue-300">View All</button>
                </div>

                {employeeStats.length === 0 ? (
                    <div className="p-12 text-center">
                        <span className="material-symbols-outlined text-4xl text-slate-300 mb-3">group</span>
                        <h4 className="text-slate-900 dark:text-white font-medium mb-1">No employees yet</h4>
                        <p className="text-sm text-slate-500">Add employees to see their attendance statistics</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
                            <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Name</th>
                                    <th className="px-6 py-3 font-medium">Department</th>
                                    <th className="px-6 py-3 font-medium">Present</th>
                                    <th className="px-6 py-3 font-medium">Absent</th>
                                    <th className="px-6 py-3 font-medium text-right">Attendance Rate</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {employeeStats.slice(0, 5).map(emp => {
                                    const total = (emp.present_days || 0) + (emp.absent_days || 0);
                                    const rate = total > 0 ? Math.round((emp.present_days / total) * 100) : 0;
                                    const initials = emp.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

                                    return (
                                        <tr key={emp.employee_id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary ring-2 ring-white dark:ring-slate-800">
                                                        {initials}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-slate-900 dark:text-white">{emp.full_name}</div>
                                                        <div className="text-xs text-slate-500">{emp.employee_id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400">
                                                    {emp.department}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                                    {emp.present_days || 0}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300">
                                                    {emp.absent_days || 0}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-right">
                                                {total > 0 ? (
                                                    <span className={`text-sm font-semibold ${rate >= 80 ? 'text-green-600' : rate >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                                                        {rate}%
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
