import React, { useState, useEffect } from "react";
import CardFooter from "../card/CardFooter";
import "../card/Card.css"
import { InformationType } from "../../types/types";
import useWindowSize from "../../hooks/useScreenSize";
import { CardProps, GENERAL_INFO_CONSTANTS } from "../../global/Global";

interface GeneralInfoProps extends CardProps {
    information: InformationType[]
}

const GeneralInfo: React.FC<GeneralInfoProps> = ({ country, information, handleSave, handleCancel, handleBack, handleInputChange }) => {
    const [infoData, setInfoData] = useState<InformationType[]>([])
    const [isChanged, setIsChanged] = useState(false)

    const { width } = useWindowSize()

    const mapInfo = (info: InformationType[]) => 
        GENERAL_INFO_CONSTANTS.map(name => ({
            name,
            role: info.find(item => item.name === name)?.role || ""
        }));    

    useEffect(() => {
        setInfoData(mapInfo(information))
    }, [information])

    const onSave = () => handleSave(country, infoData, "information", "General information", setIsChanged)
    const onCancel = () => handleCancel(isChanged, setInfoData, mapInfo(information), setIsChanged)
    const onBack = () => handleBack(isChanged, setInfoData, mapInfo(information), setIsChanged)
    const onInputChange = (e: any, index: number, column: string) => handleInputChange(setInfoData, infoData, index, e.target.value, setIsChanged, column)

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
                                    onChange={(e) => onInputChange(e, index, "role")}
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
            <CardFooter isChanged={isChanged} onCancel={onCancel} onSave={onSave} onBack={onBack}/>
        </div>
    )
}

export default GeneralInfo