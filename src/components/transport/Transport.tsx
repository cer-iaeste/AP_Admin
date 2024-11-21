import React, { useState, useEffect } from "react";
import CardFooter from "../card/CardFooter";
import { updateCountryField } from "../../service/CountryService";
import "../card/Card.css"
import { TransportType, TransportFeature } from "../../types/types";
import { TRANSPORT_CONSTANTS } from "../../global/Global";

interface TransportProps {
    country: string
    transport: TransportType[]
}

interface TransportMapType {
    title: string
    icon: string
    id: number
    content: TransportFeature[]
}

const Transport: React.FC<TransportProps> = ({ country, transport }) => {
    const [transportData, setTransportData] = useState<TransportMapType[]>([])
    const [isChanged, setIsChanged] = useState(false)
    const [openIndex, setOpenIndex] = useState(-1); // State to manage which transport item is open

    const setInitialTransportData = (initialtransport: TransportType[]) => {

        const initialData: TransportMapType[] = [
            {
                id: TRANSPORT_CONSTANTS.AIRPORTS,
                title: "Airports",
                icon: "fa fa-plane",
                content: []
            },
            {
                id: TRANSPORT_CONSTANTS.NATIONAL_AND_INTERNATIONAL_TRANSPORT,
                title: "National & International transport",
                icon: "fa fa-train",
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

        initialData.forEach(data => {
            data.content = initialtransport.find(t => t.id === data.id)?.features ?? []
        })

        setTransportData(initialData)
    }

    useEffect(() => {
        setInitialTransportData(transport)
    }, [transport])

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? -1 : index); // Toggle open/close state
    };

    const hasLinks = (feature: TransportFeature) => feature?.hasOwnProperty("link");

    // Handle the change in input during editing
    const handleInputChange = (e: any, index: number, itemIndex: number, column: keyof TransportFeature) => {
        const newData = structuredClone(transportData)
        newData[index].content[itemIndex][column] = e.target.value
        setTransportData(newData)
        setIsChanged(true)
    };

    // Handle add new item
    const handleAddNewItem = (index: number, transportId: number) => {
        const newData = structuredClone(transportData)
        const newItem: TransportFeature = { name: "" }
        if (transportId !== 1) newItem.link = ""
        newData[index].content = [...newData[index].content, newItem]
        setTransportData(newData)
        setIsChanged(true)
    }

    // Handle delete with confirmation
    const handleDeleteClick = (index: number, itemIndex: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item?");
        if (confirmDelete) {
            const newData = structuredClone(transportData)
            newData[index].content = newData[index].content.filter((_: TransportFeature, i: number) => i !== itemIndex);
            setTransportData(newData)
            setIsChanged(true)
        }
    }

    // Cancel the current action (reset the editing state)
    const handleCancel = () => {
        setInitialTransportData(transport)
        setIsChanged(false) // Reset action in progress
    };

    // Save changes (apply the changes and close edit mode)
    const handleSave = () => {
        const result: TransportType[] = transportData.map(t => ({
            id: t.id,
            features: t.content
        }))
        updateCountryField(country, result, "transport", "Transport").then(() => {
            setIsChanged(false)
        })
    };

    return (
        <div className="mt-5">
            {transportData.map((transport, index) => (
                <div key={transport.id} className="mb-4 border border-[#1B75BB]">
                    <div
                        className="accordion-header hover-bg-gradient"
                        onClick={() => toggleAccordion(index)} // Call toggle function on click
                    >
                        <div className="accordion-header-items">
                            <i className={transport.icon}></i>
                            <h1>{transport.title}</h1>
                        </div>
                        <i className={`fa ${openIndex === index ? "fa-minus" : "fa-plus"} transition-transform duration-300`} />
                    </div>
                    <div className={`bg-white border-t border-[#1B75BB]  ${openIndex === index ? "max-h-full" : "max-h-0 overflow-hidden"}`}>
                        <table className="w-full">
                            <thead className="w-full border-b border-[#1B75BB]">
                                <tr className="bg-[#F1F1E6]">
                                    <th className="p-2 text-left font-semibold">Title</th>
                                    {hasLinks(transport.content[0]) && <th className="p-2 text-left font-semibold hidden sm:block">Link</th>}
                                    <th className="p-2 text-left font-semibold w-10">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!!transport.content.length &&
                                    transport.content.map((feature, featureIndex) => (
                                        <tr key={featureIndex} className="border-b border-[#1B75BB]">
                                            <td className="p-2 text-lg">
                                                <input
                                                    value={feature.name}
                                                    className="w-full p-2 bg-[#F1F1E6] border border-black"
                                                    onChange={(e) => handleInputChange(e, index, featureIndex, "name")}
                                                    placeholder="Title"
                                                />
                                                {hasLinks(feature) && (
                                                    <input
                                                        value={feature.link}
                                                        className="text-blue-500 underline w-full p-2 bg-[#F1F1E6] border border-black block sm:hidden mt-2"
                                                        onChange={(e) => handleInputChange(e, index, featureIndex, "link")}
                                                        placeholder="Link"
                                                    />
                                                )}
                                            </td>
                                            {hasLinks(feature) && (
                                                <td className="p-2 text-lg sm:block hidden">
                                                    <input
                                                        value={feature.link}
                                                        className="text-blue-500 underline w-full p-2 bg-[#F1F1E6] border border-black"
                                                        onChange={(e) => handleInputChange(e, index, featureIndex, "link")}
                                                        placeholder="Link"
                                                    />
                                                </td>
                                            )}
                                            <td className="p-2 w-10">
                                                {/* Remove button */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteClick(index, featureIndex)}
                                                    className="btn delete-btn mt-1"
                                                >
                                                    <i className="fa fa-trash" aria-hidden="true"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                                <tr>
                                    <td className="flex items-end p-2">
                                        <button className="flex text-base sm:text-xl items-center p-2 rounded-md bg-[#1B75BB] hover-bg-gradient text-white gap-2 justify-center"
                                            onClick={() => handleAddNewItem(index, transport.id)}>
                                            <i className="fa fa-plus"></i> Add new item
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}

            <CardFooter isChanged={isChanged} onCancel={handleCancel} onSave={handleSave} />
        </div>
    )
}

export default Transport;