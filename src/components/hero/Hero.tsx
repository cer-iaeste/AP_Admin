import React, { useState, useEffect } from "react";
import { ref, uploadBytes, deleteObject } from "firebase/storage"; // Import deleteObject and ref if using Firebase storage
import { storage } from "../../firebase"; // Update with your Firebase config path
import CardFooter from "../card/CardFooter";
import "../summer-reception/Weekend.css"
import { CardProps, getCountryDbName } from "../../global/Global";
import { toast } from 'react-toastify';
import ImagePopup from "../../global/ImagePopup";

interface HeroType {
    banner: string
    pdf: string
    socialLinks: { [key: string]: string }[]
}

interface HeroBannerProps extends CardProps {
    content: HeroType; // Array of image objects with unique id and URL
}

interface UploadedFile {
    file: File
    url: string
    dbUrl: string
}

interface SocialLink {
    name: string
    icon: string
    value: string
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
    // links
    const [links, setLinks] = useState<SocialLink[]>([
        { name: 'Instagram', icon: 'fab fa-instagram', value: '' },
        { name: 'Facebook', icon: 'fab fa-facebook', value: '' },
        { name: 'Website', icon: 'fas fa-globe', value: '' },
    ])

    useEffect(() => {
        setImage(content.banner)
    }, [content])

    const closeModal = () => {
        setViewImage(null);
    };

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            if (file.type === "application/pdf") {
                const newPdf: UploadedFile = {
                    file,
                    url: URL.createObjectURL(file),
                    dbUrl: `https://firebasestorage.googleapis.com/v0/b/iaeste-ap.appspot.com/o/${country}%2Fgallery%2F${file.name}?alt=media`
                }
                setPdf(newPdf.file.name)
                setPdfToUpload(newPdf)
                setIsChanged(true)
            } else {
                const newImage: UploadedFile = {
                    file,
                    url: URL.createObjectURL(file),
                    dbUrl: `https://firebasestorage.googleapis.com/v0/b/iaeste-ap.appspot.com/o/${country}%2Fgallery%2F${file.name}?alt=media`
                }
                setImage(newImage.url)
                setImageToUpload(newImage)
                setIsChanged(true)
            }

        } else toast.error("Error while uploading file!")
    };

    const uploadImageToStorage = async () => {
        try {
            if (imageToUpload) {
                const countryName = getCountryDbName(country)
                const storageRef = ref(storage, `${countryName}/gallery/${imageToUpload.file.name}`);
                // Upload to storage
                await uploadBytes(storageRef, imageToUpload.file);
            }
        } catch (error) {
            toast.error("Error uploading files! " + error)
            return null
        }
    }

    const removeImageFromStorage = async () => {
        try {
            if (imageToDelete !== "") {
                const fileRef = ref(storage, imageToDelete)
                await deleteObject(fileRef)
            }
        } catch (error) {
            toast.error("Error removing file from storage! " + error)
            return null
        }
    }

    const onSave = async () => {
        // upload files to storage
        await uploadImageToStorage()
        // delete files from storage
        await removeImageFromStorage()
        // save image
        handleSave(country, image, "banner", "Hero banner", setIsChanged)
    }
    const onCancel = async () => {
        const confirmation = await handleCancel(isChanged, setImage, content?.banner, setIsChanged)
        if (confirmation) {
            setImageToDelete("")
            setImageToUpload(undefined)
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
        <>
            <div className="mt-6 table-margins mx-2 space-y-8">
                {/* Files */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div key="banner" className="card-container">
                        <div className="card-header">
                            Hero banner
                        </div>
                        {image ?
                            <div className="flex justify-between w-full px-3">
                                <div className="flex underline items-center">
                                    {country}.image
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
                {/* Links */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {links.map((link, index) =>
                        <div key={index} className="card-container">
                            <div className="card-header">
                                <i className={`${link.icon} mr-1`} />
                                {link.name}
                            </div>
                            <textarea
                                placeholder="Link"
                                rows={1}
                                value={link?.value}
                                // onChange={(e) => onInputChange(e, index, "role")}
                                className="card-textarea"
                            />
                        </div>
                    )}
                </div>


            </div>
            {viewImage && <ImagePopup image={viewImage} closeModal={closeModal} />}

            <CardFooter isChanged={isChanged} onCancel={onCancel} onSave={onSave} onBack={onBack} />
        </>


    );
};

export default Hero;