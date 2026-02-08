/*
 * Attendance page - mark and view attendance
 * by Santosh Kumar
 */

import { useState, useEffect } from 'react';
import { employeeApi, attendanceApi } from '../api';
import { useToast } from '../App';

function Attendance() {
    const [employees, setEmployees] = useState([]);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedStatus, setSelectedStatus] = useState('Present');
    const [submitting, setSubmitting] = useState(false);
    const [stats, setStats] = useState({ present: 0, absent: 0 });

    const showToast = useToast();

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        loadRecords();
    }, [selectedDate]);

    async function loadData() {
        try {
            setLoading(true);
            const [empRes, attRes, statsRes] = await Promise.all([
                employeeApi.getAll(),
                attendanceApi.getAll({ date: selectedDate }),
                attendanceApi.getStats()
            ]);
            setEmployees(empRes.data);
            setRecords(attRes.data);
            setStats({
                present: statsRes.data.summary.presentToday,
                absent: statsRes.data.summary.absentToday
            });
        } catch (err) {
            showToast(err.message || 'Failed to load', 'error');
        } finally {
            setLoading(false);
        }
    }

    async function loadRecords() {
        try {
            const res = await attendanceApi.getAll({ date: selectedDate });
            setRecords(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    async function handleMarkAttendance() {
        if (!selectedEmployee) {
            showToast('Select an employee', 'error');
            return;
        }

        setSubmitting(true);
        try {
            await attendanceApi.mark({
                employee_id: selectedEmployee,
                date: selectedDate,
                status: selectedStatus
            });
            showToast(`Marked ${selectedStatus.toLowerCase()}`);
            loadData();
            setSelectedEmployee('');
        } catch (err) {
            showToast(err.message || 'Failed', 'error');
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Attendance Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Track daily logs and manage employee attendance records.</p>
                </div>
                <div className="flex items-center justify-center py-20">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Attendance Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Track daily logs and manage employee attendance records.</p>
                </div>
                <button className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">download</span>
                    Export Report
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* left side - mark attendance form */}
                <div className="space-y-4">
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <h3 className="font-semibold text-slate-800 mb-1">Mark Attendance</h3>
                        <p className="text-slate-400 text-sm mb-4">Quickly log status for an employee.</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Select Employee</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">person</span>
                                    <select
                                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                                        value={selectedEmployee}
                                        onChange={e => setSelectedEmployee(e.target.value)}
                                    >
                                        <option value="">Select an employee...</option>
                                        {employees.map(emp => (
                                            <option key={emp.employee_id} value={emp.employee_id}>
                                                {emp.full_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">calendar_month</span>
                                    <input
                                        type="date"
                                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={selectedDate}
                                        onChange={e => setSelectedDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                                <div className="flex gap-2">
                                    <button
                                        className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition ${selectedStatus === 'Present'
                                            ? 'bg-green-500 text-white border-green-500'
                                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                            }`}
                                        onClick={() => setSelectedStatus('Present')}
                                    >
                                        Present
                                    </button>
                                    <button
                                        className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition ${selectedStatus === 'Absent'
                                            ? 'bg-slate-700 text-white border-slate-700'
                                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                            }`}
                                        onClick={() => setSelectedStatus('Absent')}
                                    >
                                        Absent
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleMarkAttendance}
                                disabled={submitting || !selectedEmployee}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
                            >
                                {submitting ? 'Saving...' : 'Log Attendance'}
                            </button>
                        </div>
                    </div>

                    {/* today summary */}
                    <div className="bg-blue-500 rounded-xl p-5 text-white">
                        <h3 className="font-semibold mb-4">Today's Summary</h3>
                        <div className="flex gap-8">
                            <div>
                                <p className="text-3xl font-bold">{stats.present}</p>
                                <p className="text-blue-200 text-sm">PRESENT</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold">{stats.absent}</p>
                                <p className="text-blue-200 text-sm">ABSENT</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* right side - recent logs table */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                            <h3 className="font-semibold text-slate-800">Recent Logs</h3>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                                <input
                                    type="text"
                                    placeholder="Search by name, date..."
                                    className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                                />
                            </div>
                        </div>

                        {records.length === 0 ? (
                            <div className="p-12 text-center">
                                <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">event_busy</span>
                                <p className="text-slate-800 font-medium">No attendance records</p>
                                <p className="text-slate-500 text-sm">Mark attendance for employees</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-100">
                                        <tr>
                                            <th className="px-5 py-3 font-medium">Employee</th>
                                            <th className="px-5 py-3 font-medium">Date</th>
                                            <th className="px-5 py-3 font-medium">Time In</th>
                                            <th className="px-5 py-3 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {records.slice(0, 10).map(rec => {
                                            const initials = rec.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??';
                                            const colors = ['bg-teal-100 text-teal-600', 'bg-orange-100 text-orange-600', 'bg-blue-100 text-blue-600', 'bg-purple-100 text-purple-600'];
                                            const colorIdx = (rec.full_name?.length || 0) % colors.length;
                                            const time = rec.marked_at ? new Date(rec.marked_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '--:--';

                                            return (
                                                <tr key={rec.id} className="hover:bg-slate-50">
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium ${colors[colorIdx]}`}>
                                                                {initials}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-slate-800">{rec.full_name}</p>
                                                                <p className="text-slate-400 text-xs">{rec.department}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4 text-slate-600">
                                                        {new Date(rec.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </td>
                                                    <td className="px-5 py-4 text-slate-500">{time}</td>
                                                    <td className="px-5 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${rec.status === 'Present'
                                                            ? 'bg-green-100 text-green-600'
                                                            : 'bg-red-100 text-red-600'
                                                            }`}>
                                                            {rec.status}
                                                        </span>
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
            </div>
        </div>
    );
}

export default Attendance;
