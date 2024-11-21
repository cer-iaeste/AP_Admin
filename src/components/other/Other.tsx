import React, { useState, useEffect } from "react";
import CardFooter from "../card/CardFooter";
import { updateCountryField } from "../../service/CountryService";
import "../card/Card.css"
import { OtherType } from "../../types/types";
import useWindowSize from "../../hooks/useScreenSize";

interface OtherProps {
    country: string
    other: OtherType[]
}

const Other: React.FC<OtherProps> = ({ country, other }) => {
    const [otherData, setOtherData] = useState<OtherType[]>([])
    const [isChanged, setIsChanged] = useState(false)

    const { width } = useWindowSize()

    useEffect(() => {
        setOtherData(other)
    }, [other])

    // Handle the change in input during editing
    const handleInputChange = (e: any, index: number, column: keyof OtherType) => {
        const newData = structuredClone(otherData)
        newData[index][column] = e.target.value
        setOtherData(newData)
        setIsChanged(true)
    };

    // Handle add new item
    const handleAddNewItem = () => {
        setOtherData([...otherData, { title: "", description: "" }])
        setIsChanged(true)
    }

    // Handle delete with confirmation
    const handleDeleteClick = (index: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item?");
        if (confirmDelete) {
            const newData = structuredClone(otherData).filter((_: OtherType, i: number) => i !== index)
            setOtherData(newData)
            setIsChanged(true)
        }
    }

    // Cancel the current action (reset the editing state)
    const handleCancel = () => {
        setOtherData(structuredClone(other))
        setIsChanged(false) // Reset action in progress
    };

    // Save changes (apply the changes and close edit mode)
    const handleSave = () => {
        updateCountryField(country, otherData, "otherInformation", "Other information").then(() => {
            setIsChanged(false)
        })
    };

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
                            onChange={(e) => handleInputChange(e, index, "title")}
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
                            onChange={(e) => handleInputChange(e, index, "description")}
                            placeholder="Description"
                        />
                    </div>

                    <div className="flex mt-2 justify-end">
                        <button
                            type="button"
                            onClick={() => handleDeleteClick(index)}
                            className="btn delete-btn"
                        >
                            <i className="fa fa-trash" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            ))}

            <div className="flex items-end">
                <button className="flex text-xl items-center p-2 rounded-md bg-[#1B75BB] hover-bg-gradient text-white gap-2 justify-center" 
                        onClick={handleAddNewItem}>
                    <i className="fa fa-plus"></i> Add new info
                </button>
            </div>

            {/* Reusable CardFooter Component */}
            <CardFooter isChanged={isChanged} onCancel={handleCancel} onSave={handleSave} />
        </div>
    )
}

export default Other;