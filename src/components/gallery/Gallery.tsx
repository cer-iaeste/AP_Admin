import React, { useState, useEffect } from "react";
import { ref, uploadBytes, deleteObject } from "firebase/storage"; // Import deleteObject and ref if using Firebase storage
import { storage } from "../../firebase"; // Update with your Firebase config path
import CardFooter from "../card/CardFooter";
import { updateCountryField } from "../../service/CountryService";
import "../summer-reception/Weekend.css"

interface GalleryProps {
    country: string
    images: string[]; // Array of image objects with unique id and URL
}

interface UploadedImage {
    file: File
    url: string
    dbUrl: string
}

const Gallery: React.FC<GalleryProps> = ({ images, country }) => {
    const [imagesData, setImagesData] = useState<string[]>([])
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isChanged, setIsChanged] = useState(false)
    const [imagesToUpload, setImagesToUpload] = useState<UploadedImage[]>([])
    const [imagesToDelete, setImagesToDelete] = useState<string[]>([])

    useEffect(() => {
        setImagesData(images)
    }, [images])

    const handleDelete = (index: number, url: string) => {
        // Get reference to the image in Firebase storage and delete
        const confirmDelete = window.confirm("Are you sure you want to delete this item?");
        if (confirmDelete) {
            const newData = structuredClone(imagesData).filter((_: string, i: number) => i !== index)
            setImagesData(newData)
            setImagesToDelete([...imagesToDelete, url])
            setIsChanged(true)
        }
        // const imageRef = ref(storage, url);
        setIsChanged(true)
    };

    const handleImageClick = (url: string) => {
        setSelectedImage(url);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const newImage: UploadedImage = {
                file,
                url: URL.createObjectURL(file),
                dbUrl: `https://firebasestorage.googleapis.com/v0/b/iaeste-ap.appspot.com/o/${country}%2Fgallery%2F${file.name}?alt=media`
            }
            setImagesData([...imagesData, newImage.url])
            console.log(newImage.url)
            setImagesToUpload([...imagesToUpload, newImage])
            setIsChanged(true)
        } else alert("Error while uploading file!")
    };

    const handleCancel = () => {
        setImagesData(structuredClone(images))
        setImagesToDelete([])
        setIsChanged(false)
    }

    const uploadImagesToStorage = async () => {
        try {
            imagesToUpload.forEach(async (image: UploadedImage) => {
                const storageRef = ref(storage, `${country}/gallery/${image.file.name}`);
                // Upload to storage
                await uploadBytes(storageRef, image.file);
            })
        } catch (error) {
            alert("Error uploading files! " + error)
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
            alert("Error removing files from storage! " + error)
            return null
        }
    }

    const handleSave = async () => {
        // upload files to storage
        await uploadImagesToStorage()
        const newGallery = imagesData.map((image: string) => {
            const newImageExists = imagesToUpload.find(newImage => newImage.url === image)
            return newImageExists?.dbUrl ?? image
        })
        // delete files from storage
        await removeImagesFromStorage()
        // update gallery in database
        updateCountryField(country, newGallery, "gallery", "Gallery").then(() => {
            setIsChanged(false)
        })
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 table-margins">
            {imagesData.map((image, index) => (
                <div key={index} className="relative group max-h-72">
                    <img
                        src={image}
                        alt="Gallery item"
                        className="w-full h-full object-cover transition duration-300 ease-in-out transform group-hover:opacity-60"

                    />
                    <button
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition duration-300 z-10"
                        onClick={() => handleDelete(index, image)}
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
                    onChange={handleUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    title="Upload image"
                />
                <i className="fa-solid fa-plus text-gray-400 text-4xl group-hover:text-blue-400"></i>
            </div>

            {/* Popup Modal for Enlarged Image */}
            {selectedImage && (
                <div className="overlay">
                    <div className="relative bg-black rounded-xl shadow-md w-4/5 h-4/5 flex justify-center">
                        <img src={selectedImage} alt="Enlarged" className="" />
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-red-500 rounded-full p-1"
                        >
                            <i className="fa fa-circle-xmark text-3xl"></i>
                        </button>
                    </div>
                </div>
            )}

            <CardFooter isChanged={isChanged} onCancel={handleCancel} onSave={handleSave} />
        </div>
    );
};

export default Gallery;