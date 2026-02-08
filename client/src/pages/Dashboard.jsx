/*
 * Dashboard page - shows stats and recent hires
 * by Santosh Kumar
 */

import { useState, useEffect, useContext } from 'react';
import { attendanceApi } from '../api';
import { NavigationContext } from '../App';

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useContext(NavigationContext);

    useEffect(() => {
        loadStats();
    }, []);

    async function loadStats() {
        try {
            setLoading(true);
            setError(null);
            const res = await attendanceApi.getStats();
            setStats(res.data);
        } catch (err) {
            setError(err.message || 'Failed to load');
        } finally {
            setLoading(false);
        }
    }

    // go to employees page when add button clicked
    function handleAddEmployee() {
        navigate('employees');
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
                    <p className="text-slate-500 text-sm mt-1">Overview of your workforce metrics and recent activity.</p>
                </div>
                <div className="flex items-center justify-center py-20">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button onClick={loadStats} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const { summary, employeeStats } = stats;
    const totalMarked = summary.presentToday + summary.absentToday;
    const rate = totalMarked > 0 ? Math.round((summary.presentToday / totalMarked) * 100) : 0;

    return (
        <div className="space-y-6">
            {/* header with add btn */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
                    <p className="text-slate-500 text-sm mt-1">Overview of your workforce metrics and recent activity.</p>
                </div>
                <button
                    onClick={handleAddEmployee}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 shadow-sm"
                >
                    <span className="material-symbols-outlined text-lg">add</span>
                    Add Employee
                </button>
            </div>

            {/* 3 stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm">Total Employees</p>
                            <h2 className="text-3xl font-bold text-slate-800 mt-1">{summary.totalEmployees}</h2>
                        </div>
                        <div className="bg-blue-50 p-2 rounded-lg">
                            <span className="material-symbols-outlined text-blue-500">person</span>
                        </div>
                    </div>
                    <p className="text-xs text-green-500 mt-3 flex items-center gap-1">
                        <span>↗</span> Active workforce members
                    </p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm">Today's Present</p>
                            <h2 className="text-3xl font-bold text-slate-800 mt-1">{summary.presentToday}</h2>
                        </div>
                        <div className="bg-green-50 p-2 rounded-lg">
                            <span className="material-symbols-outlined text-green-500">check_circle</span>
                        </div>
                    </div>
                    <p className="text-xs text-green-500 mt-3">{rate}% attendance rate today</p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm">Today's Absent</p>
                            <h2 className="text-3xl font-bold text-slate-800 mt-1">{summary.absentToday}</h2>
                        </div>
                        <div className="bg-red-50 p-2 rounded-lg">
                            <span className="material-symbols-outlined text-red-500">cancel</span>
                        </div>
                    </div>
                    <p className="text-xs text-orange-500 mt-3">{summary.notMarkedToday} not marked</p>
                </div>
            </div>

            {/* recent hires table */}
            <div className="bg-white rounded-xl border border-slate-200">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-800">Recent Hires</h3>
                    <button onClick={() => navigate('employees')} className="text-blue-500 text-sm font-medium hover:underline">View All</button>
                </div>

                {employeeStats.length === 0 ? (
                    <div className="p-12 text-center">
                        <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">group</span>
                        <p className="text-slate-800 font-medium">No employees yet</p>
                        <p className="text-slate-500 text-sm">Add employees to see statistics</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-100">
                                <tr>
                                    <th className="px-5 py-3 font-medium">Name</th>
                                    <th className="px-5 py-3 font-medium">Role</th>
                                    <th className="px-5 py-3 font-medium">Department</th>
                                    <th className="px-5 py-3 font-medium">Status</th>
                                    <th className="px-5 py-3 font-medium">Date Added</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {employeeStats.slice(0, 5).map(emp => {
                                    const initials = emp.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                                    const colors = ['bg-teal-100 text-teal-600', 'bg-orange-100 text-orange-600', 'bg-yellow-100 text-yellow-600', 'bg-purple-100 text-purple-600', 'bg-blue-100 text-blue-600'];
                                    const colorIdx = emp.full_name.length % colors.length;

                                    return (
                                        <tr key={emp.employee_id} className="hover:bg-slate-50">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium ${colors[colorIdx]}`}>
                                                        {initials}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-800">{emp.full_name}</p>
                                                        <p className="text-slate-400 text-xs">{emp.employee_id}@company.com</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-slate-600">Employee</td>
                                            <td className="px-5 py-4">
                                                <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-medium border border-blue-100">
                                                    {emp.department}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="flex items-center gap-1.5">
                                                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                                    <span className="text-green-600 text-sm">Active</span>
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-slate-500">Recently</td>
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
