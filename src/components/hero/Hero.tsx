import React, { useState, useEffect, useContext, useCallback } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import "../summer-reception/Weekend.css";
import { getCountryDbName, removeFileFromStorage, uploadFileToStorage, confirmModalWindow } from "../../global/Global";
import { toast } from "react-toastify";
import CardContext from "../card/CardContext";
import { FileUploadProps, UserType } from "../../types/types";
import CountryInfoTab from "./CountryInfoTab";
import FilesTab from "./FilesTab";
import UsersTab from "./UsersTab";

interface HeroBannerProps {
    content: {
        name: string;
        flag: string;
        banner: string;
        pdf: string;
        region: string;
        users: UserType[]
    };
    role: "user" | "admin"
}

const Hero: React.FC<HeroBannerProps> = ({ content, role }) => {
    const context = useContext(CardContext);
    const [currentTab, setCurrentTab] = useState(0)
    // Country info tab items
    const [countryName, setCountryName] = useState<string>("");
    const [region, setRegion] = useState<string>("");
    // Files tab items
    const [flagImage, setFlagImage] = useState<string>("");
    const [bannerImage, setBannerImage] = useState<string>("");
    const [pdfFile, setPdfFile] = useState<string>("");
    // Users tab items
    const [users, setUsers] = useState<UserType[]>([])

    const setContent = useCallback((name: string, flag: string, banner: string, pdf: string, region: string, users: UserType[]) => {
        setCountryName(name)
        setRegion(region)
        setFlagImage(flag);
        setBannerImage(banner);
        setPdfFile(pdf);
        setUsers(users)
    }, []);

    useEffect(() => {
        setContent(content.name, content.flag, content.banner, content.pdf, content.region.toLowerCase(), content.users);
    }, [content, setContent]);


    if (!context) return null;
    const { countryName: countryNameContext, handleSave, handleUpload, handleDelete, handleCancel, isChanged, isLoading, setIsChanged } = context;

    const handleOnTabChange = async (index: number) => {
        if (index === currentTab) return

        if (isChanged) {
            const confirmed = await confirmModalWindow("All unsaved changes will be lost")
            if (confirmed) {
                setCurrentTab(index)
                setIsChanged(false)
            }
        } else setCurrentTab(index)
    }

    const handleCountryInfoSave = (newCountryName: string, newRegion: string) => {
        handleSave(countryNameContext, newRegion, "region", "Region");
        handleSave(countryNameContext, newCountryName, "name", "Country name");
        handleSave(countryNameContext, newCountryName, "imageAlt", "Image alt name");
        setCountryName(newCountryName)
        setRegion(newRegion)
    }

    const handleFilesSave = async (filesToSave: FileUploadProps[]) => {
        const name = getCountryDbName(countryName);
        try {
            filesToSave.forEach(async ({ fileToUpload, fileToDelete, type, defaultFile, column, title }) => {
                const uploadedFileUrl = fileToUpload ? await uploadFileToStorage(name, fileToUpload, type) : defaultFile
                if (fileToDelete && fileToDelete !== defaultFile) await removeFileFromStorage(fileToDelete)
                handleSave(countryNameContext, uploadedFileUrl, column, title);
                if (type === "flag") setFlagImage(uploadedFileUrl ?? "")
                else if (type === "banner") setBannerImage(uploadedFileUrl ?? "")
                else setPdfFile(uploadedFileUrl ?? "")
            })
        } catch (error) {
            toast.error(`Failed to save changes: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    const handleDeleteFile = async (file: string, setData: (data: any) => void, setFileToDelete: (file: string) => void, setFiletoUpload: (file: undefined) => void) => {
        const del = await handleDelete(0, setData, null);
        if (del) {
            setFileToDelete(file);
            setFiletoUpload(undefined);
        }
    };

    const onCancel = async (resetData: () => void) => await handleCancel(resetData)

    return (
        <section className="text-[#1B75BB] mt-8">
            <TabGroup selectedIndex={currentTab} onChange={handleOnTabChange}>
                <TabList className="flex space-x-4 mb-6 rounded-xl bg-blue-50 p-2 shadow-inner w-full">
                    {[{
                        label: 'Country Info', icon: 'fa-solid fa-globe'
                    }, {
                        label: 'Files', icon: 'fa-solid fa-file'
                    }, {
                        label: 'Users', icon: 'fa-solid fa-users'
                    }].map(({ label, icon }) => (
                        <Tab
                            key={label}
                            className={({ selected }) =>
                                `w-full py-2.5 text-sm md:text-xl leading-5 font-semibold text-blue-800 rounded-lg flex items-center justify-center gap-2
                                ${selected ? 'bg-white shadow text-blue-900' : 'hover:bg-white/70 text-blue-600'}`
                            }
                        >
                            <i className={`${icon} text-base`} />
                            <span className="hidden md:block">{label}</span>
                        </Tab>
                    ))}
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <CountryInfoTab
                            countryName={countryName}
                            region={region}
                            setIsChanged={setIsChanged}
                            isChanged={isChanged}
                            isLoading={isLoading}
                            handleCancel={onCancel}
                            handleCountryInfoSave={handleCountryInfoSave}
                        />
                    </TabPanel>
                    <TabPanel>
                        <FilesTab 
                            flag={flagImage}
                            banner={bannerImage}
                            pdf={pdfFile}
                            handleUpload={handleUpload}
                            handleDeleteFile={handleDeleteFile}
                            handleFilesSave={handleFilesSave}
                            handleCancel={onCancel}
                            setIsChanged={setIsChanged}
                            isChanged={isChanged}
                            isLoading={isLoading}
                        />
                    </TabPanel>
                    <TabPanel>
                        <UsersTab 
                            countryName={countryName}
                            users={users}
                            setUsers={setUsers}
                            role={role}
                        />
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </section >
    );
};

export default Hero;
