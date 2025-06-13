import React, { useState, useEffect } from "react";
import { ref, uploadBytes, deleteObject } from "firebase/storage"; // Import deleteObject and ref if using Firebase storage
import { storage } from "../../firebase"; // Update with your Firebase config path
import CardFooter from "../card/CardFooter";
import "../summer-reception/Weekend.css" // Keep this if it contains global styles you need
import { CardProps, getCountryDbName } from "../../global/Global"; // Assuming these functions and types exist
import { toast } from 'react-toastify';
import ImagePopup from "../../global/ImagePopup";
import Back from "../../global/Back";

interface HeroBannerProps extends CardProps {
    content: {
        banner: string
        pdf: string
        region: string
    };
}

interface UploadedFile {
    file: File
    url: string // URL.createObjectURL for local preview
    dbUrl: string // URL to Firebase Storage
}

const Hero: React.FC<HeroBannerProps> = ({ content, country, handleSave, handleCancel }) => {
    const [isChanged, setIsChanged] = useState(false)
    // image (banner)
    const [image, setImage] = useState<string>("")
    const [viewImage, setViewImage] = useState<string | null>(null)
    const [imageToUpload, setImageToUpload] = useState<UploadedFile | undefined>(undefined)
    const [imageToDelete, setImageToDelete] = useState<string>("") // Stores Firebase URL of image to delete
    // pdf
    const [pdf, setPdf] = useState<string>("")
    const [pdfToUpload, setPdfToUpload] = useState<UploadedFile | undefined>()
    const [pdfToDelete, setPdfToDelete] = useState<string>("") // Stores Firebase URL of PDF to delete
    // region
    const [region, setRegion] = useState<string>("")

    // Initialize state with content props when component mounts or content changes
    useEffect(() => {
        setImage(content.banner)
        setPdf(content.pdf)
        setRegion(content.region)
        setIsChanged(false); // Reset changed status when content loads
        setImageToUpload(undefined); // Clear any pending uploads
        setPdfToUpload(undefined);
        setImageToDelete(""); // Clear any pending deletions
        setPdfToDelete("");
    }, [content])

    // Effect to determine if changes have been made to enable save button
    useEffect(() => {
        const hasImageChanged = image !== content.banner || imageToUpload !== undefined;
        const hasPdfChanged = pdf !== content.pdf || pdfToUpload !== undefined;
        const hasRegionChanged = region !== content.region;

        // Check if any file is queued for deletion
        const hasDeletionPending = imageToDelete !== "" || pdfToDelete !== "";

        setIsChanged(hasImageChanged || hasPdfChanged || hasRegionChanged || hasDeletionPending);
    }, [image, pdf, region, imageToUpload, pdfToUpload, imageToDelete, pdfToDelete, content]);

    // Function to close the image preview modal
    const closeModal = () => {
        setViewImage(null);
    };

    // Generic file upload handler for both banner and PDF
    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            toast.error("No file selected!");
            return;
        }

        const countryName = getCountryDbName(country);
        const folderName = file.type === "application/pdf" ? "pdf" : "banner"; // Determine folder based on file type
        const newFile: UploadedFile = {
            file,
            url: URL.createObjectURL(file), // Local URL for instant preview
            dbUrl: `https://firebasestorage.googleapis.com/v0/b/iaeste-ap.appspot.com/o/${encodeURIComponent(countryName)}%2F${folderName}%2F${encodeURIComponent(file.name)}?alt=media`
        };

        if (folderName === "pdf") {
            setPdf(newFile.url);
            setPdfToUpload(newFile);
            setPdfToDelete(content.pdf); // Mark old PDF for deletion if replaced
        } else { // It's a banner image
            setImage(newFile.url);
            setImageToUpload(newFile);
            setImageToDelete(content.banner); // Mark old banner for deletion if replaced
        }
        event.target.value = ''; // Clear the input so selecting the same file again triggers change
    };

    // Handler for region select
    const handleOnRegionSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRegion(e.target.value);
    };

    // Function to upload a single file to Firebase Storage
    const uploadFile = async (fileToUpload: UploadedFile, folder: string) => {
        const countryName = getCountryDbName(country);
        const storageRef = ref(storage, `${countryName}/${folder}/${fileToUpload.file.name}`);
        await uploadBytes(storageRef, fileToUpload.file);
        return fileToUpload.dbUrl; // Return the permanent DB URL
    };

    // Orchestrates file uploads to Firebase
    const uploadFilesToStorage = async () => {
        let uploadedBannerUrl = image; // Assume current image is already uploaded unless a new one is picked
        let uploadedPdfUrl = pdf; // Assume current pdf is already uploaded unless a new one is picked

        try {
            if (imageToUpload) {
                uploadedBannerUrl = await uploadFile(imageToUpload, 'banner');
                toast.success("Banner image uploaded successfully!");
            }
            if (pdfToUpload) {
                uploadedPdfUrl = await uploadFile(pdfToUpload, 'pdf');
                toast.success("PDF document uploaded successfully!");
            }
        } catch (error) {
            console.error("Error uploading files to storage:", error);
            throw new Error("File upload failed!"); // Re-throw to be caught by onSave
        }
        return { uploadedBannerUrl, uploadedPdfUrl };
    };

    // Orchestrates file removals from Firebase Storage
    const removeFilesFromStorage = async () => {
        const countryName = getCountryDbName(country);
        try {
            if (imageToDelete && imageToDelete !== image) { // Delete only if different from new image
                const oldImageRef = ref(storage, decodeURIComponent(imageToDelete.split('o/')[1].split('?alt=media')[0]));
                await deleteObject(oldImageRef);
                toast.info("Old banner image removed from storage.");
            }
            if (pdfToDelete && pdfToDelete !== pdf) { // Delete only if different from new pdf
                const oldPdfRef = ref(storage, decodeURIComponent(pdfToDelete.split('o/')[1].split('?alt=media')[0]));
                await deleteObject(oldPdfRef);
                toast.info("Old PDF document removed from storage.");
            }
        } catch (error) {
            // Log error but don't prevent saving other changes, as file might not exist or be accessible
            console.error("Error removing files from storage:", error);
            toast.warn("Could not remove old files from storage (might not exist or be accessible).");
        }
    };

    const onSave = async () => {
        // Basic validation before saving
        if (!image && !imageToUpload) { // Banner is now optional as per new design interpretation (if no default)
            toast.error("Please upload a banner image.");
            return;
        }
        // PDF is optional in this context
        if (!region) {
            toast.error("Please select a region.");
            return;
        }

        try {
            // Step 1: Upload new files to storage and get their final URLs
            const { uploadedBannerUrl, uploadedPdfUrl } = await uploadFilesToStorage();

            // Step 2: Remove old files from storage (if any were replaced/deleted)
            await removeFilesFromStorage();

            // Step 3: Call parent's handleSave with updated content (using final URLs)
            await handleSave(country, uploadedBannerUrl, "banner", "Hero banner", setIsChanged);
            await handleSave(country, uploadedPdfUrl, "pdf", "PDF", setIsChanged);
            await handleSave(country, region, "region", "Region", setIsChanged);

            toast.success("All changes saved successfully!");
            setIsChanged(false); // Reset changed state after successful save
            // After successful save, ensure local image/pdf state points to the newly uploaded/persisted URLs
            setImage(uploadedBannerUrl);
            setPdf(uploadedPdfUrl);
            setImageToUpload(undefined); // Clear pending uploads
            setPdfToUpload(undefined);
            setImageToDelete(""); // Clear pending deletions
            setPdfToDelete("");

        } catch (error) {
            console.error("Save process failed:", error);
            toast.error(`Failed to save changes: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const onCancel = async () => {
        // Re-use parent's handleCancel which should show confirmation and reset state
        const confirmation = await handleCancel(isChanged, setRegion, content.region, setIsChanged);
        if (confirmation) {
            // Manually reset local state based on initial content if parent confirms cancellation
            setImage(content.banner);
            setPdf(content.pdf);
            setRegion(content.region);
            setImageToUpload(undefined);
            setPdfToUpload(undefined);
            setImageToDelete("");
            setPdfToDelete("");
            setIsChanged(false);
            toast.info("Changes discarded.");
        }
    };

    // Generic delete handler for banner image
    const onDeleteImage = () => {
        if (image) {
            setImageToDelete(image); // Mark current image for deletion
            setImage(""); // Clear local preview
            setImageToUpload(undefined); // Clear any pending upload
            setIsChanged(true);
            toast.info("Banner image marked for deletion (save to confirm).");
        }
    };

    // Generic delete handler for PDF
    const onDeletePdf = () => {
        if (pdf) {
            setPdfToDelete(pdf); // Mark current PDF for deletion
            setPdf(""); // Clear local preview
            setPdfToUpload(undefined); // Clear any pending upload
            setIsChanged(true);
            toast.info("PDF document marked for deletion (save to confirm).");
        }
    };

    return (
        <section className="text-[#1B75BB]">
            {/* Input Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-10">
                {/* Banner Upload Card */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex flex-col items-center justify-center min-h-[180px]">
                    <div className="text-xl font-semibold text-gray-700 pb-2 mb-4 border-b border-gray-200 w-full text-center">
                        Banner Image
                    </div>
                    {image ? (
                        <div className="flex flex-col items-center w-full p-3 space-y-4">
                            <img src={image} alt="Hero Banner Preview" className="h-28 w-auto object-contain rounded-md shadow-md border border-gray-200" />
                            <span className="text-md font-medium text-gray-700 truncate w-full text-center">
                                {imageToUpload?.file.name || image.split('/').pop()?.split('?')[0] || "Current Banner Image"}
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
                                    onClick={onDeleteImage}
                                    title="Delete image"
                                >
                                    <i className="fa fa-trash text-xl" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <label
                            htmlFor="banner-upload"
                            className="flex flex-col items-center justify-center w-full h-full p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group"
                        >
                            <input
                                id="banner-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleUpload}
                                className="hidden" // Hide the default input
                            />
                            <div className="text-center text-gray-500 group-hover:text-blue-600 transition-colors duration-300 flex flex-col items-center">
                                <i className="fa fa-image text-4xl mb-2"></i>
                                <p className="text-lg font-medium">Upload Banner Image</p>
                                <p className="text-sm">PNG, JPG, GIF</p>
                            </div>
                        </label>
                    )}
                </div>

                {/* PDF Upload Card */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex flex-col items-center justify-center min-h-[180px]">
                    <div className="text-xl font-semibold text-gray-700 pb-2 mb-4 border-b border-gray-200 w-full text-center">
                        Country PDF
                    </div>
                    {pdf ? (
                        <div className="flex flex-col items-center w-full p-3 space-y-4">
                            <i className="fa-solid fa-file-pdf text-6xl text-red-600 mb-2"></i>
                            <span className="text-md font-medium text-gray-700 truncate w-full text-center">
                                {pdfToUpload?.file.name || pdf.split('/').pop()?.split('?')[0] || "Current PDF Document"}
                            </span>
                            <div className="flex items-center gap-4 mt-2">
                                <a
                                    className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#1B75BB] text-[#1B75BB] hover:bg-[#1B75BB] hover:text-white transition-all duration-200 transform hover:scale-110"
                                    href={pdf} target="_blank" rel="noreferrer"
                                    title="View PDF"
                                >
                                    <i className="fa fa-eye text-xl" />
                                </a>
                                <button
                                    className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-red-500 text-red-500 hover:text-white hover:bg-red-500 transition-transform transform hover:scale-110"
                                    onClick={onDeletePdf}
                                    title="Delete PDF"
                                >
                                    <i className="fa fa-trash text-xl" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <label
                            htmlFor="pdf-upload"
                            className="flex flex-col items-center justify-center w-full h-full p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group"
                        >
                            <input
                                id="pdf-upload"
                                type="file"
                                accept=".pdf"
                                onChange={handleUpload}
                                className="hidden" // Hide the default input
                            />
                            <div className="text-center text-gray-500 group-hover:text-blue-600 transition-colors duration-300 flex flex-col items-center">
                                <i className="fa fa-file-pdf text-4xl mb-2"></i>
                                <p className="text-lg font-medium">Upload Country PDF</p>
                                <p className="text-sm">PDF (max 5MB)</p>
                            </div>
                        </label>
                    )}
                </div>

                {/* Region Select Card 
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex flex-col space-y-4 min-h-[180px] justify-center">
                        <div className="text-xl font-semibold text-gray-700 pb-2 border-b border-gray-200 w-full text-center">
                            IAESTE Region
                        </div>
                        <select
                            value={region}
                            onChange={handleOnRegionSelectChange}
                            className="
                            block w-full p-3 text-lg font-semibold
                            text-gray-700 bg-white border border-gray-300 rounded-md
                            shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500
                            appearance-none pr-8 cursor-pointer
                            hover:border-gray-400 transition duration-150 ease-in-out
                            "
                        >
                            <option value="">Select a Region</option> 
                            <option value="CER">CER</option>
                            <option value="CoRe">CoRe</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    */}
            </div>
            {viewImage && <ImagePopup image={viewImage} closeModal={closeModal} />}

            <CardFooter isChanged={isChanged} onCancel={onCancel} onSave={onSave} />
        </section>
    );
};

export default Hero;
