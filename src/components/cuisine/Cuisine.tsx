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
        <div className="mt-5 table-margins">
            {cuisineData.map((data, index) => (
                <div key={data.title} className="mb-4 border-2 border-[#1B75BB]">
                    <div
                        className="accordion-header hover-bg-gradient"
                        onClick={() => toggleAccordion(index)} // Call toggle function on click
                    >
                        <div className="flex items-center gap-4">
                            <i className={data.icon}></i>
                            <h1>{data.title}</h1>
                        </div>
                        <i className={`fa ${openIndex === index ? "fa-minus" : "fa-plus"} transition-transform duration-300`} />
                    </div>
                    <div className={`bg-sky-200 ${openIndex === index ? "max-h-72 overflow-y-scroll p-2" : "max-h-0 overflow-hidden"}`}>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 my-6 mx-2">
                            {data.content?.map((item, itemIndex) =>
                                <div key={data.title + itemIndex} className="card-container">
                                    <div className="card-footer-right">
                                        <button
                                            type="button"
                                            onClick={() => onDelete(index, itemIndex)}
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
                                        <input
                                            placeholder="Title"
                                            value={item.title}
                                            onChange={(e) => onItemChange(e, index, itemIndex, "title")}
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
                                            placeholder="Description (optional)"
                                            value={item.description}
                                            rows={4}
                                            onChange={(e) => onItemChange(e, index, itemIndex, "description")} // Update input value
                                            className="card-textarea mt-1.5"
                                        />
                                    </div>

                                </div>
                            )}
                            <div className="flex items-end">
                                <button className="add-btn hover-bg-gradient"
                                    onClick={() => onAdd(index)}>
                                    <i className="fa fa-plus"></i> Add new item
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            ))}

            <CardFooter isChanged={isChanged} onCancel={onCancel} onSave={onSave} onBack={onBack} />
        </div>
    )
}

export default Cuisine;