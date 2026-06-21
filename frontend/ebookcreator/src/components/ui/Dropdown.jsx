import { useState, useRef, useEffect } from 'react';

const Dropdown = ({
    trigger,
    items = [],
    align = 'left',
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const alignmentClasses = {
        left: 'left-0',
        right: 'right-0',
        center: 'left-1/2 transform -translate-x-1/2',
    };

    return (
        <div className={`relative inline-block ${className}`} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="focus:outline-none"
            >
                {trigger}
            </button>

            {isOpen && (
                <div
                    className={`absolute top-full mt-2 ${alignmentClasses[align]} bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-max`}
                >
                    {items.map((item, index) => (
                        <React.Fragment key={index}>
                            {item.divider ? (
                                <div className="border-t border-gray-200" />
                            ) : (
                                <button
                                    onClick={() => {
                                        item.onClick?.();
                                        setIsOpen(false);
                                    }}
                                    disabled={item.disabled}
                                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                        } ${item.className || ''}`}
                                >
                                    {item.label}
                                </button>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown;