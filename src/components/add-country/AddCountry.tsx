import React, { useEffect, useState, useRef } from "react"; // Import useRef
import { ref, uploadBytes, deleteObject } from "firebase/storage"; // Import deleteObject and ref if using Firebase storage
import { storage } from "../../firebase"; // Update with your Firebase config path
import CardFooter from "../card/CardFooter";
import "../summer-reception/Weekend.css" // Keep this if it contains global styles you need
import { toast } from 'react-toastify';
import ImagePopup from "../../global/ImagePopup";
import { confirmModalWindow } from "../../global/Global" // Assuming this function exists and is accessible
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
    const [image, setImage] = useState<string>(""); // URL for the displayed image (local preview or Firebase URL)
    const [viewImage, setViewImage] = useState<string | null>(null); // For the ImagePopup
    const [imageToUpload, setImageToUpload] = useState<UploadedFile | undefined>(undefined); // File to be uploaded
    const [region, setRegion] = useState<string>("");

    // Ref for the hidden file input
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Effect to check if form inputs have changed to enable/disable save button
    useEffect(() => {
        // Simple check: form is 'changed' if any of the core fields have content
        // You might want a more sophisticated comparison if editing existing data
        if (name && image && region) {
            setIsChanged(true);
        } else {
            setIsChanged(false);
        }
    }, [name, image, region]); // Depend on actual state values

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
            const newFile: UploadedFile = {
                file: file,
                url: URL.createObjectURL(file), // Create a local URL for instant preview
                // Construct Firebase Storage URL (this will be the final URL saved to DB)
                // Ensure 'name' state is updated before this is finalized for correct path
                dbUrl: `https://firebasestorage.googleapis.com/v0/b/iaeste-ap.appspot.com/o/${encodeURIComponent(name)}%2FLogo%2F${encodeURIComponent(file.name)}?alt=media`
            };
            setImage(newFile.url); // Set image state to local URL for preview
            setImageToUpload(newFile); // Store the file and its URLs for upload
            setChange(true); // Indicate change
        } else {
            toast.error("Error while selecting file!");
        }
    };

    // Handler for region select
    const handleOnRegionSelectChange = (selectedRegion: string) => {
        setRegion(selectedRegion);
        setChange(true); // Indicate change
    };

    // Function to upload a single file to Firebase Storage
    const uploadFile = async (fileToUpload: UploadedFile, folder: string) => {
        // Ensure name is valid before constructing storage path
        if (!name) {
            throw new Error("Country name is required before uploading files.");
        }
        const storagePath = `${name}/${folder}/${fileToUpload.file.name}`;
        const storageRef = ref(storage, storagePath);
        await uploadBytes(storageRef, fileToUpload.file);
        // After successful upload, update the 'image' state to the final Firebase DB URL
        // This is important because 'image' is used in AddNewCountry and also for viewing
        setImage(fileToUpload.dbUrl);
    };

    // Orchestrates file uploads to Firebase
    const uploadFilesToStorage = async () => {
        if (!imageToUpload) {
            return; // No file to upload
        }
        try {
            await uploadFile(imageToUpload, 'Logo');
            toast.success("Flag image uploaded successfully!");
        } catch (error) {
            console.error("Error uploading files to storage:", error);
            toast.error("Error uploading flag image! " + error);
            throw error; // Re-throw to be caught by onSave's toast.promise
        }
    };

    // Handler for deleting the current image selection
    const onDelete = async () => {
        setImage(""); // Clear image preview
        setImageToUpload(undefined); // Clear file to upload
        setChange(true); // Indicate change
    };

    // Handler for saving changes (uploading files and adding country to DB)
    const onSave = async () => {
        // Basic validation
        if (!name || !imageToUpload || !region) {
            toast.error("Please fill in all fields (Country Name, Flag, Region) before saving.");
            return;
        }

        try {
            // Step 1: Upload files to storage first
            await uploadFilesToStorage();

            // Step 2: Save country data to database
            // Ensure 'image' state holds the final Firebase URL after uploadFilesToStorage
            const promise = AddNewCountry(name, image, region);
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
            setImage(""); // Clear display URL
            setImageToUpload(undefined); // Clear file to upload
            setRegion("");
            setChange(false); // Reset change indicator
            setIsChanged(false); // Reset save button state
            navigate("/countries"); // Navigate back to countries list
        }
    };

    // Handler for "Back" button, reuses onCancel logic
    const onBack = async () => onCancel();

    return (
        <section className="p-4 bg-sky-50 min-h-screen text-[#1B75BB]">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col justify-center text-center md:text-left relative">
                    <Back confirmationNeeded={true}/>
                    
                    <span className="font-semibold text-3xl lg:text-4xl mt-20">Add a new country</span>
                    <div className="font-bold items-center text-lg mt-2 flex justify-center md:justify-start">
                        <i className="fa fa-circle-info mr-3 text-2xl"></i>
                        <span>First add the name, region & flag. Then you'll be redirected to the country's cards page.</span>
                    </div>
                </div>

                {/* Input Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Country Name Card */}
                    <div className="bg-emerald-50 p-6 rounded-xl shadow-lg border border-stone-200 flex flex-col space-y-4">
                        <div className="text-xl font-semibold text-gray-700 pb-2 border-b border-stone-200">
                            IAESTE Country Name
                        </div>
                        <input
                            type="text"
                            placeholder="e.g. Macedonia"
                            value={name}
                            className="text-input"
                            onChange={handleNameInput}
                        />
                    </div>

                    {/* Region Select Card */}
                    <div className="bg-blue-50 p-6 rounded-xl shadow-lg border border-blue-200 flex flex-col space-y-4">
                        <div className="text-xl font-semibold text-gray-700 pb-2 border-b border-blue-200">
                            IAESTE Region
                        </div>
                        <select
                            value={region}
                            onChange={(e) => handleOnRegionSelectChange(e.target.value)}
                            className="text-input"
                        >
                            <option value="">Select a Region</option> {/* Added a default empty option */}
                            <option value="CER">CER</option>
                            <option value="CoRe">CoRe</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Flag Upload Card - Modern Design */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex flex-col items-center justify-center min-h-[150px]">
                        <div className="text-xl font-semibold text-gray-700 pb-2 mb-4 border-b border-gray-200 w-full text-center">
                            Flag
                        </div>
                        {image ? (
                            <div className="flex flex-col items-center w-full p-3 space-y-4">
                                <img src={image} alt="Country Flag Preview" className="h-24 w-auto object-contain rounded-md shadow-md border border-gray-200" />
                                <span className="text-md font-medium text-gray-700 truncate w-full text-center">
                                    {imageToUpload?.file.name || "Uploaded Flag Image"}
                                </span>
                                <div className="flex items-center gap-4 mt-2">
                                    <button
                                        className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#1B75BB] text-[#1B75BB] hover:bg-[#1B75BB] hover:text-white transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#1B75BB]"
                                        onClick={() => setViewImage(image)}
                                        title="View image"
                                    >
                                        <i className="fa fa-eye text-xl" />
                                    </button>
                                    <button
                                        className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-red-500 text-red-500 hover:text-white hover:bg-red-500 transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        onClick={onDelete}
                                        title="Delete image"
                                    >
                                        <i className="fa fa-trash text-xl" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <label
                                htmlFor="flag-upload"
                                className="flex flex-col items-center justify-center w-full h-full p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group"
                            >
                                <input
                                    id="flag-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleUpload}
                                    className="hidden" // Hide the default input
                                    ref={fileInputRef} // Assign ref to reset if needed
                                />
                                <div className="text-center text-gray-500 group-hover:text-blue-600 transition-colors duration-300 flex flex-row justify-between items-center gap-x-4">
                                    <i className="fa fa-cloud-arrow-up text-4xl"></i>
                                    <div className="flex flex-col">
                                        <p className="text-lg font-medium">Upload Flag Image</p>
                                        <p className="text-sm">PNG, JPG, GIF up to 5MB</p>
                                    </div>
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
