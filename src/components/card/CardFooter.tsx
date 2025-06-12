import React, { useState, useEffect } from 'react';

interface FooterProps {
    isChanged: boolean;
    onCancel: () => void;
    onSave: () => void;
    onBack: () => void;
}

const CardFooter: React.FC<FooterProps> = ({ isChanged, onCancel, onSave, onBack }) => {
    const [isDisabled, setIsDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsDisabled(!isChanged);
        // After saving, reset the loading state
        if (!isChanged) setIsLoading(false);
    }, [isChanged]);

    const handleSave = async () => {
        setIsLoading(true); // Start loading
        setIsDisabled(true); // Disable buttons
        onSave(); 
    };

    return (
        <footer className="fixed bottom-0 left-0 w-full bg-[#F1F1E6] border-t border-[#1B75BB] h-12">
            <div className="flex justify-end space-x-4 font-semibold p-1.5 max-w-7xl mx-auto">
                    {/* Cancel Button */}
                    <button
                        type="button"
                        disabled={isDisabled}
                        onClick={onCancel}
                        className={`flex items-center rounded-md border-2 px-1 border-red-500 text-red-500 text-sm ${!isDisabled ? "bg-white hover:bg-red-500 hover:text-white hover:shadow-xl" : "bg-gray-300"}`}
                    >
                        <i className={`fa fa-ban mr-0 sm:mr-1`} aria-hidden="true"></i>
                        <span className='hidden sm:block'>Cancel</span>
                    </button>

                    {/* Save Button */}
                    <button
                        type="button"
                        disabled={isDisabled || isLoading}
                        onClick={handleSave}
                        className={`flex items-center rounded-md px-1 border-2 border-[#1B75BB] text-[#1B75BB] p-1 ${!isDisabled ? `bg-white hover:bg-[#1B75BB] hover:text-white hover:shadow-xl` : "bg-gray-300"}`}
                    >
                        <i className={`fa fa-save mr-0 sm:mr-2`} aria-hidden="true"></i>
                        <span className='hidden sm:block'>Save</span>
                    </button>
                </div>

        </footer>
    );
};

export default CardFooter;
