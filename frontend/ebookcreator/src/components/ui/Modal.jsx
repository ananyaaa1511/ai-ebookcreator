const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    closeButton = true,
    className = '',
}) => {
    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-200"
            onClick={handleBackdropClick}
        >
            <div
                className={`bg-white rounded-lg shadow-lg ${sizes[size]} w-full mx-4 transform transition-all duration-200 ${className}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
                    {closeButton && (
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Body */}
                <div className="px-6 py-4">{children}</div>
            </div>
        </div>
    );
};

export default Modal;