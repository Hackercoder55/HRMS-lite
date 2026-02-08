function Toast({ message, type = 'success' }) {
    return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white ${type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}>
            <span className="material-symbols-outlined text-lg">
                {type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span className="text-sm font-medium">{message}</span>
        </div>
    );
}

export default Toast;
