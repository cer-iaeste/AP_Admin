import React, { useState, useEffect, useCallback, useContext, useRef } from "react";
import "../card/Card.css"
import { CuisineType, OtherType } from "../../types/types";
import CardContext from "../card/CardContext"
import CardGrid from "../card/CardGrid";

interface CuisineProps {
    cuisine: CuisineType
}

interface CuisineMapType {
    title: string
    icon: string
    content: OtherType[]
}

const Cuisine: React.FC<CuisineProps> = ({ cuisine }) => {
    const context = useContext(CardContext);
    const [mappedData, setMappedData] = useState<CuisineMapType[]>([])
    const [cuisineData, setCuisineData] = useState<CuisineMapType[]>([])
    const [openIndex, setOpenIndex] = useState(-1); // State to manage which transport item is open
    const [cuisineSectionChange, setCuisineSectionChange] = useState<boolean[]>([false, false])
    const [gridHeight, setGridHeight] = useState("0px");
    const contentRef = useRef<HTMLDivElement>(null); 

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
        setMappedData(mapCuisineData())
        setOpenIndex(-1);
        setGridHeight("0px");
    }, [cuisine, mapCuisineData])

    useEffect(() => {
        setCuisineData(mappedData)
    }, [mappedData])

    // Effect to handle animation when openIndex changes
    useEffect(() => {
        // Only run if a section is open and the ref is available
        if (openIndex !== -1 && contentRef.current) {
            // Set a small delay to allow content to render before calculating height
            setTimeout(() => {
                setGridHeight(`${contentRef.current?.scrollHeight ?? 0}px`);
            }, 100); // Small delay to allow content to render and fill its space
        } else {
            setGridHeight("0px"); // Collapse when no section is open
        }
    }, [openIndex, cuisineData]); 

    if (!context) return null
    // Destructure required functions and countryName from context after the check
    const { countryName, handleInputChange, handleSave, handleAddNewItem, handleDelete, handleCancel, isChanged, isLoading } = context;

    const resetCuisineChange = (promiseResult: boolean) => {
        if (promiseResult) setCuisineSectionChange([false, false])
    }

    const addCuisineSectionChange = (index: number) => {
        if (isChanged && !cuisineSectionChange[index]) {
            const cuisineChange = structuredClone(cuisineSectionChange)
            cuisineChange[index] = true
            setCuisineSectionChange(cuisineChange)
        } else if (!isChanged && cuisineSectionChange[index]) {
            const cuisineChange = structuredClone(cuisineSectionChange)
            cuisineChange[index] = false
            setCuisineSectionChange(cuisineChange)
        }
    }

    const onAdd = () => {
        handleAddNewItem(setCuisineData, cuisineData, { title: "", description: "" }, openIndex)
        addCuisineSectionChange(openIndex)
    }
    const onSave = () => {
        const foodData = cuisineData[0].content
        const drinksData = cuisineData[1].content
        handleSave(countryName, foodData, "food", "Food")
        handleSave(countryName, drinksData, "drinks", "Drinks")
        resetCuisineChange(true)
    }
    const onDelete = (itemIndex: number) => {
        handleDelete(openIndex, setCuisineData, cuisineData, itemIndex)
        addCuisineSectionChange(openIndex)
    }
    const onCancel = () => handleCancel(setCuisineData, mappedData).then(result => resetCuisineChange(result))

    const onItemChange = (e: any, itemIndex: number, column?: string) => {
        handleInputChange(setCuisineData, cuisineData, mappedData, openIndex, e.target.value, column, column, itemIndex)
        addCuisineSectionChange(openIndex)
    }

    const handleSectionClick = (index: number) => {
        setGridHeight("0px")
        if (index === openIndex) setOpenIndex(-1)
        else setTimeout(() => {
            setOpenIndex(index)
        }, 700)
    }


    return (
        <div className="mt-5">
            <div className="flex flex-row space-x-10">
                {cuisineData.map((data, index) =>
                    <div
                            key={data.title}
                            onClick={() => handleSectionClick(index)}
                            className={`
                                bg-white p-6 rounded-2xl shadow-lg border border-gray-200 w-44
                                flex flex-col items-center justify-center h-[80px] md:h-auto md:min-mh-[140px] // Ensure consistent height for selectors
                                transition-all duration-300 transform hover:scale-103 hover:shadow-xl cursor-pointer
                                ${openIndex === index
                                    ? 'bg-blue-600 text-white border-blue-700 shadow-2xl scale-102' // Active state
                                    : 'bg-gradient-to-br from-white to-green-50 hover:bg-blue-50 hover:border-blue-300' // Inactive hover state
                                }
                            `}
                        >
                            <i className={`${data.icon} text-3xl md:text-4xl mb-3 ${openIndex === index ? 'text-white' : 'text-gray-600'}`}></i>
                            <h1 className={`hidden md:block text-2xl font-bold ${openIndex === index ? 'text-white' : 'text-gray-800'}`}>
                                {data.title}
                            </h1>
                        </div>
                )}
            </div>

            {openIndex !== -1 &&
                <div ref={contentRef} className="md:bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-xl border border-green-100 my-4 transition-all duration-700 ease-in-out overflow-hidden" style={{ maxHeight: gridHeight }}>
                    <CardGrid title={cuisineData[openIndex].title} data={cuisineData[openIndex].content} isChanged={isChanged} isLoading={isLoading} onDelete={onDelete} onInputChange={onItemChange} onSave={onSave} onAdd={onAdd} onCancel={onCancel} />
                </div>
            }
        </div>
    )
}

export default Cuisine;