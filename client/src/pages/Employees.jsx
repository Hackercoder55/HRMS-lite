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
            showToast(err.message || 'Failed to load employees', 'error');
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
                showToast(err.message || 'Failed to add employee', 'error');
            }
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(id, name) {
        if (!confirm(`Delete ${name}? This will also remove their attendance records.`)) {
            return;
        }

        try {
            await employeeApi.delete(id);
            showToast('Employee deleted');
            loadEmployees();
        } catch (err) {
            showToast(err.message || 'Failed to delete', 'error');
        }
    }

    // search filter
    const filtered = employees.filter(emp =>
        emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // dept badge colors
    const getDeptColor = (dept) => {
        const colors = {
            'Engineering': 'blue',
            'HR': 'purple',
            'Human Resources': 'purple',
            'Marketing': 'pink',
            'Sales': 'emerald',
            'Support': 'amber',
        };
        return colors[dept] || 'slate';
    };

    return (
        <div className="space-y-6">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span>Dashboard</span>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
                <span className="text-primary font-medium">Employees</span>
            </div>

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Employee Directory</h2>
                    <p className="mt-1 text-slate-500 dark:text-slate-400">Manage your organization's employee records and profiles.</p>
                </div>
                <button
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all active:scale-95"
                    onClick={openModal}
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    Add Employee
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Employees</p>
                        <span className="material-symbols-outlined text-slate-400">group</span>
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-900 dark:text-white">{employees.length}</span>
                    </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Departments</p>
                        <span className="material-symbols-outlined text-slate-400">domain</span>
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-900 dark:text-white">
                            {new Set(employees.map(e => e.department)).size}
                        </span>
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Active</span>
                    </div>
                </div>
            </div>

            {/* Table Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full sm:max-w-xs">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <span className="material-symbols-outlined text-[20px]">search</span>
                    </div>
                    <input
                        className="block w-full rounded-lg border-0 bg-white py-2.5 pl-10 pr-3 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 dark:bg-slate-900 dark:ring-slate-800 dark:text-white dark:placeholder:text-slate-600"
                        placeholder="Search employees..."
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Data Table */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:bg-slate-900 dark:border-slate-800">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="p-12 text-center">
                        <span className="material-symbols-outlined text-4xl text-slate-300 mb-3">group</span>
                        <h4 className="text-slate-900 dark:text-white font-medium mb-1">
                            {searchTerm ? 'No results found' : 'No employees yet'}
                        </h4>
                        <p className="text-sm text-slate-500">
                            {searchTerm ? 'Try a different search' : 'Click "Add Employee" to get started'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
                            <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                                <tr>
                                    <th className="px-6 py-4 font-semibold w-32" scope="col">ID</th>
                                    <th className="px-6 py-4 font-semibold" scope="col">Full Name</th>
                                    <th className="px-6 py-4 font-semibold" scope="col">Email Address</th>
                                    <th className="px-6 py-4 font-semibold" scope="col">Department</th>
                                    <th className="px-6 py-4 font-semibold" scope="col">Status</th>
                                    <th className="px-6 py-4 font-semibold text-right w-24" scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 border-t border-slate-100 dark:divide-slate-800 dark:border-slate-800">
                                {filtered.map(emp => {
                                    const initials = emp.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                                    const color = getDeptColor(emp.department);

                                    return (
                                        <tr key={emp.employee_id} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors">
                                            <td className="px-6 py-4 font-mono text-slate-500 text-xs">{emp.employee_id}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                                        {initials}
                                                    </div>
                                                    <div className="font-medium text-slate-900 dark:text-white">{emp.full_name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">{emp.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center rounded-md bg-${color}-50 px-2 py-1 text-xs font-medium text-${color}-700 ring-1 ring-inset ring-${color}-700/10 dark:bg-${color}-400/10 dark:text-${color}-400 dark:ring-${color}-400/30`}>
                                                    {emp.department}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                    <span>Active</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    title="Delete Employee"
                                                    onClick={() => handleDelete(emp.employee_id, emp.full_name)}
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {!loading && filtered.length > 0 && (
                    <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-6 dark:bg-slate-900 dark:border-slate-800">
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-slate-700 dark:text-slate-400">
                                    Showing <span className="font-medium">1</span> to <span className="font-medium">{filtered.length}</span> of <span className="font-medium">{filtered.length}</span> results
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Employee Modal */}
            {showModal && (
                <Modal title="Add New Employee" onClose={closeModal}>
                    <form onSubmit={handleSubmit}>
                        {/* Form Body */}
                        <div className="px-6 py-6">
                            <div className="flex flex-col gap-5">
                                {/* ID Field */}
                                <div>
                                    <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200" htmlFor="employee-id">Employee ID</label>
                                    <div className="mt-2">
                                        <input
                                            className={`block w-full rounded-md border-0 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ${formErrors.employee_id ? 'ring-red-300' : 'ring-slate-300'} placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 dark:bg-slate-950 dark:ring-slate-700 dark:text-white`}
                                            id="employee-id"
                                            placeholder="e.g. EMP-123"
                                            type="text"
                                            value={formData.employee_id}
                                            onChange={e => setFormData({ ...formData, employee_id: e.target.value })}
                                        />
                                    </div>
                                    {formErrors.employee_id && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{formErrors.employee_id}</p>}
                                </div>

                                {/* Name Field */}
                                <div>
                                    <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200" htmlFor="full-name">Full Name</label>
                                    <div className="mt-2">
                                        <input
                                            className={`block w-full rounded-md border-0 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ${formErrors.full_name ? 'ring-red-300' : 'ring-slate-300'} placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 dark:bg-slate-950 dark:ring-slate-700 dark:text-white`}
                                            id="full-name"
                                            placeholder="e.g. Jane Doe"
                                            type="text"
                                            value={formData.full_name}
                                            onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                        />
                                    </div>
                                    {formErrors.full_name && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{formErrors.full_name}</p>}
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200" htmlFor="email">Email Address</label>
                                    <div className="mt-2">
                                        <input
                                            className={`block w-full rounded-md border-0 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ${formErrors.email ? 'ring-red-300' : 'ring-slate-300'} placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 dark:bg-slate-950 dark:ring-slate-700 dark:text-white`}
                                            id="email"
                                            placeholder="you@example.com"
                                            type="email"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    {formErrors.email && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{formErrors.email}</p>}
                                </div>

                                {/* Department Field */}
                                <div>
                                    <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200" htmlFor="department">Department</label>
                                    <div className="mt-2">
                                        <select
                                            className={`block w-full rounded-md border-0 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ${formErrors.department ? 'ring-red-300' : 'ring-slate-300'} focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 dark:bg-slate-950 dark:ring-slate-700 dark:text-white`}
                                            id="department"
                                            value={formData.department}
                                            onChange={e => setFormData({ ...formData, department: e.target.value })}
                                        >
                                            <option value="">Select department</option>
                                            <option value="Engineering">Engineering</option>
                                            <option value="Human Resources">Human Resources</option>
                                            <option value="Marketing">Marketing</option>
                                            <option value="Sales">Sales</option>
                                            <option value="Support">Support</option>
                                        </select>
                                    </div>
                                    {formErrors.department && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{formErrors.department}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="bg-slate-50 px-6 py-4 flex flex-row-reverse gap-3 border-t border-slate-100 dark:bg-slate-800/50 dark:border-slate-800">
                            <button
                                className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 sm:w-auto transition-colors disabled:opacity-50"
                                type="submit"
                                disabled={submitting}
                            >
                                {submitting ? 'Saving...' : 'Save Employee'}
                            </button>
                            <button
                                className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 sm:w-auto dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700 transition-colors"
                                type="button"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}

export default Employees;
