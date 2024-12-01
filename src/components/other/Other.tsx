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
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-6 table-margins mx-2">
            {otherData.map((place, index) => (
                <div key={index} className="card-container">
                    <div className="card-footer-right">
                        <button
                            type="button"
                            onClick={() => onDelete(index)}
                            className="flex items-center py-1"
                            title="Remove item"
                        >
                            <i className="fa fa-trash" aria-hidden="true"></i>
                        </button>
                    </div>
                    <div className="card-subcontainer">
                        {/* Title in the top right */}
                        <div className="card-header card-header-sub">
                            Title
                        </div>
                        {/* Value input below buttons */}
                        <textarea
                            placeholder="Title"
                            rows={2}
                            value={place.title}
                            onChange={(e) => onInputChange(e, index, "title")} // Update input value
                            className="card-textarea mt-1.5"
                        />
                    </div>

                    <div className="card-subcontainer">
                        {/* Title in the top right */}
                        <div className="card-header card-header-sub">
                            Description
                        </div>
                        {/* Value input below buttons */}
                        <textarea
                            placeholder="Description"
                            rows={width > 640 ? 8 : 4}
                            value={place.description}
                            onChange={(e) => onInputChange(e, index, "description")} // Update input value
                            className="card-textarea mt-1.5"
                        />
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
            <CardFooter isChanged={isChanged} onCancel={onCancel} onSave={onSave} onBack={onBack} />
        </div>
    )
}

export default Other;