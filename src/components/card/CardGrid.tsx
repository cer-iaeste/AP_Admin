import React, { useState, useEffect } from "react";
import FormButtons from "./FormButtons";
import CardBasic from "./CardBasic";
import CardComplex from "./CardComplex";
import AddBtn from "./Add";
import { isList } from "../../global/Global";

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
    const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false)
    const [isObject, setIsObject] = useState<boolean>(false)

    useEffect(() => {
        setIsDataLoaded(isList(data))
    }, [data])

    useEffect(() => {
        if (isDataLoaded) {
            const item = data[0]
            setIsObject(typeof item === "string" || (item?.hasOwnProperty("name") && !item?.hasOwnProperty("link")))
        }
    },[isDataLoaded, data])

    return (
        isDataLoaded ? (
            <div className="flex flex-col">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:m-8">
                    {data.map((item, index) => {
                        return isObject ?
                            <CardBasic title={title} index={index} item={item} onDelete={onDelete} onInputChange={onInputChange} />
                            : <CardComplex title={title} index={index} item={item} onDelete={onDelete} onInputChange={onInputChange} />
                    })}

                    <AddBtn onAdd={onAdd} isObject={isObject} />
                </div>
                <FormButtons isChanged={isChanged} isLoading={isLoading} onSave={onSave} onCancel={onCancel} />
            </div>
        ) : null

    );
}

export default CardGrid