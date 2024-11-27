import React, { useState, useEffect } from "react";
import CardFooter from "../card/CardFooter";
import "../card/Card.css"
import { TransportType, TransportFeature } from "../../types/types";
import { CardProps, TRANSPORT_CONSTANTS } from "../../global/Global";

interface TransportProps extends CardProps{
    transport: TransportType[]
}

interface TransportMapType {
    title: string
    icon: string
    id: number
    content: TransportFeature[]
}

const Transport: React.FC<TransportProps> = ({ country, transport, handleSave, handleDelete, handleCancel, handleBack, handleAddNewItem, handleInputChange }) => {
    const [transportData, setTransportData] = useState<TransportMapType[]>([])
    const [isChanged, setIsChanged] = useState(false)
    const [openIndex, setOpenIndex] = useState(-1); // State to manage which transport item is open

    const mapTransportData = (initialtransport: TransportType[]) => {

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

        return initialData.map(data => {
            data.content = initialtransport.find(t => t.id === data.id)?.features ?? []
            return data
        })
    }

    useEffect(() => {
        console.log(transport)
        setTransportData(mapTransportData(transport))
    }, [transport])

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? -1 : index); // Toggle open/close state
    };

    const hasLinks = (feature: TransportFeature) => feature?.hasOwnProperty("link");

    const onAdd = (index: number, transportId: number) => {
        console.log(index, transportId)
        const newItem: TransportFeature = { name: "" }
        if (transportId !== 1) newItem.link = ""
        console.log(newItem)
        handleAddNewItem(setTransportData, transportData, newItem, setIsChanged, index)
    }
    const onSave = () =>{ 
        const result: TransportType[] = transportData.map(t => ({
            id: t.id,
            features: t.content
        }))
        handleSave(country, result, "transport", "Transport", setIsChanged)
    }
    const onDelete = (index: number, itemIndex: number) => handleDelete(index, setTransportData, transportData, setIsChanged, itemIndex)
    const onCancel = () => handleCancel(setTransportData, mapTransportData(transport), setIsChanged)
    const onBack = () => handleBack(isChanged, setTransportData, mapTransportData(transport), setIsChanged)
    const onItemChange = (e: any, index: number, itemIndex: number, column: keyof TransportFeature) => handleInputChange(setTransportData, transportData, index, e.target.value, setIsChanged, column, itemIndex)


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
                                                    className="w-full p-2 bg-[#F1F1E6] border border-black font-semibold"
                                                    onChange={(e) => onItemChange(e, index, featureIndex, "name")}
                                                    placeholder="Title"
                                                />
                                                {hasLinks(feature) && (
                                                    <input
                                                        value={feature.link}
                                                        className="text-blue-500 underline w-full p-2 bg-[#F1F1E6] border border-black block sm:hidden mt-2"
                                                        onChange={(e) => onItemChange(e, index, featureIndex, "link")}
                                                        placeholder="Link (optional)"
                                                    />
                                                )}
                                            </td>
                                            {hasLinks(feature) && (
                                                <td className="p-2 text-lg sm:block hidden">
                                                    <input
                                                        value={feature.link}
                                                        className="text-blue-500 underline w-full p-2 bg-[#F1F1E6] border border-black"
                                                        onChange={(e) => onItemChange(e, index, featureIndex, "link")}
                                                        placeholder="Link (optional)"
                                                    />
                                                </td>
                                            )}
                                            <td className="p-2 w-10">
                                                {/* Remove button */}
                                                <button
                                                    type="button"
                                                    onClick={() => onDelete(index, featureIndex)}
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
                                        <button className="add-btn hover-bg-gradient"
                                            onClick={() => onAdd(index, transport.id)}>
                                            <i className="fa fa-plus"></i> Add new item
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}

            <CardFooter isChanged={isChanged} onCancel={onCancel} onSave={onSave} onBack={onBack}/>
        </div>
    )
}

export default Transport;