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
                icon: "fa fa-plane-departure",
                content: []
            },
            {
                id: TRANSPORT_CONSTANTS.NATIONAL_AND_INTERNATIONAL_TRANSPORT,
                title: "National & International transport",
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
    }

    useEffect(() => {
        setTransportData(mapTransportData(transport))
    }, [transport])

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
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {transportData.map((transport, index) =>
                    <div key={transport.id} onClick={() => setOpenIndex(index)}
                        className="border border-[#1B75BB] bg-[#1B75BB] justify-center rounded-md p-2 font-semibold text-white text-lg hover-bg-gradient cursor-pointer flex flex-row items-center">
                        <i className={transport.icon}></i>
                        <h1 className="ml-2">{transport.title}</h1>
                    </div>
                )}
            </div>

            {openIndex !== -1 &&
                <div className="mt-4 border border-[#1B75BB] rounded-md bg-sky-200 p-4">
                    <div className="flex flex-row items-center justify-between border-b border-[#1B75BB] pb-2">
                        <div className="flex flex-row items-center text-2xl sm:text-4xl font-semibold text-[#1B75BB]">
                            <i className={transportData[openIndex].icon}></i>
                            <h1 className="ml-2">{transportData[openIndex].title}</h1>
                        </div>
                        <div className="flex items-end">
                            <button className="add-btn hover-bg-gradient"
                                onClick={() => onAdd(openIndex, transportData[openIndex].id)}>
                                <i className="fa fa-plus"></i>
                                <span className="hidden sm:block">Add new item</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-6 mx-2 mb-12">
                        {transportData[openIndex].content.map((feature, featureIndex) =>
                            <div key={openIndex + "_" + featureIndex} className="card-container bg-sky-100">
                                <div className="card-footer-right">
                                    <button
                                        type="button"
                                        onClick={() => onDelete(openIndex, featureIndex)}
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
                                    <textarea
                                        placeholder="Name"
                                        value={feature.name}
                                        rows={3}
                                        onChange={(e) => onItemChange(e, openIndex, featureIndex, "name")}
                                        className="card-textarea mt-1.5"
                                        style={{ scrollbarWidth: 'thin'}}
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
                                            onChange={(e) => onItemChange(e, openIndex, featureIndex, "link")} // Update input value
                                            className="card-textarea mt-1.5 underline text-sky-700"
                                        />
                                    </div>
                                }

                            </div>
                        )}
                    </div>
                </div>
            }

            <CardFooter isChanged={isChanged} onCancel={onCancel} onSave={onSave} onBack={onBack} />
        </div>
    )
}

export default Transport;