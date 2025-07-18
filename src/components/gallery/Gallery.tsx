import React, { useState, useEffect, useContext } from "react"
import "../summer-reception/Weekend.css"
import { getCountryDbName, removeFileFromStorage, uploadFileToStorage } from "../../global/Global"
import ImagePopup from "../../global/ImagePopup"
import CardContext from "../card/CardContext"
import FormButtons from "../card/FormButtons"
import { UploadedFileType } from "../../types/types"

interface GalleryProps {
    images: string[]
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
    const context = useContext(CardContext);
    const [imagesData, setImagesData] = useState<string[]>([])
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imagesToUpload, setImagesToUpload] = useState<UploadedFileType[]>([])
    const [imagesToDelete, setImagesToDelete] = useState<string[]>([])

    useEffect(() => {
        setImagesData(images)
    }, [images])

    const handleImageClick = (url: string) => setSelectedImage(url);

    const closeModal = () => setSelectedImage(null);

    if (!context) return null
    // Destructure required functions and countryName from context after the check
    const { countryName, handleSave, handleUpload, handleCancel, handleDelete, isChanged, isLoading } = context;

    const uploadImagesToStorage = () => {
        const name = getCountryDbName(countryName)
        imagesToUpload.forEach(async (image: UploadedFileType) => await uploadFileToStorage(name, image, "gallery"))
    }

    const removeImagesFromStorage = () => {
        imagesToDelete.forEach(async (image: string) => await removeFileFromStorage(image))
    }

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => 
        handleUpload(e, "gallery", imagesData, setImagesData, setImagesToUpload)

    const onSave = () => {
        // upload files to storage
        uploadImagesToStorage()
        const newGallery = imagesData.map((image: string) => {
            const newImageExists = imagesToUpload.find(newImage => newImage.url === image)
            return newImageExists?.dbUrl ?? image
        })
        // delete files from storage
        removeImagesFromStorage()
        handleSave(countryName, newGallery, "gallery", "Gallery")
    }
    const onCancel = async () => {
        const confimation = await handleCancel(setImagesData, images)
        if (confimation) {
            setImagesToDelete([])
            setImagesToUpload([])
        }
    }
    const onDelete = async (index: number, url: string) => {
        const del = await handleDelete(index, setImagesData, imagesData)
        if (del) setImagesToDelete([...imagesToDelete, url])
    }

    return (
        <section>
            {/* Grid for Gallery Images and Upload Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8">
                {/* Map through existing images (including newly added blob URLs) */}
                {imagesData.map((image, index) => (
                    <div
                        key={index}
                        className="
                                group relative w-full h-64 sm:h-72 lg:h-80 rounded-2xl overflow-hidden
                                bg-white shadow-xl border border-gray-200
                                transition-all duration-300 transform hover:scale-103 hover:shadow-2xl
                            "
                    >
                        <img
                            src={image}
                            alt={`Gallery item ${index + 1}`}
                            className="w-full h-full object-cover transition duration-300 ease-in-out group-hover:scale-110 group-hover:brightness-75"
                        />

                        {/* Overlay for View and Delete buttons */}
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {/* View Button (Eye icon) */}
                            <button
                                className="py-3 px-4 rounded-full bg-sky-50 text-blue-600 shadow-md hover:bg-blue-600 hover:text-white transition-all duration-200"
                                onClick={() => handleImageClick(image)}
                                title="View image"
                            >
                                <i className="fa fa-eye text-xl" />
                            </button>
                            {/* Delete Button (Trash icon) */}
                            <button
                                className="py-3 px-4 rounded-full bg-sky-50 text-red-600 shadow-md hover:bg-red-600 hover:text-white transition-all duration-200"
                                onClick={() => onDelete(index, image)}
                                title="Delete image"
                            >
                                <i className="fa fa-trash-can text-xl" />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Upload Button Card - Styled like other image cards */}
                <div className="
                        group relative w-full h-64 sm:h-72 lg:h-80 rounded-2xl overflow-hidden
                        bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-dashed border-blue-300
                        flex items-center justify-center cursor-pointer
                        transition-all duration-300 transform hover:scale-103 hover:shadow-2xl hover:border-blue-500
                    ">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        title="Upload new image"
                    />
                    <div className="flex flex-col items-center justify-center text-blue-500 group-hover:text-blue-700 transition-colors duration-200">
                        <i className="fa-solid fa-plus text-5xl mb-3"></i>
                        <span className="text-lg font-semibold">Add New Image</span>
                    </div>
                </div>
            </div>

            {/* Popup Modal for Enlarged Image */}
            {selectedImage && <ImagePopup image={selectedImage} closeModal={closeModal} />}

            {/* Reusable CardFooter Component */}
            <FormButtons isChanged={isChanged} isLoading={isLoading} onCancel={onCancel} onSave={onSave} />
        </section>
    );
};

export default Gallery;
