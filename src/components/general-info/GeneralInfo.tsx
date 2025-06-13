import React, { useState, useEffect } from "react";
import CardFooter from "../card/CardFooter";
import "../card/Card.css";
import { InformationType } from "../../types/types";
import { CardProps, GENERAL_INFO_CONSTANTS } from "../../global/Global";

interface GeneralInfoProps extends CardProps {
    information: InformationType[];
}

const GeneralInfo: React.FC<GeneralInfoProps> = ({
    country,
    information,
    handleSave,
    handleCancel,
    handleInputChange,
}) => {
    const [infoData, setInfoData] = useState<InformationType[]>([]);
    const [isChanged, setIsChanged] = useState(false);

    const mapInfo = (info: InformationType[]) =>
        GENERAL_INFO_CONSTANTS.map((name) => ({
            name,
            role: info.find((item) => item.name === name)?.role || "",
        }));

    useEffect(() => {
        setInfoData(mapInfo(information));
    }, [information]);

    const onSave = () =>
        handleSave(country, infoData, "information", "General information", setIsChanged);
    const onCancel = () =>
        handleCancel(isChanged, setInfoData, mapInfo(information), setIsChanged);
    const onInputChange = (e: any, index: number, column: string) =>
        handleInputChange(setInfoData, infoData, index, e.target.value, setIsChanged, column);

    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6 table-margins mx-2">
            {infoData.map((info, index) => (
                <div key={index} className="card-container">
                    <div className="card-header">
                        {info.name}
                    </div>
                    <textarea
                        placeholder="Description"
                        rows={2}
                        value={info.role}
                        onChange={(e) => onInputChange(e, index, "role")}
                        className="text-input"
                        style={{ scrollbarWidth: 'thin'}}
                    />
                </div>
            ))}

            <CardFooter isChanged={isChanged} onCancel={onCancel} onSave={onSave} />
        </div>
    );
};

export default GeneralInfo;
