import React, { useState, useEffect, useContext, useCallback } from "react";
import "../summer-reception/Weekend.css"
import { getCountryDbName, removeFileFromStorage, uploadFileToStorage } from "../../global/Global"
import { toast } from 'react-toastify';
import ImagePopup from "../../global/ImagePopup";
import CardContext from "../card/CardContext"
import { UploadedFileType } from "../../types/types";
import FormButtons from "../card/FormButtons";

interface HeroBannerProps {
    content: {
        name: string
        flag: string
        banner: string
        pdf: string
        region: string
    };
}

const Hero: React.FC<HeroBannerProps> = ({ content }) => {
    const context = useContext(CardContext);
    // country name
    const [countryName, setCountryName] = useState<string>("")
    // region
    const [region, setRegion] = useState<string>("")
    // image (banner)
    const [image, setImage] = useState<string>("")
    const [imageToUpload, setImageToUpload] = useState<UploadedFileType | undefined>(undefined)
    const [imageToDelete, setImageToDelete] = useState<string>("") // Stores Firebase URL of image to delete
    // flag
    const [flagImage, setFlagImage] = useState<string>("")
    const [flagToUpload, setFlagToUpload] = useState<UploadedFileType | undefined>(undefined); // New state for flag to upload
    const [flagToDelete, setFlagToDelete] = useState<string>("");
    // pdf
    const [pdf, setPdf] = useState<string>("")
    const [pdfToUpload, setPdfToUpload] = useState<UploadedFileType | undefined>()
    const [pdfToDelete, setPdfToDelete] = useState<string>("") // Stores Firebase URL of PDF to delete
    // view modal
    const [viewImage, setViewImage] = useState<string | null>(null)


    const setContent = useCallback(
        (name: string, flag: string, banner: string, pdf: string, region: string) => {
            setCountryName(name)
            setFlagImage(flag)
            setImage(banner)
            setPdf(pdf)
            setRegion(region)

            setFlagToUpload(undefined)
            setImageToUpload(undefined)
            setPdfToUpload(undefined)

            setFlagToDelete("")
            setImageToDelete("")
            setPdfToDelete("")
        }, [])

    useEffect(() => {
        setContent(content.name, content.flag, content.banner, content.pdf, content.region.toLowerCase())
    }, [content, setContent])

    // Effect to determine if changes have been made to enable save button
    useEffect(() => {
        const hasNameChanged = countryName !== content.name;
        const hasRegionChanged = region !== content.region;
        const hasFlagChanged = flagImage !== content.flag || flagToUpload !== undefined;
        const hasBannerChanged = image !== content.banner || imageToUpload !== undefined;
        const hasPdfChanged = pdf !== content.pdf || pdfToUpload !== undefined;

        const hasDeletionPending = imageToDelete !== "" || pdfToDelete !== "" || flagToDelete !== "";

        // Combine all change checks
        const changesDetected = hasNameChanged || hasFlagChanged || hasBannerChanged || hasPdfChanged || hasRegionChanged || hasDeletionPending;

        setIsChanged(changesDetected);
    }, [countryName, flagImage, image, pdf, region, flagToUpload, imageToUpload, pdfToUpload, flagToDelete, imageToDelete, pdfToDelete, content]);


    if (!context) return null
    // Destructure required functions and countryName from context after the check
    const { countryName: countryNameContext, handleSave, handleUpload, handleDelete, handleCancel, isChanged, isLoading, setIsChanged } = context;

    // Function to close the image preview modal
    const closeModal = () => setViewImage(null)

    const onUploadFile = (e: React.ChangeEvent<HTMLInputElement>, type: "flag" | "banner" | "pdf") => {
        if (type === "flag") handleUpload(e, "flag", flagImage, setFlagImage, setFlagToUpload, setFlagToDelete)
        else if (type === "banner") handleUpload(e, "banner", image, setImage, setImageToUpload, setImageToDelete)
        else handleUpload(e, "pdf", pdf, setPdf, setPdfToUpload, setPdfToDelete)
    }

    // Handler for region select
    const handleOnRegionSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => setRegion(e.target.value);

    const uploadFilesToStorage = async () => {
        const name = getCountryDbName(countryName)

        return {
            uploadedFlagUrl: flagToUpload ? await uploadFileToStorage(name, flagToUpload, 'flag') : flagImage,
            uploadedBannerUrl: imageToUpload ? await uploadFileToStorage(name, imageToUpload, 'banner') : image,
            uploadedPdfUrl: pdfToUpload ? await uploadFileToStorage(name, pdfToUpload, 'pdf') : pdf
        }
    };

    const removeFilesFromStorage = async () => {
        if (flagToDelete && flagToDelete !== flagImage) await removeFileFromStorage(flagToDelete)
        if (imageToDelete && imageToDelete !== image) await removeFileFromStorage(imageToDelete)
        if (pdfToDelete && pdfToDelete !== pdf) await removeFileFromStorage(pdfToDelete)
    };

    const onSave = async () => {
        // Basic validation before saving
        if (!image && !imageToUpload) { // Banner is now optional as per new design interpretation (if no default)
            toast.error("Please upload a banner image.");
            return;
        }
        // PDF is optional in this context
        if (!region) {
            toast.error("Please select a region.");
            return;
        }

        try {
            // Step 1: Upload new files to storage and get their final URLs
            const { uploadedFlagUrl, uploadedBannerUrl, uploadedPdfUrl } = await uploadFilesToStorage();
            if (uploadedFlagUrl && uploadedBannerUrl && uploadedPdfUrl) {
                // Step 2: Remove old files from storage (if any were replaced/deleted)
                await removeFilesFromStorage();
                // Step 3: Call parent's handleSave with updated content (using final URLs)
                handleSave(countryNameContext, uploadedFlagUrl, "imageSrc", "Flag");
                handleSave(countryNameContext, uploadedBannerUrl, "banner", "Hero banner");
                handleSave(countryNameContext, uploadedPdfUrl, "pdf", "PDF");
                handleSave(countryNameContext, region, "region", "Region");
                handleSave(countryNameContext, countryName, "name", "Country name");
                handleSave(countryNameContext, countryName, "imageAlt", "Image alt name");
                // After successful save, ensure local image/pdf state points to the newly uploaded/persisted URLs
                setContent(countryName, flagImage, uploadedBannerUrl, uploadedPdfUrl, region)
            }
        } catch (error) {
            toast.error(`Failed to save changes: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const onCancel = async () => {
        const confirmation = await handleCancel(setRegion, content.region);
        if (confirmation) setContent(content.name, content.flag, content.banner, content.pdf, content.region)
    };

    const handleDeleteFile = async (file: string, setData: (data: any) => void, setFileToDelete: (file: string) => void, setFiletoUpload: (file: undefined) => void) => {
        const del = await handleDelete(0, setData, null)
        if (del) {
            setFileToDelete(file)
            setFiletoUpload(undefined)
        }
    }

    // Delete handlers for files
    const onDeleteFlag = () => handleDeleteFile(flagImage, setFlagImage, setFlagToDelete, setFlagToUpload);
    const onDeleteImage = () => handleDeleteFile(image, setImage, setImageToDelete, setImageToUpload)
    const onDeletePdf = () => handleDeleteFile(pdf, setPdf, setPdfToDelete, setPdfToUpload)

    return (
        <section className="text-[#1B75BB]">
            <div className="grid grid-cols-1 gap-6 my-8"> {/* Main grid for sections */}
                {/* Row 1: Banner & PDF */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Banner Upload Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 flex flex-col items-center justify-center min-h-[180px]">
                        <div className="text-xl font-semibold text-gray-700 pb-2 mb-4 border-b-2 border-blue-200 w-full text-center">
                            <i className="fa-solid fa-panorama mr-2 text-blue-600"></i> Hero Banner
                        </div>
                        {image ? (
                            <div className="flex flex-col flex-grow items-center justify-center w-full p-3 space-y-4">
                                <img src={image} alt="Hero Banner Preview" className="h-24 w-auto object-contain rounded-md shadow-md border border-gray-200" />
                                <span className="text-md font-medium text-gray-700 truncate w-full text-center">
                                    {imageToUpload?.file.name || image.split('/').pop()?.split('?')[0] || "Current Banner"}
                                </span>
                                <div className="flex items-center gap-4 mt-2">
                                    <button
                                        className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onClick={() => setViewImage(image)}
                                        title="View banner"
                                    >
                                        <i className="fa fa-eye text-xl" />
                                    </button>
                                    <button
                                        className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        onClick={onDeleteImage}
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
                                    {pdfToUpload?.file.name || pdf.split('/').pop()?.split('?')[0] || "Current PDF"}
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
                                        onClick={onDeletePdf}
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
                {/* Row 2: Flag, Name, Region */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                    {/* Country Name Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 flex flex-col space-y-4 min-h-[180px] justify-center">
                        <div className="text-xl font-semibold text-gray-700 pb-2 border-b-2 border-blue-200 w-full text-center">
                            <i className="fa-solid fa-flag mr-2 text-blue-600"></i> IAESTE Country Name
                        </div>
                        <input
                            type="text"
                            value={countryName}
                            onChange={(e) => setCountryName(e.target.value)}
                            placeholder="Enter Country Name"
                            className="text-input"
                        />
                    </div>

                    {/* Region Select Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 flex flex-col  space-y-4 min-h-[180px] justify-center">
                            <div className="text-xl font-semibold text-gray-700 pb-2 border-b-2 border-blue-200 w-full text-center">
                                <i className="fa-solid fa-globe mr-2 text-blue-600"></i> IAESTE Region
                            </div>
                            <div className="flex flex-grow justify-center">
                                <select
                                value={region}
                                onChange={handleOnRegionSelectChange}
                                className="text-input "
                            >
                                <option value="">Select a Region</option> 
                                <option value="cer">CER</option>
                                <option value="core">CoRe</option>
                                <option value="other">Other</option>
                            </select>
                            </div>
                            
                        </div>

                    {/* Flag Upload Card */}
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
                                            onClick={onDeleteFlag}
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


                </div>
            </div>

            {viewImage && <ImagePopup image={viewImage} closeModal={closeModal} />}

            <FormButtons isChanged={isChanged} isLoading={isLoading} onCancel={onCancel} onSave={onSave} />
        </section>
    );
};

export default Hero;
