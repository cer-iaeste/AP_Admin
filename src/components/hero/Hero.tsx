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
    const [links, setLinks] = useState<{ [key: string]: string }[]>([])

    useEffect(() => {
        setImage(content.banner)
    }, [content])

    const handleImageClick = (url: string) => {
        setViewImage(url);
    };

    const closeModal = () => {
        setViewImage(null);
    };

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const newImage: UploadedFile = {
                file,
                url: URL.createObjectURL(file),
                dbUrl: `https://firebasestorage.googleapis.com/v0/b/iaeste-ap.appspot.com/o/${country}%2Fgallery%2F${file.name}?alt=media`
            }
            setImage(newImage.url)
            setImageToUpload(newImage)
            setIsChanged(true)
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
    const onDelete = (url: string) => {
        setImage("")
        if (url === content?.banner) setImageToDelete(url)
        setIsChanged(true)
    }
    const onBack = () => handleBack(isChanged, setImage, content?.banner, setIsChanged)

    return (
        <div className="grid md:grid-cols-2 gap-4 table-margins">
            {image ?
                <div className="relative group border-2 border-[#1B75BB] rounded-md">
                    <img
                        src={image}
                        alt="Gallery item"
                        className="w-full h-full object-cover transition duration-300 ease-in-out transform group-hover:opacity-60"

                    />
                    <button
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition duration-300 z-10"
                        onClick={() => onDelete(image)}
                    >
                        <i className="fa-solid fa-trash-can text-red-400 hover:text-red-500 text-2xl" />
                    </button>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer"
                        onClick={() => handleImageClick(image)}>
                        <i className="fa fa-eye text-white text-4xl" />
                    </div>
                </div> :
                <div className="relative group flex items-center justify-center border-dashed border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-400">
                    <input
                        type="file"
                        onChange={handleUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        title="Upload image"
                    />
                    <i className="fa-solid fa-plus text-gray-400 text-4xl group-hover:text-blue-400"></i>
                </div>
            }

            <div className="border-2 border-[#1B75BB] rounded-md bg-[#F1F1E6] relative grid grid-cols-2 gap-4 p-4 items-center justify-start">
                {/* Horizontal Line */}
                <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 border-t-2 border-[#1B75BB]"></div>

                {/* Vertical Line */}
                <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 border-l-2 border-[#1B75BB]"></div>
                
                {/* PDF Field */}
                <div className="flex flex-col items-center">
                    <i className="fa-solid fa-file-pdf text-red-500 text-4xl mb-2"></i>
                    <button
                        className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        onClick={() => {
                            document.getElementById("pdf-upload")?.click();
                        }}
                    >
                        Upload PDF
                    </button>
                    <input
                        id="pdf-upload"
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) {
                                const newPdf: UploadedFile = {
                                    file,
                                    url: URL.createObjectURL(file),
                                    dbUrl: `https://firebasestorage.googleapis.com/v0/b/iaeste-ap.appspot.com/o/${country}%2Fpdf%2F${file.name}?alt=media`,
                                };
                                setPdf(newPdf.url);
                                setPdfToUpload(newPdf);
                                setIsChanged(true);
                            } else toast.error("Error while uploading PDF!");
                        }}
                    />
                </div>

                {/* Instagram Link */}
                <div className="flex flex-col items-center">
                    <i className="fa-brands fa-instagram text-pink-500 text-4xl mb-2"></i>
                    <input
                        type="text"
                        placeholder="Instagram Link"
                        value=""
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        onChange={(e) =>
                            setLinks((prev) =>
                                prev.map((link) =>
                                    link.instagram ? { ...link, instagram: e.target.value } : link
                                )
                            )
                        }
                    />
                </div>

                {/* Facebook Link */}
                <div className="flex flex-col items-center">
                    <i className="fa-brands fa-facebook text-blue-500 text-4xl mb-2"></i>
                    <input
                        type="text"
                        placeholder="Facebook Link"
                        value=""
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        onChange={(e) =>
                            setLinks((prev) =>
                                prev.map((link) =>
                                    link.facebook ? { ...link, facebook: e.target.value } : link
                                )
                            )
                        }
                    />
                </div>

                {/* Website Link */}
                <div className="flex flex-col items-center">
                    <i className="fa-solid fa-globe text-green-500 text-4xl mb-2"></i>
                    <input
                        type="text"
                        placeholder="Website Link"
                        value=""
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        onChange={(e) =>
                            setLinks((prev) =>
                                prev.map((link) =>
                                    link.website ? { ...link, website: e.target.value } : link
                                )
                            )
                        }
                    />
                </div>
            </div>


            {/* Popup Modal for Enlarged Image */}
            {viewImage && <ImagePopup image={viewImage} closeModal={closeModal} />}

            <CardFooter isChanged={isChanged} onCancel={onCancel} onSave={onSave} onBack={onBack} />
        </div>
    );
};

export default Hero;
