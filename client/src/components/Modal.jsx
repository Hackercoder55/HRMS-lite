function Modal({ title, onClose, children }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md transform overflow-hidden rounded-xl bg-white text-left shadow-2xl dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:bg-slate-800/50 dark:border-slate-800">
                    <h3 className="text-lg font-semibold leading-6 text-slate-900 dark:text-white">{title}</h3>
                    <button
                        className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-500 focus:outline-none dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
                        onClick={onClose}
                    >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>
                {/* Content */}
                {children}
            </div>
        </div>
    );
}

export default Modal;
