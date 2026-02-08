function Toast({ message, type = 'success' }) {
    const bgColor = type === 'success'
        ? 'bg-green-500'
        : 'bg-red-500';

    const icon = type === 'success' ? 'check_circle' : 'error';

    return (
        <div className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[280px] animate-slide-in`}>
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
            <span className="text-sm font-medium">{message}</span>
        </div>
    );
}

export default Toast;
