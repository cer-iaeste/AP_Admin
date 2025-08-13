import React, { useState, useEffect } from "react";
import FormButtons from "./FormButtons";
import CardBasic from "./CardBasic";
import CardComplex from "./CardComplex";
import AddBtn from "./Add";
import { isList } from "../../global/Global";
import { CardObject, CityType, CuisineType, OtherType, TransportFeature } from "../../types/types";
import Pagination from "../../global/Pagination";

interface CardGridProps {
    data: CardObject[];
    title: string;
    isChanged: boolean;
    isLoading: boolean;
    icon?: string;
    onDelete: (index: number) => void;
    onInputChange: (e: any, index: number, column?: string) => void;
    onSave: (newData: any[]) => void;
    onAdd: () => void;
    onCancel: () => void;
}

const CardGrid: React.FC<CardGridProps> = ({
    title,
    data,
    isChanged,
    isLoading,
    onDelete,
    onInputChange,
    onSave,
    onAdd,
    onCancel
}) => {
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isBasic, setIsBasic] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState<CardObject[]>([]);
    const [paginatedData, setPaginatedData] = useState<CardObject[]>([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingItem, setEditingItem] = useState<number | undefined>(undefined);

    useEffect(() => {
        setIsDataLoaded(isList(data));
        setFilteredData(data);
        console.log(data)
    }, [data]);

    useEffect(() => {
        if (isDataLoaded) setIsBasic(["Fun fact", "Airports"].includes(title));
    }, [isDataLoaded, title]);

    useEffect(() => {
        const query = searchQuery.toLowerCase();
        const filtered = data.filter(item => {
            const content = item.data;

            if (typeof content === "string") return content.toLowerCase().includes(query);
            if ("title" in content && content.title?.toLowerCase().includes(query)) return true;
            if ("name" in content && content.name?.toLowerCase().includes(query)) return true;
            if ("description" in content && content.description?.toLowerCase().includes(query)) return true;

            return false;
        }) ?? [];

        setFilteredData(filtered);
    }, [searchQuery, data]);


    useEffect(() => {
        setIsEditMode(editingItem !== undefined);
    }, [editingItem]);

    const handleCancel = () => {
        setEditingItem(undefined);
        onCancel();
    };

    const handleSave = () => {
        setEditingItem(undefined);
        onSave(data.map(item => item.data))
    };

    const handleInputChange = (e: any, index: number, column?: string) => {
        const fullIndex = data.findIndex(d => d.id === index);
        if (fullIndex !== -1) onInputChange(e, fullIndex, column);
    };

    const handleDelete = (index: number) => {
        const fullIndex = data.findIndex(d => d.id === index);
        if (fullIndex !== -1) onDelete(fullIndex);
    };

    return isDataLoaded ? (
        <div className="flex flex-col bg-transparent">
            {/* Header Controls */}
            <div className="flex flex-row justify-between items-center gap-4 mt-4 mb-2 px-2">
                <input
                    type="text"
                    placeholder={`Search ${title.toLowerCase()}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-input px-4 py-2 border border-blue-300 rounded-lg text-lg shadow-sm"
                />

                <button
                    onClick={onAdd}
                    className="base-btn bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-lg shadow-md flex items-center gap-2"
                >
                    <i className="fa fa-plus" />
                    <span className="hidden md:block">Add {title}</span>
                </button>
            </div>

            {/* Card Grid */}
            {paginatedData.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
                    {paginatedData.map((item) => {
                        const isEditable = editingItem === item.id;
                        const isString = typeof item?.data === "string";
                        const mainCol = typeof item?.data !== "string" && "name" in item?.data ? "name" : "title"
                        const secondaryCol = typeof item?.data !== "string" && "link" in item?.data ? "link" : "description"

                        return (
                            <div
                                key={item.id}
                                className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-2xl shadow-xl border border-blue-100
                                        flex flex-col min-h-[300px] transition-all duration-300 transform hover:scale-103 hover:shadow-2xl"
                            >
                                {/* Header */}
                                <div className="flex justify-between items-center pb-2 mb-2 border-b-2 border-blue-200 text-lg font-bold text-gray-800">
                                    <span>{title} #{item.id + 1}</span>
                                    <div className="flex gap-2">
                                        {isEditable ? (
                                            <>
                                                <button
                                                    onClick={handleSave} disabled={!isChanged} title="Save"
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center ${isChanged ? "bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white" : "bg-gray-300 text-gray-100"
                                                        }`}
                                                >
                                                    <i className="fa fa-floppy-disk text-base" />
                                                </button>
                                                <button
                                                    onClick={handleCancel} title="Cancel"
                                                    className="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white"
                                                >
                                                    <i className="fa fa-x text-base" />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => setEditingItem(item.id)} disabled={isEditMode} title="Edit"
                                                    className={`w-8 h-8 rounded-full 
                                                    ${isEditMode ? "bg-gray-300 text-gray-100" : "bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white"}`}
                                                >
                                                    <i className="fa fa-pen-to-square text-base" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)} disabled={isEditMode} title="Delete"
                                                    className={`w-8 h-8 rounded-full 
                                                    ${isEditMode ? "bg-gray-300 text-gray-100" : "bg-red-100 text-red-600 hover:bg-red-600 hover:text-white"}`}
                                                >
                                                    <i className="fa fa-trash text-base" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Main Input */}
                                <textarea
                                    placeholder="Enter name or value" disabled={!isEditable} rows={isString ? 5 : 2}
                                    value={typeof item.data === "string" ? item.data : (item.data as Record<"name" | "title", string>)[mainCol]}
                                    onChange={(e) => handleInputChange(e, item.id, mainCol)}
                                    className={`w-full p-3 border rounded-md text-base font-semibold shadow-sm text-black
                                    ${isEditable ? "bg-white border-blue-500 outline-none ring-1 ring-blue-500/50 resize-y" : "bg-gray-300 border-gray-300"}`}
                                />

                                {/* Secondary Input (optional) */}
                                {!isString && secondaryCol && (
                                    <div className="mt-4">
                                        <div className="text-lg font-semibold text-gray-700 flex items-center gap-x-2 mb-1">
                                            <i className="fa-solid fa-file-lines text-blue-600" />
                                            {secondaryCol.charAt(0).toUpperCase() + secondaryCol.slice(1)}:
                                        </div>
                                        <textarea
                                            placeholder={`Enter ${secondaryCol}`} disabled={!isEditable} rows={secondaryCol === "link" ? 1 : 4}
                                            value={(item.data as unknown as Record<"link" | "description", string>)[secondaryCol] || ""}
                                            onChange={(e) => handleInputChange(e, item.id, secondaryCol)}
                                            className={`w-full p-3 border rounded-md text-base font-semibold shadow-sm text-black
                                            ${isEditable ? "bg-white border-blue-500 outline-none ring-1 ring-blue-500/50 resize-y" : "bg-gray-300 border-gray-300"}`}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex w-full justify-center mt-16 mb-6">
                    <div
                        className="bg-red-50 border border-red-200 text-red-700 px-8 py-6 rounded-xl shadow-md flex items-center space-x-3 text-lg sm:text-xl"
                        role="alert" aria-live="polite"
                    >
                        <i className="fa-solid fa-triangle-exclamation mr-2 text-2xl"></i>{" "}
                        <span>No data found!</span>
                    </div>
                </div>
            )}



            {/* Pagination Controls */}
            <Pagination data={filteredData} setPaginatedData={setPaginatedData} />
        </div>
    ) : null;
};

export default CardGrid;
