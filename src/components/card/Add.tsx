import React from "react";

interface AddBtnProps {
    onAdd: () => void
    isObject: boolean
}

const AddBtn: React.FC<AddBtnProps> = ({ onAdd, isObject }) => {
    return (
        <div className="flex items-end">
            <button
                className={`
                        w-full bg-sky-100 text-blue-300 border-2 border-dashed border-blue-300
                        py-4 px-6 rounded-xl shadow-lg h-72
                        hover:from-blue-700 hover:to-blue-800 transition-all duration-300
                        flex items-center justify-center gap-2 text-lg font-semibold
                        focus:outline-none focus:ring-2 focus:ring-blue-400 transform hover:scale-105
                    `}
                onClick={onAdd}
            >
                <i className="fa fa-plus text-xl"></i> Add a new item
            </button>
        </div>
    )
}

export default AddBtn