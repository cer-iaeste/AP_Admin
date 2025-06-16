import React, { useState, useEffect, useCallback, useContext } from "react";
import "../card/Card.css" // Keep this if it contains global styles you need
import CardContext from "../card/CardContext"; // Adjust path as necessary
import CardGrid from "../card/CardGrid";

interface FunFactsProps {
    facts: string[]
}

const FunFacts: React.FC<FunFactsProps> = ({ facts }) => {
    const context = useContext(CardContext);

    // All useState, useCallback, useEffect hooks must be called unconditionally before any early returns
    const [factsData, setFactsData] = useState<string[]>([]);
    const [isChanged, setIsChanged] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setFactsData(structuredClone(facts)); // Use structuredClone for a deep copy
        setIsChanged(false); // Reset changed status on initial load or prop update
    }, [facts]);

    useEffect(() => {
        // Compare current local state with original props to detect changes
        const hasChanges = JSON.stringify(factsData) !== JSON.stringify(facts);
        setIsChanged(hasChanges);
        // If you have a handleChange prop from the parent to update a shared state, call it here:
        // if (context?.handleChange) context.handleChange(hasChanges);
    }, [factsData, facts]); // Add `facts` to dependencies for comparison

    // Defensive check after all hooks are called
    if (!context) return null;

    // Destructure required functions and countryName from context after the check
    const { countryName, handleSave, handleDelete, handleAddNewItem, handleInputChange, handleCancel } = context;
    // handleCancel is explicitly removed from context destructuring, as requested it's not in use.

    const onAdd = () => {
        handleAddNewItem(setFactsData, factsData, "", setIsChanged);
    };

    const onSave = () => {
        setIsLoading(true)
        // Filter out empty facts before saving
        const factsToSave = factsData.filter(fact => fact.trim() !== '');
        handleSave(countryName, factsToSave, "facts", "Fun facts", setIsChanged);
    };

    const onDelete = async (index: number) => await handleDelete(index, setFactsData, factsData, setIsChanged);

    const onCancel = () => handleCancel(isChanged, setFactsData, facts, setIsChanged);

    const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) =>
        handleInputChange(setFactsData, factsData, facts, index, e.target.value, setIsChanged);

    return (
        <CardGrid title="Fun fact" data={factsData} isChanged={isChanged} isLoading={isLoading} onDelete={onDelete} onInputChange={onInputChange} onSave={onSave} onAdd={onAdd} onCancel={onCancel} />
    );
};

export default FunFacts;
