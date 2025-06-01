import React, { useState, useEffect } from "react";
import { ref, uploadBytes, deleteObject } from "firebase/storage"; // Import deleteObject and ref if using Firebase storage
import { storage } from "../../firebase"; // Update with your Firebase config path
import CardFooter from "../card/CardFooter";
import "../summer-reception/Weekend.css"
import { CardProps, getCountryDbName } from "../../global/Global";
import { toast } from 'react-toastify';
import ImagePopup from "../../global/ImagePopup";

interface HeroBannerProps extends CardProps {
    content: {
        banner: string
        pdf: string
    };
}

interface UploadedFile {
    file: File
    url: string
    dbUrl: string
}

const Hero: React.FC<HeroBannerProps> = ({ content, country, handleSave, handleCancel, handleBack }) => {
    const [isChanged, setIsChanged] = useState(false)
    // image
    const [image, setImage] = useState<string>("")
    const [viewImage, setViewImage] = useState<string | null>(null)
    const [imageToUpload, setImageToUpload] = useState<UploadedFile>()
    const [imageToDelete, setImageToDelete] = useState<string>("")
    // pdf
    const [pdf, setPdf] = useState<string>("")
    const [pdfToUpload, setPdfToUpload] = useState<UploadedFile>()
    const [pdfToDelete, setPdfToDelete] = useState<string>("")

    useEffect(() => {
        setImage(content.banner)
        setPdf(content.pdf)
    }, [content])

    const closeModal = () => {
        setViewImage(null);
    };

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const setNewFile = (file: File, setFile: (fileName: string) => void, setFileToUpload: (file: UploadedFile) => void, folderName: string) => {
            const countryName = getCountryDbName(country)
            const newFile: UploadedFile = {
                file,
                url: URL.createObjectURL(file),
                dbUrl: `https://firebasestorage.googleapis.com/v0/b/iaeste-ap.appspot.com/o/${countryName}%2F${folderName}%2F${file.name}?alt=media`
            }
            setFile(newFile.url)
            setFileToUpload(newFile)
            setIsChanged(true)
        }

        const file = event.target.files?.[0]
        if (file) {
            if (file.type === "application/pdf") setNewFile(file, setPdf, setPdfToUpload, "pdf")
            else setNewFile(file, setImage, setImageToUpload, "banner")
        } else toast.error("Error while uploading file!")
    };

    const uploadFile = async(fileToUpload: UploadedFile, folder: string) => {
        const countryName = getCountryDbName(country)
        const storageRef = ref(storage, `${countryName}/${folder}/${fileToUpload.file.name}`);
        // Upload to storage
        await uploadBytes(storageRef, fileToUpload.file);
    }

    const uploadFilesToStorage = async () => {
        try {
            if (imageToUpload) await uploadFile(imageToUpload, 'banner')
            if (pdfToUpload) await uploadFile(pdfToUpload, 'pdf') 
        } catch (error) {
            toast.error("Error uploading files! " + error)
            return null
        }
    }

    const removeFilesFromStorage = async () => {
        const removeFile = async (file: string) => {
            const fileRef = ref(storage, file)
            await deleteObject(fileRef)
        }
        try {
            if (imageToDelete !== "") removeFile(imageToDelete)
            if (pdfToDelete !== "") removeFile(pdfToDelete)
        } catch (error) {
            toast.error("Error removing files from storage! " + error)
            return null
        }
    }

    const onSave = async () => {
        // upload files to storage
        await uploadFilesToStorage()
        // delete files from storage
        await removeFilesFromStorage()
        // save changes
        if (imageToUpload) handleSave(country, imageToUpload?.dbUrl, "banner", "Hero banner", setIsChanged)
        if (pdfToUpload) handleSave(country, pdfToUpload?.dbUrl, "pdf", "PDF", setIsChanged)   
    }

    const onCancel = async () => {
        const confirmation = await handleCancel(isChanged, setImage, content.banner, setIsChanged)
        if (confirmation) {
            setImageToDelete("")
            setImageToUpload(undefined)
            setPdfToDelete("")
            setPdfToUpload(undefined)
            setPdf(content.pdf)
        }
    }
    const onDelete = () => {
        setImage("")
        if (image === content?.banner && content.banner !== "") setImageToDelete(image)
        setIsChanged(true)
    }
    const onDeletePdf = () => {
        setPdf("")
        if (pdf === content?.banner && content.banner !== "") setPdfToDelete(image)
        setIsChanged(true)
    }
    const onBack = () => handleBack(isChanged, setImage, content?.banner, setIsChanged)

    return (
        <section>
            <div className="mt-6 table-margins mx-2 space-y-8">
                {/* Files */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div key="banner" className="card-container">
                        <div className="card-header">
                            Banner
                        </div>
                        {image ?
                            <div className="flex justify-between w-full px-3">
                                <div className="flex underline items-center">
                                    {country}.banner
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-[#1B75BB] text-[#1B75BB] hover:bg-[#1B75BB] hover:text-white transition-transform transform hover:scale-110"
                                        onClick={() => setViewImage(image)}
                                        title="View image"
                                    >
                                        <i className="fa fa-eye text-lg" />
                                    </button>
                                    <button
                                        className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-red-500 text-red-500 hover:text-white hover:bg-red-500 transition-transform transform hover:scale-110"
                                        onClick={onDelete}
                                        title="Delete image"
                                    >
                                        <i className="fa fa-trash text-lg" />
                                    </button>
                                </div>
                            </div>
                            :
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleUpload}
                                className="w-full px-3 pt-1 rounded-md text-sm text-gray-700 cursor-pointer"
                                title="Upload image"
                            />
                        }
                    </div>
                    <div key="pdf" className="card-container">
                        <div className="card-header">
                            Country PDF
                        </div>
                        {pdf ?
                            <div className="flex justify-between w-full px-3">
                                <div className="flex underline items-center">
                                    {country}.pdf
                                </div>
                                <div className="flex items-center gap-2">
                                    <a
                                        className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-[#1B75BB] text-[#1B75BB] hover:bg-[#1B75BB] hover:text-white transition-transform transform hover:scale-110"
                                        href={pdf} target="_blank" rel="noreferrer"
                                        title="View PDF"
                                    >
                                        <i className="fa fa-eye text-lg" />
                                    </a>
                                    <button
                                        className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-red-500 text-red-500 hover:text-white hover:bg-red-500 transition-transform transform hover:scale-110"
                                        onClick={onDeletePdf}
                                        title="Delete image"
                                    >
                                        <i className="fa fa-trash text-lg" />
                                    </button>
                                </div>
                            </div>
                            :
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleUpload}
                                className="w-full px-3 pt-1 rounded-md text-sm text-gray-700 cursor-pointer"
                                title="Upload image"
                            />
                        }
                    </div>
                    <div key="empty" className="hidden lg:block"></div>
                </div>
            </div>
            {viewImage && <ImagePopup image={viewImage} closeModal={closeModal} />}

            <CardFooter isChanged={isChanged} onCancel={onCancel} onSave={onSave} onBack={onBack} />
        </section>
    );
};

export default Hero;
