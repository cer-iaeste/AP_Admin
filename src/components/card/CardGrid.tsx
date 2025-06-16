import React from "react";
import FormButtons from "./FormButtons";
import CardBasic from "./CardBasic";
import CardComplex from "./CardComplex";

interface CardGridProps {
    data: any[]
    title: string
    isChanged: boolean,
    isLoading: boolean,
    onDelete: (index: number) => void
    onInputChange: (e: any, index: number, column?: string) => void
    onSave: () => void
    onAdd: () => void
    onCancel: () => void
}

const CardGrid: React.FC<CardGridProps> = ({ title, data, isChanged, isLoading, onDelete, onInputChange, onSave, onAdd, onCancel }) => {
    return (
        <div className="flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-6 mt-8">
                {data.map((item, index) => {
                    return item.hasOwnProperty("name") ?
                        <CardBasic title={title} index={index} item={item} onDelete={onDelete} onInputChange={onInputChange} />
                        : <CardComplex title={title} index={index} item={item} onDelete={onDelete} onInputChange={onInputChange} />
                })}

                <div className="flex items-end">
                    <button
                        className="
                                w-full bg-sky-100 text-blue-300 h-72 border-2 border-dashed border-blue-300
                                py-4 px-6 rounded-xl shadow-lg
                                hover:from-blue-700 hover:to-blue-800 transition-all duration-300
                                flex items-center justify-center gap-2 text-lg font-semibold
                                focus:outline-none focus:ring-2 focus:ring-blue-400 transform hover:scale-105
                            "
                        onClick={onAdd}
                    >
                        <i className="fa fa-plus text-xl"></i> Add a new {title}
                    </button>
                </div>
            </div>
            <FormButtons isChanged={isChanged} isLoading={isLoading} onSave={onSave} onCancel={onCancel} />
        </div>
    );
}

export default CardGrid