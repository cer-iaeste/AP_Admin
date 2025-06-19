import React from "react";

interface AddBtnProps {
    onAdd: () => void
    isBasic?: boolean
}

const AddBtn: React.FC<AddBtnProps> = ({ onAdd, isBasic }) => {
    return (
        <div className="flex items-end">
            <button
                className={`
                        w-full bg-sky-100 text-blue-300 border-2 border-dashed border-blue-300
                        py-4 px-6 rounded-xl shadow-lg ${isBasic ? "h-56" : "h-72"} 
                        hover:bg-sky-200 hover:text-xl hover:text-white transition-all duration-300
                        flex items-center justify-center gap-2 text-lg font-semibold
                        focus:outline-none focus:ring-2 focus:ring-blue-400 transform
                    `}
                onClick={onAdd}
            >
                <i className="fa fa-plus text-xl"></i> Add a new item
            </button>
        </div>
    )
}

export default AddBtn