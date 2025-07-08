import React from "react";

interface CardTempProps {
    title: string
    index: number
    item: any
    onDelete: (index: number) => void
    onInputChange: (e: any, index: number, column: string) => void
}

const CardComplex: React.FC<CardTempProps> = ({ title, index, item, onDelete, onInputChange }) => {
    const mainCol = item.hasOwnProperty("name") ? "name" : "title"
    const hasLinks = item.hasOwnProperty("link")
    return (
        <div
            key={index}
            className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-2xl shadow-xl border border-blue-100
                flex flex-col h-auto min-h-[300px] // Dynamic height but ensures a minimum
                transition-all duration-300 transform hover:scale-103 hover:shadow-2xl
            "
        >
            {/* Card Header with Title and Delete Button */}
            <div className="
                                flex justify-between items-center pb-2 mb-4 border-b-2 border-blue-200
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
                    title={`Remove ${title}`}
                >
                    <i className="fa fa-trash text-base" aria-hidden="true"></i>
                </button>
            </div>

            {/* Card Body - Name and Description Inputs */}
            <div className="flex flex-col flex-1 space-y-4"> {/* Use flex-1 to occupy remaining height */}
                {/* Name Input Section */}
                <div className="flex flex-col"> {/* Use flex-col for label above input */}
                    <div className="text-lg font-semibold text-gray-700 flex items-center gap-x-2 mb-1">
                        <i className="fa-solid fa-tag text-blue-600"></i> Name:
                    </div>
                    <textarea
                        id={`place-name-${index}`}
                        placeholder={`Enter ${title} name`}
                        rows={2}
                        value={item[mainCol]}
                        onChange={(e) => onInputChange(e, index, mainCol)}
                        className=" text-lg font-semibold
                                            w-full p-3 border border-gray-300 rounded-lg bg-white
                                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                            text-gray-800 text-base shadow-sm
                                            resize-y // Allow vertical resizing
                                        "
                        style={{ scrollbarWidth: 'thin' }}
                    />
                </div>

                {/* Description Input Section */}
                <div className="flex flex-col flex-1"> {/* flex-1 and flex-col for description to fill space */}
                    <div className="text-lg font-semibold text-gray-700 flex items-center gap-x-2 mb-1">
                        <i className="fa-solid fa-file-lines text-blue-600"></i> {!hasLinks ? "Description" : "Link"}:
                    </div>
                    <textarea
                        id={`place-description-${index}`}
                        placeholder={`Enter ${title} description`}
                        rows={!hasLinks ? 4 : 1} // Initial rows, but flex-1 will manage height
                        value={!hasLinks ? item.description : item.link}
                        onChange={(e) => onInputChange(e, index, !hasLinks ? "description" : "link")}
                        className="
                                            flex-1 w-full p-3 border border-gray-300 rounded-lg bg-white
                                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                            text-gray-800 text-base shadow-sm
                                            resize-y // Allow vertical resizing
                                        "
                        style={{ scrollbarWidth: 'thin' }}
                    />
                </div>
            </div>
        </div>
    )
}

export default CardComplex