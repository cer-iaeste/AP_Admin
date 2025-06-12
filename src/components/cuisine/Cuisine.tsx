import React, { useState, useEffect, useCallback } from "react";
import CardFooter from "../card/CardFooter";
import "../card/Card.css"
import { CuisineType, OtherType } from "../../types/types";
import { CardProps } from "../../global/Global";

interface CuisineProps extends CardProps {
    cuisine: CuisineType
}

interface CuisineMapType {
    title: string
    icon: string
    content: OtherType[]
}

const Cuisine: React.FC<CuisineProps> = ({ country, cuisine, handleSave, handleDelete, handleCancel, handleBack, handleAddNewItem, handleInputChange }) => {
    const [cuisineData, setCuisineData] = useState<CuisineMapType[]>([])
    const [isChanged, setIsChanged] = useState(false)
    const [openIndex, setOpenIndex] = useState(-1); // State to manage which transport item is open
    const [cuisineSectionChange, setCuisineSectionChange] = useState<boolean[]>([false, false])

    // const { width } = useWindowSize()
    const mapCuisineData = useCallback(() => {
        return [
            {
                title: "Food",
                icon: "fa fa-burger",
                content: cuisine.food
            },
            {
                title: "Drinks",
                icon: "fa fa-martini-glass-citrus",
                content: cuisine.drinks
            }
        ]
    }, [cuisine])

    useEffect(() => {
        setCuisineData(mapCuisineData())
    }, [cuisine, mapCuisineData])

    const resetCuisineChange = (promiseResult: boolean) => {
        if (promiseResult) setCuisineSectionChange([false, false])
    }

    const addCuisineSectionChange = (index: number) => {
        if (!cuisineSectionChange[index]) {
            const cuisineChange = structuredClone(cuisineSectionChange)
            cuisineChange[index] = true
            setCuisineSectionChange(cuisineChange)
        }
    }

    const onAdd = (index: number) => {
        handleAddNewItem(setCuisineData, cuisineData, { title: "", description: "" }, setIsChanged, index)
        addCuisineSectionChange(index)
    }
    const onSave = () => {
        const foodData = cuisineData[0].content
        const drinksData = cuisineData[1].content
        handleSave(country, foodData, "food", "Food", setIsChanged)
        handleSave(country, drinksData, "drinks", "Drinks", setIsChanged)
        resetCuisineChange(true)
    }
    const onDelete = (index: number, itemIndex: number) => {
        handleDelete(index, setCuisineData, cuisineData, setIsChanged, itemIndex)
        addCuisineSectionChange(index)
    }
    const onCancel = () => handleCancel(isChanged, setCuisineData, mapCuisineData(), setIsChanged).then(result => resetCuisineChange(result))
    const onBack = () => {
        handleBack(isChanged, setCuisineData, mapCuisineData(), setIsChanged)
        resetCuisineChange(true)
    }
    const onItemChange = (e: any, index: number, itemIndex: number, column: keyof OtherType) => {
        handleInputChange(setCuisineData, cuisineData, index, e.target.value, setIsChanged, column, itemIndex)
        addCuisineSectionChange(index)
    }


    return (
        <div className="mt-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="hidden md:block"></div>
                {cuisineData.map((data, index) =>
                    <div key={data.title} onClick={() => setOpenIndex(index)}
                        className={`border border-[#1B75BB] ${openIndex !== index ? 'bg-[#1B75BB]' : 'bg-gradient'} relative justify-center rounded-md p-2 font-semibold text-white text-lg hover-bg-gradient cursor-pointer flex flex-row items-center`}>
                        <i className={data.icon}></i>
                        <h1 className="ml-2">{data.title}</h1>
                        {!!cuisineSectionChange[index] &&
                            <div className="absolute -top-1 -left-1 rounded-lg bg-red-500 text-white w-5 sm:w-8">
                                <i className="fa-solid fa-exclamation"></i>
                            </div>
                        }
                    </div>
                )}
            </div>

            {openIndex !== -1 &&
                <div className="mt-4 border border-[#1B75BB] rounded-md bg-sky-200 p-4">
                    <div className="flex flex-row items-center justify-between border-b border-[#1B75BB] pb-2">
                        <div className="flex flex-row items-center text-2xl sm:text-4xl font-semibold text-[#1B75BB]">
                            <i className={cuisineData[openIndex].icon}></i>
                            <h1 className="ml-2">{cuisineData[openIndex].title}</h1>
                        </div>
                        <div className="flex items-end">
                            <button className="add-btn hover-bg-gradient"
                                onClick={() => onAdd(openIndex)}>
                                <i className="fa fa-plus"></i>
                                <span className="hidden sm:block">Add new item</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mt-6 mx-2 mb-12">
                        {cuisineData[openIndex].content.map((item, itemIndex) =>
                            <div key={openIndex + "_" + itemIndex} className="card-container bg-sky-100">
                                <div className="card-footer-right">
                                    <button
                                        type="button"
                                        onClick={() => onDelete(openIndex, itemIndex)}
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
                                        placeholder="Name"
                                        value={item.title}
                                        rows={2}
                                        onChange={(e) => onItemChange(e, openIndex, itemIndex, "title")}
                                        className="text-input mt-1.5"
                                        style={{ scrollbarWidth: 'thin' }}
                                    />
                                </div>
                                <div className="card-subcontainer">
                                    {/* Title in the top right */}
                                    <div className="card-header card-header-sub">
                                        Description
                                    </div>
                                    {/* Value input below buttons */}
                                    <textarea
                                        placeholder="Description (optional)"
                                        value={item.description}
                                        rows={4}
                                        onChange={(e) => onItemChange(e, openIndex, itemIndex, "description")} // Update input value
                                        className="text-input mt-1.5"
                                        style={{ scrollbarWidth: 'thin' }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            }

            <CardFooter isChanged={isChanged} onCancel={onCancel} onSave={onSave} onBack={onBack} />
        </div>
    )
}

export default Cuisine;