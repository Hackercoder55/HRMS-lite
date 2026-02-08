/*
 * Employees page - manage employee records
 * by Santosh Kumar
 */

import { useState, useEffect } from 'react';
import { employeeApi } from '../api';
import { useToast } from '../App';
import Modal from '../components/Modal';

function Employees() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        employee_id: '',
        full_name: '',
        email: '',
        department: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const showToast = useToast();

    useEffect(() => {
        loadEmployees();
    }, []);

    async function loadEmployees() {
        try {
            setLoading(true);
            const res = await employeeApi.getAll();
            setEmployees(res.data);
        } catch (err) {
            showToast(err.message || 'Failed to load', 'error');
        } finally {
            setLoading(false);
        }
    }

    function openModal() {
        setFormData({ employee_id: '', full_name: '', email: '', department: '' });
        setFormErrors({});
        setShowModal(true);
    }

    function closeModal() {
        setShowModal(false);
        setFormErrors({});
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setFormErrors({});
        setSubmitting(true);

        try {
            await employeeApi.create(formData);
            showToast('Employee added successfully');
            closeModal();
            loadEmployees();
        } catch (err) {
            if (err.errors) {
                const errors = {};
                err.errors.forEach(e => { errors[e.field] = e.message; });
                setFormErrors(errors);
            } else {
                showToast(err.message || 'Failed', 'error');
            }
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(id, name) {
        if (!confirm(`Delete ${name}?`)) return;

        try {
            await employeeApi.delete(id);
            showToast('Employee deleted');
            loadEmployees();
        } catch (err) {
            showToast(err.message || 'Failed', 'error');
        }
    }

    const filtered = employees.filter(emp =>
        emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getDeptColor = (dept) => {
        const d = dept.toLowerCase();
        if (d.includes('engineer')) return 'bg-blue-50 text-blue-600 border-blue-100';
        if (d.includes('hr') || d.includes('human')) return 'bg-purple-50 text-purple-600 border-purple-100';
        if (d.includes('market')) return 'bg-pink-50 text-pink-600 border-pink-100';
        if (d.includes('sales')) return 'bg-green-50 text-green-600 border-green-100';
        return 'bg-slate-50 text-slate-600 border-slate-100';
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Employee Directory</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage your organization's employee records and profiles.</p>
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
                    <h1 className="text-2xl font-bold text-slate-800">Employee Directory</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage your organization's employee records and profiles.</p>
                </div>
                <button
                    onClick={openModal}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-lg">add</span>
                    Add Employee
                </button>
            </div>

            {/* stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm">Total Employees</p>
                            <h2 className="text-2xl font-bold text-slate-800 mt-1">{employees.length}</h2>
                        </div>
                        <span className="material-symbols-outlined text-slate-400">people</span>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm">New Hires</p>
                            <h2 className="text-2xl font-bold text-slate-800 mt-1">{Math.min(employees.length, 5)}</h2>
                        </div>
                        <span className="material-symbols-outlined text-slate-400">person_add</span>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm">Departments</p>
                            <h2 className="text-2xl font-bold text-slate-800 mt-1">{new Set(employees.map(e => e.department)).size}</h2>
                        </div>
                        <span className="material-symbols-outlined text-slate-400">domain</span>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm">Active</p>
                            <h2 className="text-2xl font-bold text-slate-800 mt-1">{employees.length}</h2>
                        </div>
                        <span className="material-symbols-outlined text-slate-400">verified</span>
                    </div>
                </div>
            </div>

            {/* search bar */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                    <input
                        type="text"
                        placeholder="Search employees..."
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">filter_list</span>
                    Filter
                </button>
            </div>

            {/* table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="p-12 text-center">
                        <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">group</span>
                        <p className="text-slate-800 font-medium">No employees found</p>
                        <p className="text-slate-500 text-sm">{employees.length === 0 ? 'Add your first employee' : 'Try a different search'}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-100">
                                <tr>
                                    <th className="px-5 py-3 font-medium">ID</th>
                                    <th className="px-5 py-3 font-medium">Full Name</th>
                                    <th className="px-5 py-3 font-medium">Email Address</th>
                                    <th className="px-5 py-3 font-medium">Department</th>
                                    <th className="px-5 py-3 font-medium">Status</th>
                                    <th className="px-5 py-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map(emp => {
                                    const initials = emp.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                                    const colors = ['bg-teal-100 text-teal-600', 'bg-orange-100 text-orange-600', 'bg-yellow-100 text-yellow-600', 'bg-purple-100 text-purple-600'];
                                    const colorIdx = emp.full_name.length % colors.length;

                                    return (
                                        <tr key={emp.id} className="hover:bg-slate-50">
                                            <td className="px-5 py-4 text-slate-500">{emp.employee_id}</td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium ${colors[colorIdx]}`}>
                                                        {initials}
                                                    </div>
                                                    <span className="font-medium text-slate-800">{emp.full_name}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-slate-600">{emp.email}</td>
                                            <td className="px-5 py-4">
                                                <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${getDeptColor(emp.department)}`}>
                                                    {emp.department}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="flex items-center gap-1.5">
                                                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                                    <span className="text-green-600 text-sm">Active</span>
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <button
                                                    onClick={() => handleDelete(emp.employee_id, emp.full_name)}
                                                    className="text-slate-400 hover:text-red-500"
                                                >
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* modal */}
            {showModal && (
                <Modal title="Add New Employee" onClose={closeModal}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Employee ID</label>
                            <input
                                type="text"
                                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.employee_id ? 'border-red-500' : 'border-slate-200'}`}
                                value={formData.employee_id}
                                onChange={e => setFormData({ ...formData, employee_id: e.target.value })}
                                placeholder="EMP-001"
                            />
                            {formErrors.employee_id && <p className="text-red-500 text-xs mt-1">{formErrors.employee_id}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.full_name ? 'border-red-500' : 'border-slate-200'}`}
                                value={formData.full_name}
                                onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                placeholder="John Doe"
                            />
                            {formErrors.full_name && <p className="text-red-500 text-xs mt-1">{formErrors.full_name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.email ? 'border-red-500' : 'border-slate-200'}`}
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                placeholder="john@company.com"
                            />
                            {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                            <select
                                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.department ? 'border-red-500' : 'border-slate-200'}`}
                                value={formData.department}
                                onChange={e => setFormData({ ...formData, department: e.target.value })}
                            >
                                <option value="">Select department</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Human Resources">Human Resources</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Sales">Sales</option>
                                <option value="Finance">Finance</option>
                                <option value="Design">Design</option>
                            </select>
                            {formErrors.department && <p className="text-red-500 text-xs mt-1">{formErrors.department}</p>}
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
                                Cancel
                            </button>
                            <button type="submit" disabled={submitting} className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50">
                                {submitting ? 'Saving...' : 'Save Employee'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}

export default Employees;
