import React from "react";

export interface FormButtonsProps {
    isChanged: boolean
    isLoading: boolean
    onSave: () => void
    onCancel: () => void
}

const FormButtons: React.FC<FormButtonsProps> = ({ isChanged, isLoading, onSave, onCancel }) => {
    return (
        <div className="flex justify-end space-x-4 pt-3 px-1">
            {/* Cancel Button */}
            <button
                type="button"
                disabled={!isChanged || isLoading}
                onClick={onCancel}
                className={`flex items-center justify-center px-4 py-2 rounded-lg text-lg font-semibold transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2
                    ${!isChanged || isLoading ? "bg-gray-200 text-gray-400 cursor-not-allowed" : 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500'}
                `}
            >
                {isLoading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <i className={`fa fa-ban`} aria-hidden="true"></i>
                )}
                <span className="hidden md:block ml-2">Cancel</span>
            </button>

            {/* Save Button */}
            <button
                type="button"
                disabled={!isChanged || isLoading}
                onClick={onSave}
                className={`flex items-center justify-center px-4 py-2 rounded-lg text-lg font-semibold transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2
                    ${!isChanged || isLoading ? "bg-gray-200 text-gray-400 cursor-not-allowed" : 'bg-[#1B75BB] text-white hover:bg-[#155A90] focus:ring-[#1B75BB]'}
                `}
            >
                {isLoading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <i className={`fa fa-save`} aria-hidden="true"></i>
                )}
                <span className="hidden md:block ml-2">Save</span>
            </button>
        </div>
    )
}

export default FormButtons