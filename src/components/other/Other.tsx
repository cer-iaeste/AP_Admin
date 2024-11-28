import React, { useState, useEffect } from "react";
import CardFooter from "../card/CardFooter";
import "../card/Card.css"
import { OtherType } from "../../types/types";
import useWindowSize from "../../hooks/useScreenSize";
import { CardProps } from "../../global/Global";

interface OtherProps extends CardProps {
    other: OtherType[]
}

const Other: React.FC<OtherProps> = ({ country, other, handleSave, handleDelete, handleCancel, handleBack, handleAddNewItem, handleInputChange }) => {
    const [otherData, setOtherData] = useState<OtherType[]>([])
    const [isChanged, setIsChanged] = useState(false)

    const { width } = useWindowSize()

    useEffect(() => {
        setOtherData(other)
    }, [other])

    const onAdd = () => handleAddNewItem(setOtherData, otherData, { title: "", description: "" }, setIsChanged)
    const onSave = () => handleSave(country, otherData, "otherInformation", "Other information", setIsChanged)
    const onDelete = (index: number) => handleDelete(index, setOtherData, otherData, setIsChanged)
    const onCancel = () => handleCancel(isChanged, setOtherData, otherData, setIsChanged)
    const onBack = () => handleBack(isChanged, setOtherData, other, setIsChanged)
    const onInputChange = (e: any, index: number, column: string) => handleInputChange(setOtherData, otherData, index, e.target.value, setIsChanged, column)

    return (
        <div className="card-grid table-margins">
            {otherData.map((place, index) => (
                <div key={index} className="card-grid-body space-y-2">
                    {/* Title in the top right */}
                    <div className="flex flex-col text-start">
                        <label>
                            Title
                        </label>
                        <textarea
                            value={place.title}
                            rows={2}
                            onChange={(e) => onInputChange(e, index, "title")}
                            placeholder="Title"
                        />
                    </div>

                    <div className="flex flex-col text-start ">
                        <label>
                            Description
                        </label>
                        <textarea
                            value={place.description}
                            rows={width > 640 ? 8 : 4}
                            onChange={(e) => onInputChange(e, index, "description")}
                            placeholder="Description"
                        />
                    </div>

                    <div className="flex mt-2 justify-end">
                        <button
                            type="button"
                            onClick={() => onDelete(index)}
                            className="btn delete-btn"
                        >
                            <i className="fa fa-trash" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            ))}

            <div className="flex items-end">
                <button className="add-btn hover-bg-gradient" 
                        onClick={onAdd}>
                    <i className="fa fa-plus"></i> Add new info
                </button>
            </div>

            {/* Reusable CardFooter Component */}
            <CardFooter isChanged={isChanged} onCancel={onCancel} onSave={onSave} onBack={onBack}/>
        </div>
    )
}

export default Other;