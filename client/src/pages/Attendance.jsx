import { useState, useEffect } from 'react';
import { employeeApi, attendanceApi } from '../api';
import { useToast } from '../App';

function Attendance() {
    const [employees, setEmployees] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split('T')[0]
    );
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('Present');
    const [marking, setMarking] = useState(null); // currently marking
    const [formSubmitting, setFormSubmitting] = useState(false);

    const showToast = useToast();

    useEffect(() => {
        loadData();
    }, [selectedDate]);

    async function loadData() {
        try {
            setLoading(true);
            const [empRes, attRes] = await Promise.all([
                employeeApi.getAll(),
                attendanceApi.getAll({ date: selectedDate })
            ]);
            setEmployees(empRes.data);
            setAttendance(attRes.data);
        } catch (err) {
            showToast(err.message || 'Failed to load data', 'error');
        } finally {
            setLoading(false);
        }
    }

    async function markAttendance(employeeId, status) {
        setMarking(employeeId);
        try {
            await attendanceApi.mark({
                employee_id: employeeId,
                date: selectedDate,
                status
            });
            showToast(`Marked ${status}`);
            loadData();
        } catch (err) {
            showToast(err.message || 'Failed to mark attendance', 'error');
        } finally {
            setMarking(null);
        }
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        if (!selectedEmployee) {
            showToast('Please select an employee', 'error');
            return;
        }
        setFormSubmitting(true);
        try {
            await attendanceApi.mark({
                employee_id: selectedEmployee,
                date: selectedDate,
                status: selectedStatus
            });
            showToast(`Marked ${selectedStatus}`);
            setSelectedEmployee('');
            loadData();
        } catch (err) {
            showToast(err.message || 'Failed to mark attendance', 'error');
        } finally {
            setFormSubmitting(false);
        }
    }

    // get status for an employee on selected date
    function getStatus(employeeId) {
        const record = attendance.find(a => a.employee_id === employeeId);
        return record ? record.status : null;
    }

    const presentCount = attendance.filter(a => a.status === 'Present').length;
    const absentCount = attendance.filter(a => a.status === 'Absent').length;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Attendance Management</h2>
                    <p className="text-slate-500 mt-1 text-sm dark:text-slate-400">Track daily logs and manage employee attendance records.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <span className="material-symbols-outlined text-[20px]">download</span>
                        Export Report
                    </button>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Mark Attendance Form */}
                <div className="lg:col-span-4 xl:col-span-3 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Mark Attendance</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Quickly log status for an employee.</p>

                        <form onSubmit={handleFormSubmit} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-slate-900 dark:text-gray-200" htmlFor="employee">Select Employee</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-gray-400 text-[20px]">person_search</span>
                                    </div>
                                    <select
                                        className="block w-full pl-10 pr-10 py-2.5 text-base border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-lg"
                                        id="employee"
                                        value={selectedEmployee}
                                        onChange={e => setSelectedEmployee(e.target.value)}
                                    >
                                        <option value="">Select an employee...</option>
                                        {employees.map(emp => (
                                            <option key={emp.employee_id} value={emp.employee_id}>
                                                {emp.full_name} (ID: {emp.employee_id})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-slate-900 dark:text-gray-200" htmlFor="date">Date</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-gray-400 text-[20px]">calendar_today</span>
                                    </div>
                                    <input
                                        className="block w-full pl-10 pr-3 py-2.5 text-base border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-lg"
                                        id="date"
                                        type="date"
                                        value={selectedDate}
                                        onChange={e => setSelectedDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-slate-900 dark:text-gray-200 mb-2">Status</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <label className="cursor-pointer">
                                        <input
                                            className="peer sr-only"
                                            name="status"
                                            type="radio"
                                            value="Present"
                                            checked={selectedStatus === 'Present'}
                                            onChange={e => setSelectedStatus(e.target.value)}
                                        />
                                        <div className="rounded-lg border border-gray-200 dark:border-gray-600 p-3 text-center hover:bg-gray-50 dark:hover:bg-gray-700 peer-checked:border-green-500 peer-checked:bg-green-50 dark:peer-checked:bg-green-900/20 peer-checked:text-green-700 dark:peer-checked:text-green-400 transition-all">
                                            <div className="font-semibold text-sm">Present</div>
                                        </div>
                                    </label>
                                    <label className="cursor-pointer">
                                        <input
                                            className="peer sr-only"
                                            name="status"
                                            type="radio"
                                            value="Absent"
                                            checked={selectedStatus === 'Absent'}
                                            onChange={e => setSelectedStatus(e.target.value)}
                                        />
                                        <div className="rounded-lg border border-gray-200 dark:border-gray-600 p-3 text-center hover:bg-gray-50 dark:hover:bg-gray-700 peer-checked:border-red-500 peer-checked:bg-red-50 dark:peer-checked:bg-red-900/20 peer-checked:text-red-700 dark:peer-checked:text-red-400 transition-all">
                                            <div className="font-semibold text-sm">Absent</div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <button
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50"
                                type="submit"
                                disabled={formSubmitting}
                            >
                                {formSubmitting ? 'Saving...' : 'Log Attendance'}
                            </button>
                        </form>
                    </div>

                    {/* Quick Stats Card */}
                    <div className="bg-primary text-white rounded-xl shadow-lg p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                        <div className="relative z-10">
                            <h4 className="text-lg font-semibold mb-4">Today's Summary</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-3xl font-bold">{presentCount}</p>
                                    <p className="text-xs text-blue-100 uppercase tracking-wider font-medium mt-1">Present</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold">{absentCount}</p>
                                    <p className="text-xs text-blue-100 uppercase tracking-wider font-medium mt-1">Absent</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Attendance Log Table */}
                <div className="lg:col-span-8 xl:col-span-9">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col h-full min-h-[500px]">
                        {/* Toolbar */}
                        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                Records for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                            </h3>
                        </div>

                        {/* Table */}
                        {loading ? (
                            <div className="flex items-center justify-center py-20 flex-1">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                            </div>
                        ) : employees.length === 0 ? (
                            <div className="p-12 text-center flex-1 flex flex-col items-center justify-center">
                                <span className="material-symbols-outlined text-4xl text-slate-300 mb-3">calendar_month</span>
                                <h4 className="text-slate-900 dark:text-white font-medium mb-1">No employees</h4>
                                <p className="text-sm text-slate-500">Add employees first to mark attendance</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto flex-1">
                                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                    <thead className="bg-gray-50 dark:bg-slate-800/50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">Employee</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">Department</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                                        {employees.map(emp => {
                                            const status = getStatus(emp.employee_id);
                                            const isMarking = marking === emp.employee_id;
                                            const initials = emp.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

                                            return (
                                                <tr key={emp.employee_id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                                                                    {initials}
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-slate-900 dark:text-white">{emp.full_name}</div>
                                                                <div className="text-sm text-gray-500 dark:text-gray-400">{emp.employee_id}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-slate-900 dark:text-white">{emp.department}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {status ? (
                                                            <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${status === 'Present'
                                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                                }`}>
                                                                {status}
                                                            </span>
                                                        ) : (
                                                            <span className="text-sm text-gray-400 italic">Not marked</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${status === 'Present'
                                                                        ? 'bg-green-500 text-white'
                                                                        : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-green-900/20 dark:hover:text-green-400'
                                                                    }`}
                                                                onClick={() => markAttendance(emp.employee_id, 'Present')}
                                                                disabled={isMarking}
                                                            >
                                                                Present
                                                            </button>
                                                            <button
                                                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${status === 'Absent'
                                                                        ? 'bg-red-500 text-white'
                                                                        : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-red-900/20 dark:hover:text-red-400'
                                                                    }`}
                                                                onClick={() => markAttendance(emp.employee_id, 'Absent')}
                                                                disabled={isMarking}
                                                            >
                                                                Absent
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination */}
                        {!loading && employees.length > 0 && (
                            <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                    <p className="text-sm text-gray-700 dark:text-gray-400">
                                        Showing <span className="font-medium text-slate-900 dark:text-white">{employees.length}</span> employees
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Attendance;
