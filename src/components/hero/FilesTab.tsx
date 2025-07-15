import React, { useState, useEffect } from "react";
import { FileUploadProps, TabProps, UploadedFileType } from "../../types/types";
import ImagePopup from "../../global/ImagePopup";
import FormButtons from "../card/FormButtons";
import { toast } from "react-toastify";

interface FilesProps extends TabProps {
    flag: string
    banner?: string
    pdf?: string
    handleUpload: (event: React.ChangeEvent<HTMLInputElement>, folderName: string, data: any, setData: (data: any) => void, setDataToUpload: (data: any) => void, setDataToDelete?: (data: any) => void) => void
    handleDeleteFile: (file: string, setData: (data: any) => void, setFileToDelete: (file: string) => void, setFiletoUpload: (file: undefined) => void) => void
    handleFilesSave: (filesToSave: FileUploadProps[]) => void
}

const FilesTab: React.FC<FilesProps> = ({ flag, banner, pdf, handleUpload, handleDeleteFile, handleFilesSave, isChanged, isLoading, handleCancel }) => {
    const [flagImage, setFlagImage] = useState<string>("");
    const [flagToUpload, setFlagToUpload] = useState<UploadedFileType | undefined>(undefined);
    const [flagToDelete, setFlagToDelete] = useState<string>("");
    const [bannerImage, setBannerImage] = useState<string>("");
    const [bannerToUpload, setBannerToUpload] = useState<UploadedFileType | undefined>(undefined);
    const [bannerToDelete, setBannerToDelete] = useState<string>("");
    const [pdfFile, setPdfFile] = useState<string>("");
    const [pdfToUpload, setPdfToUpload] = useState<UploadedFileType | undefined>();
    const [pdfToDelete, setPdfToDelete] = useState<string>("");
    const [viewImage, setViewImage] = useState<string | null>(null);

    const closeModal = () => setViewImage(null);

    const setInitialFiles = () => {
        setFlagImage(flag)
        setBannerImage(banner ?? "")
        setPdfFile(pdf ?? "")
        setFlagToUpload(undefined)
        setBannerToUpload(undefined)
        setPdfToUpload(undefined)
        setFlagToDelete("")
        setBannerToDelete("")
        setPdfToDelete("")
    }

    useEffect(() => {
        if (flag) setInitialFiles()
    }, [banner, pdf, flag])

    const onUploadFile = (e: React.ChangeEvent<HTMLInputElement>, type: "flag" | "banner" | "pdf") => {
        if (type === "flag") handleUpload(e, "flag", flagImage, setFlagImage, setFlagToUpload, setFlagToDelete);
        else if (type === "banner") handleUpload(e, "banner", bannerImage, setBannerImage, setBannerToUpload, setBannerToDelete);
        else handleUpload(e, "pdf", pdf, setPdfFile, setPdfToUpload, setPdfToDelete);
    };

    const onDeleteFile = (type: "flag" | "banner" | "pdf") => {
        if (type === "flag") handleDeleteFile(flagImage, setFlagImage, setFlagToDelete, setFlagToUpload);
        else if (type === "banner") handleDeleteFile(bannerImage, setBannerImage, setBannerToDelete, setBannerToUpload)
        else handleDeleteFile(pdfFile, setPdfFile, setPdfToDelete, setPdfToUpload)
    }

    const onSave = () => {
        if (!flagImage && !flagToUpload) {
            toast.error("Please upload a banner image.");
            return;
        }

        handleFilesSave([
            {type: "flag", file: flagImage, fileToUpload: flagToUpload, fileToDelete: flagToDelete, defaultFile: flag, column: "imageSrc", title: "Flag"},
            {type: "banner", file: bannerImage, fileToUpload: bannerToUpload, fileToDelete: bannerToDelete, defaultFile: banner, column: "banner", title: "Hero banner"},
            {type: "pdf", file: pdfFile, fileToUpload: pdfToUpload, fileToDelete: pdfToDelete, defaultFile: pdf, column: "pdf", title: "PDF"},
        ])
    }

    const onCancel = () => handleCancel(setInitialFiles)

    return (
        <section>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Flag Upload */}
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 flex flex-col items-center justify-center min-h-[220px]">
                    <div className="text-xl font-semibold text-gray-700 pb-2 mb-4 border-b-2 border-blue-200 w-full text-center">
                        <i className="fa-solid fa-flag-usa mr-2 text-blue-600"></i> Country Flag
                    </div>
                    {flagImage ? (
                        <div className="flex flex-col flex-grow justify-center items-center w-full p-3 space-y-4">
                            <img src={flagImage} alt="Flag Preview" className="h-24 w-auto object-contain rounded-md shadow-md border border-gray-200" />
                            <span className="text-md font-medium text-gray-700 truncate w-full text-center">
                                Flag.jpg
                            </span>
                            <div className="flex items-center gap-4 mt-2">
                                <button
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onClick={() => setViewImage(flagImage)}
                                    title="View flag"
                                >
                                    <i className="fa fa-eye text-xl" />
                                </button>
                                <button
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    onClick={() => onDeleteFile("flag")}
                                    title="Delete flag"
                                >
                                    <i className="fa fa-trash text-xl" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <label
                            htmlFor="flag-upload"
                            className="flex flex-col flex-grow items-center justify-center w-full h-full p-6 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-100 transition-all duration-300 group"
                        >
                            <input
                                id="flag-upload"
                                type="file"
                                accept="image/*"
                                onChange={(e) => onUploadFile(e, 'flag')}
                                className="hidden"
                            />
                            <div className="text-center text-blue-500 group-hover:text-blue-700 transition-colors duration-300 flex flex-col items-center">
                                <i className="fa fa-image text-4xl mb-2"></i>
                                <p className="text-lg font-medium">Upload Flag</p>
                            </div>
                        </label>
                    )}
                </div>
                {/* Banner Upload */}
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 flex flex-col items-center justify-center min-h-[180px]">
                    <div className="text-xl font-semibold text-gray-700 pb-2 mb-4 border-b-2 border-blue-200 w-full text-center">
                        <i className="fa-solid fa-panorama mr-2 text-blue-600"></i> Hero Banner
                    </div>
                    {bannerImage ? (
                        <div className="flex flex-col flex-grow items-center justify-center w-full p-3 space-y-4">
                            <img src={bannerImage} alt="Hero Banner Preview" className="h-24 w-auto object-contain rounded-md shadow-md border border-gray-200" />
                            <span className="text-md font-medium text-gray-700 truncate w-full text-center">
                                Banner.jpg
                            </span>
                            <div className="flex items-center gap-4 mt-2">
                                <button
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onClick={() => setViewImage(bannerImage)}
                                    title="View banner"
                                >
                                    <i className="fa fa-eye text-xl" />
                                </button>
                                <button
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    onClick={() => onDeleteFile("banner")}
                                    title="Delete banner"
                                >
                                    <i className="fa fa-trash text-xl" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <label
                            htmlFor="banner-upload"
                            className="flex flex-col flex-grow items-center justify-center w-full h-full p-6 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-100 transition-all duration-300 group"
                        >
                            <input
                                id="banner-upload"
                                type="file"
                                accept="image/*"
                                onChange={(e) => onUploadFile(e, 'banner')}
                                className="hidden"
                            />
                            <div className="text-center text-blue-500 group-hover:text-blue-700 transition-colors duration-300 flex flex-col items-center">
                                <i className="fa fa-image text-4xl mb-2"></i>
                                <p className="text-lg font-medium">Upload Banner</p>
                            </div>
                        </label>
                    )}
                </div>

                {/* PDF Upload Card */}
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 flex flex-col items-center justify-center min-h-[220px]">
                    <div className="text-xl font-semibold text-gray-700 pb-2 mb-4 border-b-2 border-blue-200 w-full text-center">
                        <i className="fa-solid fa-file-pdf mr-2 text-blue-600"></i> Country PDF
                    </div>
                    {pdf ? (
                        <div className="flex flex-col flex-grow items-center justify-center w-full p-3 space-y-4">
                            <i className="fa-solid fa-file-pdf text-6xl text-red-600 mb-2"></i>
                            <span className="text-md font-medium text-gray-700 truncate w-full text-center">
                                CountryInfo.pdf
                            </span>
                            <div className="flex items-center gap-4 mt-2">
                                <a
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 transform hover:scale-110"
                                    href={pdf} target="_blank" rel="noreferrer"
                                    title="View PDF"
                                >
                                    <i className="fa fa-eye text-xl" />
                                </a>
                                <button
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200 transform hover:scale-110"
                                    onClick={() => onDeleteFile("pdf")}
                                    title="Delete PDF"
                                >
                                    <i className="fa fa-trash text-xl" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <label
                            htmlFor="pdf-upload"
                            className="flex flex-col flex-grow items-center justify-center w-full h-full p-6 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-100 transition-all duration-300 group"
                        >
                            <input
                                id="pdf-upload"
                                type="file"
                                accept=".pdf"
                                onChange={(e) => onUploadFile(e, 'pdf')}
                                className="hidden"
                            />
                            <div className="text-center text-blue-500 group-hover:text-blue-700 transition-colors duration-300 flex flex-col items-center">
                                <i className="fa fa-file-pdf text-4xl mb-2"></i>
                                <p className="text-lg font-medium">Upload Country PDF</p>
                            </div>
                        </label>
                    )}
                </div>
            </div>
            {viewImage && <ImagePopup image={viewImage} closeModal={closeModal} />}
            <FormButtons isChanged={isChanged} isLoading={isLoading} onSave={onSave} onCancel={onCancel} />
        </section>

    )
}

export default FilesTab