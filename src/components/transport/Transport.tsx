import React, { useState, useEffect } from "react";
import CardFooter from "../card/CardFooter";
import "../card/Card.css"
import { TransportType, TransportFeature } from "../../types/types";
import { CardProps, TRANSPORT_CONSTANTS } from "../../global/Global";

interface TransportProps extends CardProps {
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
        setTransportData(mapTransportData(transport))
    }, [transport])

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? -1 : index); // Toggle open/close state
    };

    const hasLinks = (feature: TransportFeature) => feature?.hasOwnProperty("link");

    const onAdd = (index: number, transportId: number) => {
        const newItem: TransportFeature = { name: "" }
        if (transportId !== 1) newItem.link = ""
        handleAddNewItem(setTransportData, transportData, newItem, setIsChanged, index)
    }
    const onSave = () => {
        const result: TransportType[] = transportData.map(t => ({
            id: t.id,
            features: t.content
        }))
        handleSave(country, result, "transport", "Transport", setIsChanged)
    }
    const onDelete = (index: number, itemIndex: number) => handleDelete(index, setTransportData, transportData, setIsChanged, itemIndex)
    const onCancel = () => handleCancel(isChanged, setTransportData, mapTransportData(transport), setIsChanged)
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
                    <div className={`bg-sky-200 border-t border-[#1B75BB]  ${openIndex === index ? "max-h-72 overflow-y-scroll" : "max-h-0 overflow-hidden"}`}>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 my-6 mx-2">
                            {transport.content.map((feature, featureIndex) => (
                                <div key={index} className="card-container">
                                    <div className="card-footer-right">
                                        <button
                                            type="button"
                                            onClick={() => onDelete(index, featureIndex)}
                                            className="flex items-center py-1"
                                            title="Remove item"
                                        >
                                            <i className="fa fa-trash" aria-hidden="true"></i>
                                        </button>
                                    </div>
                                    <div className="card-subcontainer">
                                        {/* Title in the top right */}
                                        <div className="card-header card-header-sub">
                                            Name
                                        </div>
                                        {/* Value input below buttons */}
                                        <input
                                            placeholder="Name"
                                            value={feature.name}
                                            onChange={(e) => onItemChange(e, index, featureIndex, "name")}
                                            className="card-textarea mt-1.5"
                                        />
                                    </div>
                                    {hasLinks(feature) && 
                                        <div className="card-subcontainer">
                                        {/* Title in the top right */}
                                        <div className="card-header card-header-sub">
                                            Link
                                        </div>
                                        {/* Value input below buttons */}
                                        <input
                                            placeholder="Link (optional)"
                                            value={feature.link}
                                            onChange={(e) => onItemChange(e, index,  featureIndex, "link")} // Update input value
                                            className="card-textarea mt-1.5 underline text-sky-700"
                                        />
                                    </div>
                                    }
                                    
                                </div>
                            ))}

                            <div className="flex items-end">
                                <button className="add-btn hover-bg-gradient"
                                    onClick={() => onAdd(index, transport.id)}>
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

export default Transport;