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

        // Call the onSave function (this should include your save logic)
        onSave(); // Assuming onSave is a promise
    };

    return (
        <footer className="fixed bottom-0 left-0 w-full bg-white border-t border-[#1B75BB] p-1 sm:p-2">
            <div className='flex flex-row justify-between container'>
                {/* Cancel Button */}
                <button
                    type="button"
                    onClick={onBack}
                    className={`flex items-center text-[#1B75BB] font-semibold`}
                >
                    <i className={`fa fa-chevron-left mr-0 sm:mr-1 p-1`} aria-hidden="true"></i>
                    Back
                </button>
                <div className="flex justify-end space-x-4 font-semibold">
                    {/* Cancel Button */}
                    <button
                        type="button"
                        disabled={isDisabled}
                        onClick={onCancel}
                        className={`btn flex items-center rounded-md border-2 border-red-500 text-red-500 p-1 ${!isDisabled ? "bg-white hover:bg-red-500 hover:text-white hover:shadow-xl" : "bg-gray-300"}`}
                    >
                        <i className={`fa fa-ban mr-0 sm:mr-1 p-1`} aria-hidden="true"></i>
                        <span className='hidden sm:block'>Cancel</span>
                    </button>

                    {/* Save Button */}
                    <button
                        type="button"
                        disabled={isDisabled || isLoading}
                        onClick={handleSave}
                        className={`btn flex items-center rounded-md border-2 border-[#1B75BB] text-[#1B75BB] p-1 ${!isDisabled ? `bg-white hover:bg-[#1B75BB] hover:text-white hover:shadow-xl` : "bg-gray-300"}`}
                    >
                        {isLoading ? (
                            <>
                                <i className={`fa fa-spinner fa-spin mr-1 p-1`} aria-hidden="true"></i>
                                Loading...
                            </>
                        ) : (
                            <>
                                <i className={`fa fa-save mr-0 sm:mr-1 p-1`} aria-hidden="true"></i>
                                <span className='hidden sm:block'>Save Changes</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

        </footer>
    );
};

export default CardFooter;
