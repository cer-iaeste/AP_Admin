import React, { useState, useEffect, useContext } from "react";
import "../card/Card.css" // Keep this if it contains global styles you need
import CardContext from "../card/CardContext"; // Adjust path as necessary
import CardGrid from "../card/CardGrid";

interface FunFactsProps {
    facts: string[]
}

const FunFacts: React.FC<FunFactsProps> = ({ facts }) => {
    const context = useContext(CardContext)
    const setIsChanged = context?.setIsChanged
    const [factsData, setFactsData] = useState<string[]>([])

    useEffect(() => {
        setFactsData(structuredClone(facts))
        setIsChanged?.(false)
    }, [facts, setIsChanged]);

    useEffect(() => {
        const hasChanges = JSON.stringify(factsData) !== JSON.stringify(facts)
        setIsChanged?.(hasChanges)
    }, [factsData, facts, setIsChanged])

    // Defensive check after all hooks are called
    if (!context) return null
    // Destructure required functions and countryName from context after the check
    const { countryName, handleSave, handleDelete, handleAddNewItem, handleInputChange, handleCancel, isChanged, isLoading } = context

    const onAdd = () => handleAddNewItem(setFactsData, factsData, "")

    const onSave = () => {
        // Filter out empty facts before saving
        const factsToSave = factsData.filter(fact => fact.trim() !== '')
        handleSave(countryName, factsToSave, "facts", "Fun facts")
    };

    const onDelete = async (index: number) => await handleDelete(index, setFactsData, factsData)

    const onCancel = () => handleCancel(setFactsData, facts)

    const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) =>
        handleInputChange(setFactsData, factsData, facts, index, e.target.value)

    return (
        <CardGrid title="Fun fact" data={factsData} isChanged={isChanged} isLoading={isLoading} onDelete={onDelete} onInputChange={onInputChange} onSave={onSave} onAdd={onAdd} onCancel={onCancel} />
    );
};

export default FunFacts;
