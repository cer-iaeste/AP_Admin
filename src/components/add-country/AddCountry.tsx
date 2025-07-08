import React, { useEffect, useState } from "react"; // Import useRef
import CardFooter from "../card/CardFooter";
import "../summer-reception/Weekend.css" // Keep this if it contains global styles you need
import { toast } from 'react-toastify';
import ImagePopup from "../../global/ImagePopup";
import { confirmModalWindow, createUploadFile, uploadFileToStorage } from "../../global/Global" // Assuming this function exists and is accessible
import { useNavigate } from "react-router-dom";
import { AddNewCountry } from "../../service/CountryService" // Assuming this service exists
import Back from "../../global/Back";

interface UploadedFile {
    file: File
    url: string // URL.createObjectURL for local preview
    dbUrl: string // URL to Firebase Storage
}

const AddCountry: React.FC = () => {
    const [isChanged, setIsChanged] = useState(false)
    const [change, setChange] = useState(false) // Used to trigger useEffect for form changes
    const navigate = useNavigate();
    // Country details states
    const [name, setName] = useState<string>("");
    const [flagImage, setFlagImage] = useState<File>(); // URL for the displayed image (local preview or Firebase URL)
    const [flagImageUrl, setFlagImageUrl] = useState<string>("")
    const [viewImage, setViewImage] = useState<string | null>(null); // For the ImagePopup
    const [region, setRegion] = useState<string>("");

    // Effect to check if form inputs have changed to enable/disable save button
    useEffect(() => {
        setIsChanged(name && flagImage && region ? true : false)
    }, [name, flagImage, region]);

    // Function to close the image preview modal
    const closeModal = () => setViewImage(null);

    // Handler for country name input
    const handleNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        setChange(true); // Indicate a change has occurred
    };

    // Handler for file upload (when a file is selected via the custom input)
    const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFlagImage(file)
            setFlagImageUrl(URL.createObjectURL(file))
            setChange(true)
        } else toast.error("Error while selecting file!");
    };

    // Handler for region select
    const handleOnRegionSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => setRegion(e.target.value);

    // Orchestrates file uploads to Firebase
    const uploadFilesToStorage = async () => {
        if (!flagImage) {
            toast.error("Flag image not found!")
            return;
        }
        try {
            const imageToUpload = createUploadFile(flagImage, name, "Logo")
            return await uploadFileToStorage(name, imageToUpload, 'Logo') ?? ""
        } catch (error) {
            toast.error("Error uploading flag image! " + error);
            throw error;
        }
    };

    // Handler for deleting the current image selection
    const onDeleteFlag = async () => {
        setFlagImageUrl("")
        setFlagImage(undefined)
        setChange(true)
    };

    // Handler for saving changes (uploading files and adding country to DB)
    const onSave = async () => {
        // Basic validation
        if (!name || !flagImage || !region) {
            toast.error("Please fill in all fields (Country Name, Flag, Region) before saving.");
            return;
        }

        try {
            // Step 1: Upload files to storage first
            const uploadedFlagUrl = await uploadFilesToStorage();
            if (!uploadedFlagUrl) toast.error("Error uploading flag image to db!")
            else {
                // Step 2: Save country data to database
                // Ensure 'image' state holds the final Firebase URL after uploadFilesToStorage
                const promise = AddNewCountry(name, uploadedFlagUrl, region);
                await toast.promise(promise, {
                    pending: "Saving new country...",
                    success: {
                        render() {
                            setIsChanged(false);
                            navigate(`/countries/${name}`);
                            return `New country "${name}" added successfully!`;
                        }
                    },
                    error: "Error saving new country!" // Generic error, toast.promise handles specific error from promise
                });
            }
            
        } catch (error) {
            // Error handling already done in uploadFilesToStorage or toast.promise
            console.error("Save process failed:", error);
        }
    };

    // Handler for canceling (clearing form and navigating back)
    const onCancel = async () => {
        const confirmation = await confirmModalWindow("All unsaved changes will be lost. Are you sure?");
        if (confirmation) {
            setName("");
            setFlagImage(undefined)
            setFlagImageUrl("")
            setRegion("");
            setChange(false); // Reset change indicator
            setIsChanged(false); // Reset save button state
            navigate("/countries"); // Navigate back to countries list
        }
    };

    return (
        <section className="bg-sky-50 min-h-screen text-[#1B75BB]">
            <div className="container">
                {/* Header Section */}
                <div className="flex flex-col justify-center text-center md:text-left relative">
                    <Back confirmationNeeded={change} />

                    <span className="font-semibold text-3xl lg:text-4xl mt-20">Add a new country</span>
                    <div className="font-bold items-center text-lg mt-2 flex justify-center md:justify-start">
                        <i className="fa fa-circle-info mr-3 text-2xl"></i>
                        <span>First add the name, region & flag. Then you'll be redirected to the country's cards page.</span>
                    </div>
                </div>

                {/* Input Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                    {/* Country Name Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 flex flex-col items-center justify-center min-h-[180px]">
                        <div className="text-xl font-semibold text-gray-700 pb-2 mb-4 border-b-2 border-blue-200 w-full text-center">
                            <i className="fa-solid fa-flag mr-2 text-blue-600"></i> IAESTE Country Name
                        </div>
                        <input
                            type="text"
                            value={name}
                            onChange={handleNameInput}
                            placeholder="Enter Country Name"
                            className="text-input"
                        />
                    </div>

                    {/* Region Select Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 flex flex-col space-y-4 min-h-[180px] justify-center">
                            <div className="text-xl font-semibold text-gray-700 pb-2 border-b-2 border-blue-200 w-full text-center">
                                <i className="fa-solid fa-globe mr-2 text-blue-600"></i> IAESTE Region
                            </div>
                            <select
                                value={region}
                                onChange={handleOnRegionSelectChange}
                                className="text-input"
                            >
                                <option value="">Select a Region</option> 
                                <option value="cer">CER</option>
                                <option value="core">CoRe</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                    {/* Flag Upload Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 flex flex-col items-center justify-center min-h-[220px]">
                            <div className="text-xl font-semibold text-gray-700 pb-2 mb-4 border-b-2 border-blue-200 w-full text-center">
                                <i className="fa-solid fa-flag-usa mr-2 text-blue-600"></i> Country Flag
                            </div>
                            {flagImage ? (
                                <div className="flex flex-col items-center w-full p-3 space-y-4">
                                    <img src={flagImageUrl} alt="Flag Preview" className="h-24 w-auto object-contain rounded-md shadow-md border border-gray-200" />
                                    <span className="text-md font-medium text-gray-700 truncate w-full text-center">
                                        Flag.jpg
                                    </span>
                                    <div className="flex items-center gap-4 mt-2">
                                        <button
                                            className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            onClick={() => setViewImage(flagImageUrl)}
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
                                    className="flex flex-col items-center justify-center w-full h-full p-6 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-100 transition-all duration-300 group"
                                >
                                    <input
                                        id="flag-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleUpload}
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

            <CardFooter isChanged={isChanged} onCancel={onCancel} onSave={onSave} />
        </section>
    );
};

export default AddCountry;
