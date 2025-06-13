import React, { useState, useEffect } from 'react';

interface FooterProps {
    isChanged: boolean;
    onCancel: () => void;
    onSave: () => void;
}

const CardFooter: React.FC<FooterProps> = ({ isChanged, onCancel, onSave }) => {
    const [isDisabled, setIsDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsDisabled(!isChanged);
        // After saving, reset the loading state
        if (!isChanged && isLoading) setIsLoading(false); // Only reset if already loading and changes are saved
    }, [isChanged, isLoading]);

    const handleSave = async () => {
        setIsLoading(true); // Start loading
        setIsDisabled(true); // Disable buttons immediately to prevent multiple clicks
        // The actual `onSave` function should handle re-enabling `isChanged` to false upon success/failure,
        // which will then trigger the `useEffect` above to reset `isDisabled` and `isLoading`.
        onSave();
    };

    // Tailwind CSS classes for consistent button styling
    const baseButtonClasses = `
        flex items-center justify-center
        px-4 py-2 rounded-lg text-lg font-semibold
        transition-all duration-200 ease-in-out
        transform hover:scale-105 focus:outline-none focus:ring-2
    `;

    // Classes for disabled state
    const disabledButtonClasses = `
        bg-gray-200 text-gray-400 cursor-not-allowed
    `;

    return (
        <footer className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg py-3">
            <div className="max-w-7xl mx-auto flex justify-end items-center px-4 sm:px-6 lg:px-8">
                {/* The Back Button has been removed */}

                <div className="flex space-x-4">
                    {/* Cancel Button */}
                    <button
                        type="button"
                        disabled={!isChanged || isLoading} // Only disable if no changes or loading
                        onClick={onCancel}
                        className={`${baseButtonClasses}
                            ${!isChanged || isLoading
                                ? disabledButtonClasses
                                : 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500'
                            }
                        `}
                    >
                        <i className={`fa fa-ban ${isLoading ? '' : 'mr-2'}`} aria-hidden="true"></i>
                        <span>Cancel</span>
                    </button>

                    {/* Save Button */}
                    <button
                        type="button"
                        disabled={!isChanged || isLoading}
                        onClick={handleSave}
                        className={`${baseButtonClasses}
                            ${!isChanged || isLoading
                                ? disabledButtonClasses
                                : 'bg-[#1B75BB] text-white hover:bg-[#155A90] focus:ring-[#1B75BB]'
                            }
                        `}
                    >
                        {isLoading ? (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <i className="fa fa-save mr-2" aria-hidden="true"></i>
                        )}
                        <span>Save</span>
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default CardFooter;
