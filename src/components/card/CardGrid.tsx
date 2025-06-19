import React, { useState, useEffect } from "react";
import FormButtons from "./FormButtons";
import CardBasic from "./CardBasic";
import CardComplex from "./CardComplex";
import AddBtn from "./Add";
import { isList } from "../../global/Global";
import { CityType, OtherType, TransportFeature } from "../../types/types";

interface CardGridProps {
    data: string[] | OtherType[] | CityType[] | TransportFeature[]
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
    const [isBasic, setisBasic] = useState<boolean>(false)

    useEffect(() => {
        setIsDataLoaded(isList(data))
    }, [data])

    useEffect(() => {
        if (isDataLoaded) {
            setisBasic(["Fun fact", "Airports"].includes(title))
        }
    },[isDataLoaded, data])

    return (
        isDataLoaded ? (
            <div className="flex flex-col bg-transparent">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 lg:m-8">
                    {data.map((item, index) => {
                        return isBasic ?
                            <CardBasic title={title} index={index} item={item} onDelete={onDelete} onInputChange={onInputChange} />
                            : <CardComplex title={title} index={index} item={item} onDelete={onDelete} onInputChange={onInputChange} />
                    })}

                    <AddBtn onAdd={onAdd} isBasic={isBasic} />
                </div>
                <FormButtons isChanged={isChanged} isLoading={isLoading} onSave={onSave} onCancel={onCancel} />
            </div>
        ) : null

    );
}

export default CardGrid