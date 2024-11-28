import React, { useState, useEffect } from "react";
import { ref, uploadBytes, deleteObject } from "firebase/storage"; // Import deleteObject and ref if using Firebase storage
import { storage } from "../../firebase"; // Update with your Firebase config path
import CardFooter from "../card/CardFooter";
import "../summer-reception/Weekend.css"
import { CardProps, getCountryDbName } from "../../global/Global";
import { toast } from 'react-toastify';

interface HeroBannerProps extends CardProps {
    banner: string; // Array of image objects with unique id and URL
}

interface UploadedImage {
    file: File
    url: string
    dbUrl: string
}

const Hero: React.FC<HeroBannerProps> = ({ banner, country, handleSave, handleDelete, handleCancel, handleBack }) => {
    const [image, setImage] = useState<string>("")
    const [viewImage, setViewImage] = useState<string | null>(null)
    const [isChanged, setIsChanged] = useState(false)
    const [imageToUpload, setImageToUpload] = useState<UploadedImage>()
    const [imageToDelete, setImageToDelete] = useState<string>("")

    useEffect(() => {
        setImage(banner)
    }, [banner])

    const handleImageClick = (url: string) => {
        setViewImage(url);
    };

    const closeModal = () => {
        setViewImage(null);
    };

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const newImage: UploadedImage = {
                file,
                url: URL.createObjectURL(file),
                dbUrl: `https://firebasestorage.googleapis.com/v0/b/iaeste-ap.appspot.com/o/${country}%2Fgallery%2F${file.name}?alt=media`
            }
            setImage(newImage.url)
            setImageToUpload(newImage)
            setIsChanged(true)
        } else toast.error("Error while uploading file!")
    };

    const uploadImagesToStorage = async () => {
        try {
            if (imageToUpload) {
                const countryName = getCountryDbName(country)
                const storageRef = ref(storage, `${countryName}/gallery/${imageToUpload.file.name}`);
                // Upload to storage
                await uploadBytes(storageRef, imageToUpload.file);
            } else toast.error("No image to upload!")
        } catch (error) {
            toast.error("Error uploading files! " + error)
            return null
        }
    }

    const removeImagesFromStorage = async () => {
        try {
            if (imageToDelete !== "") {
                const fileRef = ref(storage, imageToDelete)
                await deleteObject(fileRef)
            } else toast.error("No image to delete!")
        } catch (error) {
            toast.error("Error removing file from storage! " + error)
            return null
        }
    }

    const onSave = async () => {
        // upload files to storage
        await uploadImagesToStorage()
        // delete files from storage
        await removeImagesFromStorage()
        // save image
        // handleSave(country, image, "banner", "Hero banner", setIsChanged)
    }
    const onCancel = async () => {
        const confirmation = await handleCancel(isChanged, setImage, banner, setIsChanged)
        if (confirmation) {
            setImageToDelete("")
            setImageToUpload(undefined)
        }
    }
    const onDelete = (url: string) => {
        setImage("")
        if (url === banner) setImageToDelete(url)
        setIsChanged(true)
    }
    const onBack = () => handleBack(isChanged, setImage, banner, setIsChanged)

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 table-margins">
            {image ?
                <div className="relative group max-h-72">
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
                <div className="relative group flex items-center justify-center border-dashed border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 h-72">
                    <input
                        type="file"
                        onChange={handleUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        title="Upload image"
                    />
                    <i className="fa-solid fa-plus text-gray-400 text-4xl group-hover:text-blue-400"></i>
                </div>
            }

            {/* Upload Button Card */}


            {/* Popup Modal for Enlarged Image */}
            {viewImage &&
                <div className="overlay">
                    <div className="relative bg-black rounded-xl shadow-md w-4/5 h-4/5 flex justify-center">
                        <img src={viewImage} alt="Enlarged" className="" />
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-red-500 rounded-full p-1"
                        >
                            <i className="fa fa-circle-xmark text-3xl"></i>
                        </button>
                    </div>
                </div>
            }

            <CardFooter isChanged={isChanged} onCancel={onCancel} onSave={onSave} onBack={onBack} />
        </div>
    );
};

export default Hero;
