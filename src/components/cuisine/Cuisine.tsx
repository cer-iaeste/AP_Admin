import React, { useState, useEffect } from "react";
import CardFooter from "../card/CardFooter";
import "../card/Card.css"
import { CuisineType, OtherType } from "../../types/types";
import { CardProps } from "../../global/Global";
// import useWindowSize from "../../hooks/useScreenSize";

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

    // const { width } = useWindowSize()
    const mapCuisineData = (): CuisineMapType[] => [
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

    useEffect(() => {
        setCuisineData(mapCuisineData())
    }, [cuisine])

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? -1 : index); // Toggle open/close state
    };

    const onAdd = (index: number) => handleAddNewItem(setCuisineData, cuisineData, { title: "", description: "" }, setIsChanged, index)
    const onSave = () => {
        const foodData = cuisineData[0].content
        const drinksData = cuisineData[1].content
        handleSave(country, foodData, "food", "Food", setIsChanged)
        handleSave(country, drinksData, "drinks", "Drinks", setIsChanged)
    }
    const onDelete = (index: number, itemIndex: number) => handleDelete(index, setCuisineData, cuisineData, setIsChanged, itemIndex)
    const onCancel = () => handleCancel(isChanged, setCuisineData, mapCuisineData(), setIsChanged)
    const onBack = () => handleBack(isChanged, setCuisineData, mapCuisineData(), setIsChanged)
    const onItemChange = (e: any, index: number, itemIndex: number, column: keyof OtherType) => handleInputChange(setCuisineData, cuisineData, index, e.target.value, setIsChanged, column, itemIndex)


    return (
        <div className="mt-5">
            <div className="grid grid-cols-2 gap-4">
                {cuisineData.map((data, index) =>
                    <div key={data.title} onClick={() => setOpenIndex(index)}
                        className="border border-[#1B75BB] bg-[#1B75BB] justify-center rounded-md p-2 font-semibold text-white text-lg hover-bg-gradient cursor-pointer flex flex-row items-center">
                        <i className={data.icon}></i>
                        <h1 className="ml-2">{data.title}</h1>
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
                                        className="card-textarea mt-1.5"
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
                                            className="card-textarea mt-1.5"
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