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
    const onSave = () =>{ 
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
                <div key={data.title} className="mb-4 border border-[#1B75BB]">
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
                    <div className={`card-grid bg-amber-100 ${openIndex === index ? "max-h-full p-2" : "max-h-0 overflow-hidden"}`}>
                        {data.content?.map((item, itemIndex) =>
                            <div key={data.title + itemIndex} className="card-grid-body space-y-2">
                                <div className="flex flex-col text-start">
                                    <label>
                                        Title
                                    </label>
                                    <textarea
                                        value={item.title}
                                        rows={1}
                                        onChange={(e) => onItemChange(e, index, itemIndex, "title")}
                                        placeholder="Title"
                                    />
                                </div>

                                <div className="flex flex-col text-start ">
                                    <label>
                                        Description
                                    </label>
                                    <textarea
                                        value={item.description}
                                        rows={4}
                                        onChange={(e) => onItemChange(e, index, itemIndex, "description")}
                                        placeholder="Description"
                                    />
                                </div>

                                <div className="flex mt-2 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => onDelete(index, itemIndex)}
                                        className="btn delete-btn"
                                    >
                                        <i className="fa fa-trash" aria-hidden="true"></i>
                                    </button>
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
            ))}

            <CardFooter isChanged={isChanged} onCancel={onCancel} onSave={onSave} onBack={onBack}/>
        </div>
    )
}

export default Cuisine;