import React from "react";
import { CardFormType } from "../types/types";
import FormButtons from "./FormButtons";
import { FormButtonsProps } from "./FormButtons";

interface CardFormProps extends FormButtonsProps {
    items: CardFormType[]
    onInputChange: (e: any, index: number) => void
}

const CardForm: React.FC<CardFormProps> = ({ items, onInputChange, isChanged, isLoading, onSave }) => {
    return (
        < div className="bg-white px-6 py-3 rounded-xl shadow-lg border border-gray-200 flex flex-col mt-8" > {/* Main card container */}
            {
                items.map((item, index) =>
                    <div key={index} className="grid grid-cols-6 items-center rounded-lg transition-colors duration-200 border-b border-gray-100 p-4">
                        <label htmlFor={`link-${item.name.replace(/\s+/g, '-')}`} 
                            className="flex-shrink-0 text-lg font-semibold text-gray-700 flex items-center gap-x-2 sm:w-auto"
                        >
                            <i className={`${item.icon} text-2xl text-blue-600`} />
                            <span className="hidden sm:block">{item.name}</span>
                        </label>
                        <input
                            id={`link-${item.name.replace(/\s+/g, '-')}`}
                            type="text"
                            placeholder={`Enter ${item.name} value`}
                            value={item.value}
                            onChange={(e) => onInputChange(e, index)}
                            className="col-span-5 text-input w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-800 text-lg"
                        />
                    </div>
                )
            }

            <FormButtons isChanged={isChanged} isLoading={isLoading} onSave={onSave} />
        </div >
    )
}

export default CardForm