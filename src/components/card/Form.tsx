import React from "react";
import { CardFormType } from "../../types/types";
import FormButtons from "./FormButtons";
import { FormButtonsProps } from "./FormButtons";

interface CardFormProps extends FormButtonsProps {
    items: CardFormType[]
    onInputChange: (e: any, index: number) => void
}

const CardForm: React.FC<CardFormProps> = ({ items, onInputChange, isChanged, isLoading, onSave, onCancel }) => {
    return (
        < div className="bg-white px-3 md:px-6 py-3 rounded-xl shadow-lg border border-gray-200 flex flex-col mt-8" > {/* Main card container */}
            {
                items.map((item, index) =>
                    <div key={index} className="grid grid-cols-5 items-center rounded-lg transition-colors duration-200 border-b border-gray-100 p-3 md:p-4">
                        <label htmlFor={`link-${item.name.replace(/\s+/g, '-')}`} 
                            className="flex-shrink-0 text-lg font-semibold text-gray-700 flex items-center gap-x-2 sm:w-auto justify-center md:justify-start"
                        >
                            <i className={`${item.icon} text-2xl text-blue-600`} />
                            <span className="hidden md:block ml-2">{item.name}</span>
                        </label>
                        {!item.isSelect ? (
                            <input
                            id={`link-${item.name.replace(/\s+/g, '-')}`}
                            type="text"
                            placeholder={`Enter ${item.name} value`}
                            value={item.value}
                            onChange={(e) => onInputChange(e, index)}
                            className="col-span-4 text-input w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                        ) : (
                            <select id={`link-${item.name.replace(/\s+/g, '-')}`}
                                value={item.value}
                                onChange={(e) => onInputChange(e, index)}
                                className="col-span-4 text-input w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                            >
                                {item.options && item.options.map((op, index) => 
                                    <option key={index} value={op.value} disabled={!op.value}>
                                        {op.display}
                                    </option>
                                )}
                            </select>
                        )}
                    </div>
                )
            }

            <FormButtons isChanged={isChanged} isLoading={isLoading} onSave={onSave} onCancel={onCancel} />
        </div >
    )
}

export default CardForm