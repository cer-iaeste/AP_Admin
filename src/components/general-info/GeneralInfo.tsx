import React, { useState, useEffect } from "react";
import CardFooter from "../card/CardFooter";
import "../card/Card.css"
import { InformationType } from "../../types/types";
import useWindowSize from "../../hooks/useScreenSize";
import { updateCountryField } from "../../service/CountryService";
import { GENERAL_INFO_CONSTANTS } from "../../global/Global";

interface GeneralInfoProps {
    country: string
    information: InformationType[]
}

const GeneralInfo: React.FC<GeneralInfoProps> = ({ country, information }) => {
    const [infoData, setInfoData] = useState<InformationType[]>([])
    const [isChanged, setIsChanged] = useState(false)

    const { width } = useWindowSize()

    const setInitialInfo = (info: InformationType[]) => {
        const newInfo: InformationType[] = GENERAL_INFO_CONSTANTS.map(info => ({
            name: info,
            role: ""
        }))
        info?.forEach((item: InformationType) => {
            const index = newInfo.findIndex(obj => obj.name === item.name)
            if (index !== -1) newInfo[index].role = item.role
        })
        setInfoData(newInfo)
    }

    useEffect(() => {
        setInitialInfo(information)
    }, [information])

    // Handle the change in input during editing
    const handleInputChange = (e: any, index: number) => {
        const newData = structuredClone(infoData)
        newData[index].role = e.target.value
        setInfoData(newData)
        setIsChanged(true)
    };

    // Cancel the current action (reset the editing state)
    const handleCancel = () => {
        setInitialInfo(information)
        setIsChanged(false) // Reset action in progress
    };

    // Save changes (apply the changes and close edit mode)
    const handleSave = () => {
        updateCountryField(country, infoData, "information", "General information").then(() => {
            setIsChanged(false)
        })
    };

    return (
        <div className="table-margins">
            <table className="card-table">
                <thead>
                    <tr className="card-table-head">
                        <th className="w-20 sm:w-44">Title</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {infoData.map((info, index) => (
                        <tr key={index} className="card-table-row text-lg sm:text-xl">
                            <td className="p-4 font-semibold">
                                {info.name}
                            </td>
                            <td>
                                <textarea
                                    placeholder="Description"
                                    rows={width > 640 ? 1 : 3}
                                    value={info.role}
                                    onChange={(e) => handleInputChange(e, index)}
                                    className="w-full p-2 border text-xl bg-[#F1F1E6]"
                                    style={{ wordWrap: 'break-word' }} // Ensure text wrapping within the cell
                                />
                            </td>
                        </tr>
                    ))
                    }
                </tbody>
            </table>

            {/* Reusable CardFooter Component */}
            <CardFooter isChanged={isChanged} onCancel={handleCancel} onSave={handleSave} />
        </div>
    )
}

export default GeneralInfo