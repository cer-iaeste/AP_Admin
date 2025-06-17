import React, { useState, useEffect} from "react";
import FormButtons from "./FormButtons";
import CardBasic from "./CardBasic";
import CardComplex from "./CardComplex";
import AddBtn from "./Add";

interface CardGridProps {
    data: any[]
    title: string
    isChanged: boolean,
    isLoading: boolean,
    icon?: string
    onDelete: (index: number) => void
    onInputChange: (e: any, index: number, column?: string) => void
    onSave: () => void
    onAdd: () => void
    onCancel: () => void
}

const CardGrid: React.FC<CardGridProps> = ({ title, data, isChanged, isLoading, onDelete, onInputChange, onSave, onAdd, onCancel }) => {
    const [isObject, setIsObject] = useState<boolean>(false)
    
    useEffect(() => {
        setIsObject(!data[0].hasOwnProperty("link"))
    }, [data])

    return (
        <div className="flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:m-8">
                {data.map((item, index) => {
                    return item.hasOwnProperty("name") && !item.hasOwnProperty("link") ?
                        <CardBasic title={title} index={index} item={item} onDelete={onDelete} onInputChange={onInputChange} />
                        : <CardComplex title={title} index={index} item={item} onDelete={onDelete} onInputChange={onInputChange} />
                })}

                <AddBtn onAdd={onAdd} isObject={isObject} />
            </div>
            <FormButtons isChanged={isChanged} isLoading={isLoading} onSave={onSave} onCancel={onCancel} />
        </div>
    );
}

export default CardGrid