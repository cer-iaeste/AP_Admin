import React, { useEffect, useState } from "react";
import { ref, uploadBytes } from "firebase/storage"; // Import deleteObject and ref if using Firebase storage
import { storage } from "../../firebase"; // Update with your Firebase config path
import CardFooter from "../card/CardFooter";
import "../summer-reception/Weekend.css"
import { toast } from 'react-toastify';
import ImagePopup from "../../global/ImagePopup";
import { confirmModalWindow } from "../../global/Global"
import { useNavigate } from "react-router-dom";
import { AddNewCountry } from "../../service/CountryService"

interface UploadedFile {
    file: File
    url: string
    dbUrl: string
}

const AddCountry = () => {
    const [isChanged, setIsChanged] = useState(false)
    const [change, setChange] = useState(false)
    const navigate = useNavigate();
    // country name
    const [name, setName] = useState<string>("")
    // image
    const [image, setImage] = useState<string>("")
    const [viewImage, setViewImage] = useState<string | null>(null)
    const [imageToUpload, setImageToUpload] = useState<UploadedFile>()
    // region
    const [region, setRegion] = useState<string>("")

    // functions
    useEffect(() => {
        if (name && image && region) setIsChanged(true)
        else setIsChanged(false)
    }, [change])

    const closeModal = () => setViewImage(null);

    const handleNameInput = (e: any) => {
        setName(e.target.value)
    }
    
    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const setNewFile = (file: File, setFile: (fileName: string) => void, setFileToUpload: (file: UploadedFile) => void, folderName: string) => {
            const newFile: UploadedFile = {
                file,
                url: URL.createObjectURL(file),
                dbUrl: `https://firebasestorage.googleapis.com/v0/b/iaeste-ap.appspot.com/o/${name}%2F${folderName}%2F${file.name}?alt=media`
            }
            setFile(newFile.url)
            setFileToUpload(newFile)
            setChange(true)
        }

        const file = event.target.files?.[0]
        file ? 
            setNewFile(file, setImage, setImageToUpload, "Logo") 
            : toast.error("Error while uploading file!")
    };

    const handleOnRegionSelectChange = (selectedRegion: string) => {
        setRegion(selectedRegion)
        setChange(true)
    }

    const uploadFile = async(fileToUpload: UploadedFile, folder: string) => {
        const storageRef = ref(storage, `${name}/${folder}/${fileToUpload.file.name}`);
        // Upload to storage
        await uploadBytes(storageRef, fileToUpload.file);
    }

    const uploadFilesToStorage = async () => {
        try {
            if (imageToUpload) await uploadFile(imageToUpload, 'Logo')
        } catch (error) {
            toast.error("Error uploading files! " + error)
            return null
        }
    }

    const onDelete = () => {
        setImage("")
        setChange(false)
    }

    const onSave = async () => {
        // upload files to storage
        await uploadFilesToStorage()
        // save changes
        const promise = AddNewCountry(name, image, region)
        toast.promise(promise, {
            pending: "Saving changes...",
            success: {
                render() {
                    setIsChanged(false);
                    navigate(`/countries/${name}`)
                    return `New country "${name}" added successfully!`
                }
            },
            error: "Document not found!"
        })
    }

    const onCancel = async () => {
        const confirmation = await confirmModalWindow("All unsaved changes will be lost")
        if (confirmation) {
            setName("")
            setImageToUpload(undefined)
            setRegion("")
            navigate("/countries")
        }
    }

    const onBack = async () => onCancel()

    return (
        <section>
            <div className="mt-6 table-margins mx-2 space-y-8">
                <div className="text-[#1B75BB] flex flex-col justify-center">
                    <span className="font-semibold text-3xl lg:text-4xl">Add a new country</span>
                    <div className="font-bold items-center text-lg mt-2">
                        <i className="fa fa-circle-info mr-3"></i>First add the name, flag & region. Then you'll be redirected to the country's cards page.
                    </div>
                </div>
                {/* Files */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div key="region" className="card-container">
                        <div className="card-header">
                            IAESTE Country name
                        </div>
                        <input type="text" value={name} className="text-input" onChange={handleNameInput} />
                    </div>
                    <div key="banner" className="card-container">
                        <div className="card-header">
                            Flag
                        </div>
                        {image ?
                            <div className="flex justify-between w-full p-3">
                                <div className="flex underline items-center text-xl">
                                    CountryFlag.jpg
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
                    <div key="region" className="card-container">
                        <div className="card-header">
                            IAESTE Region
                        </div>
                        <select
                            value={region} // This will be your state variable for the selected region
                            onChange={(e) => handleOnRegionSelectChange(e.target.value)}
                            className="
                            block w-full p-2 mt-2 text-xl font-semibold
                            text-gray-700 bg-white border border-gray-300 rounded-md
                            shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500
                            appearance-none pr-8
                            cursor-pointer
                            hover:border-gray-400
                            transition duration-150 ease-in-out
                            "
                        >
                            <option value="cer">CER</option>
                            <option value="core">CoRe</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>
            </div>
            {viewImage && <ImagePopup image={viewImage} closeModal={closeModal} />}

            <CardFooter isChanged={isChanged} onCancel={onCancel} onSave={onSave} onBack={onBack} />
        </section>
    );
};

export default AddCountry;
