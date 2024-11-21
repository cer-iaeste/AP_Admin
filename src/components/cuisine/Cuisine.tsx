import React, { useState, useEffect } from "react";
import CardFooter from "../card/CardFooter";
import { updateCountryField } from "../../service/CountryService";
import "../card/Card.css"
import { CuisineType, OtherType } from "../../types/types";
// import useWindowSize from "../../hooks/useScreenSize";

interface CuisineProps {
    country: string
    cuisine: CuisineType
}

interface CuisineMapType {
    title: string
    icon: string
    content: OtherType[]
}

const Cuisine: React.FC<CuisineProps> = ({ country, cuisine }) => {
    const [cuisineData, setCuisineData] = useState<CuisineMapType[]>([])
    const [isChanged, setIsChanged] = useState(false)
    const [openIndex, setOpenIndex] = useState(-1); // State to manage which transport item is open

    // const { width } = useWindowSize()

    const setInitialCuisineData = () => {
        const data: CuisineMapType[] = [
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
        setCuisineData(data)
    }

    useEffect(() => {
        setInitialCuisineData()
    }, [cuisine])

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? -1 : index); // Toggle open/close state
    };

    // Handle the change in input during editing
    const handleInputChange = (e: any, index: number, itemIndex: number, column: keyof OtherType) => {
        const newData = structuredClone(cuisineData)
        newData[index].content[itemIndex][column] = e.target.value
        setCuisineData(newData)
        setIsChanged(true)
    };

    // Handle add new item
    const handleAddNewItem = (index: number) => {
        const newData = structuredClone(cuisineData)
        newData[index].content = [...newData[index].content, { title: "", description: "" }]
        setCuisineData(newData)
        setIsChanged(true)
    }

    // Handle delete with confirmation
    const handleDeleteClick = (index: number, itemIndex: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item?");
        if (confirmDelete) {
            const newData = structuredClone(cuisineData)
            newData[index].content = newData[index].content.filter((_: OtherType, i: number) => i !== itemIndex);
            setCuisineData(newData)
            setIsChanged(true)
        }
    }

    // Cancel the current action (reset the editing state)
    const handleCancel = () => {
        setInitialCuisineData()
        setIsChanged(false) // Reset action in progress
    };

    // Save changes (apply the changes and close edit mode)
    const handleSave = () => {
        const foodData = cuisineData[0].content
        const drinksData = cuisineData[1].content
        updateCountryField(country, foodData, "food", "Food").then(() => {
            updateCountryField(country, drinksData, "drinks", "Drinks").then(() => {
                setIsChanged(false)
            })
        })
    };

    return (
        <div className="mt-5 table-margins">
            {cuisineData.map((data, index) => (
                <div key={index} className="mb-4 border border-[#1B75BB]">
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
                            <div key={index} className="card-grid-body space-y-2">
                                <div className="flex flex-col text-start">
                                    <label>
                                        Title
                                    </label>
                                    <textarea
                                        value={item.title}
                                        rows={1}
                                        onChange={(e) => handleInputChange(e, index, itemIndex, "title")}
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
                                        onChange={(e) => handleInputChange(e, index, itemIndex, "description")}
                                        placeholder="Description"
                                    />
                                </div>

                                <div className="flex mt-2 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteClick(index, itemIndex)}
                                        className="btn delete-btn"
                                    >
                                        <i className="fa fa-trash" aria-hidden="true"></i>
                                    </button>
                                </div>
                            </div>
                        )}
                        <div className="flex items-end">
                            <button className="flex text-xl items-center p-2 rounded-md bg-[#1B75BB] hover-bg-gradient text-white gap-2 justify-center" 
                                    onClick={() => handleAddNewItem(index)}>
                                <i className="fa fa-plus"></i> Add new item
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            <CardFooter isChanged={isChanged} onCancel={handleCancel} onSave={handleSave} />
        </div>
    )
}

export default Cuisine;