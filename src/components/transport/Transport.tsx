import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import CardFooter from "../card/CardFooter";
import "../card/Card.css"
import { TransportType, TransportFeature } from "../../types/types";
import { TRANSPORT_CONSTANTS } from "../../global/Global";
import CardContext from "../card/CardContext"
import CardGrid from "../card/CardGrid";

interface TransportProps {
    transport: TransportType[]
}

interface TransportMapType {
    title: string
    icon: string
    id: number
    content: TransportFeature[]
}

const Transport: React.FC<TransportProps> = ({ transport }) => {
    const context = useContext(CardContext);
    const [mappedData, setMappedData] = useState<TransportMapType[]>([])
    const [transportData, setTransportData] = useState<TransportMapType[]>([])
    const [openIndex, setOpenIndex] = useState(-1); // State to manage which transport item is open
    const [transportSectionChange, setTransportSectionChange] = useState<boolean[]>([false, false, false, false])
    const [gridHeight, setGridHeight] = useState("0px");
    const contentRef = useRef<HTMLDivElement>(null);

    const mapTransportData = useCallback((initialtransport: TransportType[]) => {
        const initialData: TransportMapType[] = [
            {
                id: TRANSPORT_CONSTANTS.AIRPORTS,
                title: "Airports",
                icon: "fa fa-plane-departure",
                content: []
            },
            {
                id: TRANSPORT_CONSTANTS.NATIONAL_AND_INTERNATIONAL_TRANSPORT,
                title: "International & National transport",
                icon: "fa fa-train-subway",
                content: []
            },
            {
                id: TRANSPORT_CONSTANTS.PUBLIC_TRANSPORT,
                title: "Public transport",
                icon: "fa fa-bus",
                content: []
            },
            {
                id: TRANSPORT_CONSTANTS.DISCOUNTS,
                title: "Discounts",
                icon: "fa fa-tag",
                content: []
            },
        ]

        return initialData.map(data => {
            data.content = initialtransport.find(t => t.id === data.id)?.features ?? []
            return data
        })
    }, [])

    useEffect(() => {
        setMappedData(mapTransportData(transport))
        setOpenIndex(-1);
        setGridHeight("0px");
    }, [transport, mapTransportData])

    useEffect(() => {
        setTransportData(mappedData)
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
    }, [openIndex, transportData]);


    if (!context) return null
    // Destructure required functions and countryName from context after the check
    const { countryName, handleInputChange, handleSave, handleAddNewItem, handleDelete, handleCancel, isChanged, isLoading } = context;

    const hasLinks = (feature: TransportFeature) => feature?.hasOwnProperty("link");

    const resetTransportChange = (promiseResult: boolean) => {
        if (promiseResult) setTransportSectionChange([false, false, false, false])
    }

    const addTransportSectionChange = (index: number) => {
        if (!transportSectionChange[index]) {
            const transportChange = structuredClone(transportSectionChange)
            transportChange[index] = true
            setTransportSectionChange(transportChange)
        }
    }

    const onAdd = () => {
        const transportId = transportData[openIndex].id
        const newItem: TransportFeature = { name: "" }
        if (transportId !== 1) newItem.link = ""
        handleAddNewItem(setTransportData, transportData, newItem, openIndex)
        addTransportSectionChange(openIndex)
    }
    const onSave = () => {
        const result: TransportType[] = transportData.map(t => ({
            id: t.id,
            features: t.content
        }))
        handleSave(countryName, result, "transport", "Transport")
        resetTransportChange(true)
    }
    const onDelete = (itemIndex: number) => {
        handleDelete(openIndex, setTransportData, transportData, itemIndex)
        addTransportSectionChange(openIndex)
    }
    const onCancel = () => handleCancel(setTransportData, mappedData).then(result => resetTransportChange(result))

    const onItemChange = (e: any, itemIndex: number, column?: string) => {
        handleInputChange(setTransportData, transportData, mappedData, openIndex, e.target.value, column, column, itemIndex)
        addTransportSectionChange(openIndex)
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
            <div className="grid grid-cols-4 gap-4 items-center">
                {transportData.map((data, index) =>
                    <div
                        key={data.title}
                        onClick={() => handleSectionClick(index)}
                        className={`
                                p-3 rounded-2xl shadow-lg border border-gray-200 gap-4
                                flex flex-row items-center justify-center md:h-[100px] // Ensure consistent height for selectors
                                transition-all duration-300 transform hover:scale-103 hover:shadow-xl cursor-pointer
                                ${openIndex === index
                                ? 'bg-blue-600 text-white border-blue-700 shadow-2xl scale-102' // Active state
                                : 'bg-gradient-to-br from-white to-green-50 hover:bg-blue-50 hover:border-blue-300' // Inactive hover state
                            }
                            `}
                    >
                        <i className={`${data.icon} text-xl md:text-2xl ${openIndex === index ? 'text-white' : 'text-gray-600'}`}></i>
                        <h1 className={`hidden md:block text-lg md:text-xl font-bold ${openIndex === index ? 'text-white' : 'text-gray-800'}`}>
                            {data.title}
                        </h1>
                    </div>
                )}
            </div>

            {openIndex !== -1 &&
                <div ref={contentRef} className="lg:bg-gradient-to-br from-white to-green-50 rounded-2xl lg:shadow-xl lg:border lg:border-green-100 my-4 transition-all duration-700 ease-in-out overflow-hidden" style={{ maxHeight: gridHeight }}>
                    <CardGrid title={transportData[openIndex].title} data={transportData[openIndex].content} isChanged={isChanged} isLoading={isLoading} onDelete={onDelete} onInputChange={onItemChange} onSave={onSave} onAdd={onAdd} onCancel={onCancel} />
                </div>
            }
        </div>
    )
}

export default Transport;