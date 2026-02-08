const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function fetchApi(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;

    const config = {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    };

    const res = await fetch(url, config);
    const data = await res.json();

    if (!res.ok) {
        throw {
            status: res.status,
            message: data.message || 'Something went wrong',
            errors: data.errors
        };
    }

    return data;
}

export const employeeApi = {
    getAll: () => fetchApi('/employees'),
    getOne: (id) => fetchApi(`/employees/${id}`),
    create: (emp) => fetchApi('/employees', {
        method: 'POST',
        body: JSON.stringify(emp),
    }),
    delete: (id) => fetchApi(`/employees/${id}`, { method: 'DELETE' }),
};

export const attendanceApi = {
    getAll: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.date) params.append('date', filters.date);
        if (filters.from) params.append('from', filters.from);
        if (filters.to) params.append('to', filters.to);
        if (filters.employee_id) params.append('employee_id', filters.employee_id);

        const q = params.toString();
        return fetchApi(`/attendance${q ? '?' + q : ''}`);
    },
    getByEmployee: (id, filters = {}) => {
        const params = new URLSearchParams();
        if (filters.from) params.append('from', filters.from);
        if (filters.to) params.append('to', filters.to);

        const q = params.toString();
        return fetchApi(`/attendance/employee/${id}${q ? '?' + q : ''}`);
    },
    getStats: () => fetchApi('/attendance/stats'),
    mark: (record) => fetchApi('/attendance', {
        method: 'POST',
        body: JSON.stringify(record),
    }),
};
