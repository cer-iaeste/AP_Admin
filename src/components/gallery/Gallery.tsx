import React, { useState, useEffect } from "react";
import { ref, uploadBytes, deleteObject } from "firebase/storage"; // Import deleteObject and ref if using Firebase storage
import { storage } from "../../firebase"; // Update with your Firebase config path
import CardFooter from "../card/CardFooter";
import "../summer-reception/Weekend.css"
import { CardProps, getCountryDbName } from "../../global/Global";
import { toast } from 'react-toastify';
import ImagePopup from "../../global/ImagePopup";

interface GalleryProps extends CardProps{
    images: string[]; // Array of image objects with unique id and URL
}

interface UploadedImage {
    file: File
    url: string
    dbUrl: string
}

const Gallery: React.FC<GalleryProps> = ({ images, country, handleSave, handleDelete, handleCancel, handleBack }) => {
    const [imagesData, setImagesData] = useState<string[]>([])
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isChanged, setIsChanged] = useState(false)
    const [imagesToUpload, setImagesToUpload] = useState<UploadedImage[]>([])
    const [imagesToDelete, setImagesToDelete] = useState<string[]>([])

    useEffect(() => {
        setImagesData(images)
    }, [images])

    const handleImageClick = (url: string) => {
        setSelectedImage(url);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const countryName = getCountryDbName(country)
        const file = event.target.files?.[0]
        if (file) {
            const newImage: UploadedImage = {
                file,
                url: URL.createObjectURL(file),
                dbUrl: `https://firebasestorage.googleapis.com/v0/b/iaeste-ap.appspot.com/o/${countryName}%2Fgallery%2F${file.name}?alt=media`
            }
            setImagesData([...imagesData, newImage.url])
            setImagesToUpload([...imagesToUpload, newImage])
            setIsChanged(true)
        } else toast.error("Error while uploading file!")
    };

    const uploadImagesToStorage = async () => {
        try {
            const countryName = getCountryDbName(country)
            imagesToUpload.forEach(async (image: UploadedImage) => {
                const storageRef = ref(storage, `${countryName}/gallery/${image.file.name}`);
                // Upload to storage
                await uploadBytes(storageRef, image.file);
            })
        } catch (error) {
            toast.error("Error uploading files! " + error)
            return null
        }
    }

    const removeImagesFromStorage = async () => {
        try {
            imagesToDelete.forEach(async (image: string) => {
                const fileRef = ref(storage, image)
                await deleteObject(fileRef)
            })
        } catch(error) {
            toast.error("Error removing files from storage! " + error)
            return null
        }
    }

    const onSave = async () => {
        // upload files to storage
        await uploadImagesToStorage()
        const newGallery = imagesData.map((image: string) => {
            const newImageExists = imagesToUpload.find(newImage => newImage.url === image)
            return newImageExists?.dbUrl ?? image
        })
        // delete files from storage
        await removeImagesFromStorage()
        handleSave(country, newGallery, "gallery", "Gallery", setIsChanged)
    }
    const onCancel = async () => {
        const confimation = await handleCancel(isChanged, setImagesData, images, setIsChanged)
        if (confimation) {
            setImagesToDelete([])
            setImagesToUpload([])
        }
    }
    const onDelete = async (index: number, url: string) => {
        const del = await handleDelete(index, setImagesData, imagesData, setIsChanged)
        if (del) setImagesToDelete([...imagesToDelete, url])
    }
    const onBack = () => handleBack(isChanged, setImagesData, images, setIsChanged)

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 table-margins">
            {imagesData.map((image, index) => (
                <div key={index} className="relative group max-h-72 border-2 border-[#1B75BB] rounded-md">
                    <img
                        src={image}
                        alt="Gallery item"
                        className="w-full h-full object-cover transition duration-300 ease-in-out transform group-hover:opacity-60"

                    />
                    <button
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition duration-300 z-10"
                        onClick={() => onDelete(index, image)}
                    >
                        <i className="fa-solid fa-trash-can text-red-400 hover:text-red-500 text-2xl" />
                    </button>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer"
                        onClick={() => handleImageClick(image)}>
                        <i className="fa fa-eye text-white text-4xl" />
                    </div>
                </div>
            ))}
            
            {/* Upload Button Card */}
            <div className="relative group flex items-center justify-center border-dashed border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 h-72">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    title="Upload image"
                />
                <i className="fa-solid fa-plus text-gray-400 text-4xl group-hover:text-blue-400"></i>
            </div>

            {/* Popup Modal for Enlarged Image */}
            {selectedImage && <ImagePopup image={selectedImage} closeModal={closeModal} />}

            <CardFooter isChanged={isChanged} onCancel={onCancel} onSave={onSave} onBack={onBack}/>
        </div>
    );
};

export default Gallery;
