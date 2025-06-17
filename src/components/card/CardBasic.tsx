import React from "react";

interface CardTempProps {
    title: string
    index: number
    item: string | any
    onDelete: (index: number) => void
    onInputChange: (e: any, index: number) => void
}

const CardBasic: React.FC<CardTempProps> = ({ title, index, item, onDelete, onInputChange }) => {
    const isObject = item.hasOwnProperty("name")
    return (
        <div
            key={index}
            className={`
                                bg-gradient-to-br from-white to-blue-50 p-4 rounded-2xl shadow-xl border border-blue-100
                                flex flex-col ${!isObject ? "h-72" : "h-44"} // Fixed height for visual consistency
                                transition-all duration-300 transform hover:scale-103 hover:shadow-2xl
                        `}
        >
            <div className="
                                flex justify-between items-center pb-2 mb-2 border-b-2 border-blue-200
                                text-lg font-bold text-gray-800
                            ">
                <span>{title} #{index + 1}</span>
                <button
                    type="button"
                    onClick={() => onDelete(index)}
                    className="
                                        w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center
                                        hover:bg-red-600 hover:text-white transition-colors duration-200
                                        focus:outline-none focus:ring-2 focus:ring-red-500
                                    "
                    title="Remove fun fact"
                >
                    <i className="fa fa-trash text-base" aria-hidden="true"></i>
                </button>
            </div>

            {/* Fact Content Textarea - Takes up remaining space */}
            <textarea
                placeholder="Enter a fun fact"
                rows={!isObject ? 4 : 2} // Initial rows, but flex-1 will control actual height
                value={!isObject? item : item.name}
                onChange={(e) => onInputChange(e, index)}
                className="
                                    flex-1 w-full p-3 border border-gray-300 rounded-md bg-white
                                    focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-800 text-base // Slightly smaller text
                                    resize-none // Disable manual resize to maintain consistent card height
                                "
                style={{ scrollbarWidth: 'thin' }}
            />
        </div>
    )
}

export default CardBasic;