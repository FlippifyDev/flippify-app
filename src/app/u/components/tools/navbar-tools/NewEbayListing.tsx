"use client"


// Local Imports
import Modal from "../../dom/ui/Modal"
import Input from "../../dom/ui/Input"
import ImageUpload from "../../dom/ui/ImageUpload"
import { addCacheData } from "@/utils/cache-helpers"
import { formatDateToISO } from "@/utils/format-dates"
import { IEbayInventoryItem } from "@/models/store-data"
import { createNewInventoryItemAdmin } from "@/services/firebase/create-admin"
import { ebayInventoryCacheKey, storePlatforms, subscriptionLimits } from "@/utils/constants"
import { validateNumberInput, validatePriceInput, validateTextInput } from "@/utils/input-validation"

// External Imports
import { FormEvent, useState } from "react"
import { useSession } from "next-auth/react"
import Image from "next/image"


interface NewEbayListingFormProps {
    setDisplayModal: (value: boolean) => void
}


const NewEbayListingForm: React.FC<NewEbayListingFormProps> = ({ setDisplayModal }) => {
    const { data: session } = useSession();

    // General Info
    const [itemId, setItemId] = useState<string>("")
    const [itemName, setItemName] = useState<string>("")
    const [imageUrl, setImageUrl] = useState<string>("");
    const [customTag, setCustomTag] = useState<string>("")
    
    // Purchase Info
    const [purchasePrice, setPurchasePrice] = useState<string>("")
    const [purchasePlatform, setPurchasePlatform] = useState<string>("")
    const [datePurchased, setDatePurchased] = useState<string>(new Date().toISOString().split('T')[0])
    
    // Listing Info
    const [listingPrice, setListingPrice] = useState<string>("")
    const [quantity, setQuantity] = useState<string>("1")
    const [dateListed, setDateListed] = useState<string>(new Date().toISOString().split('T')[0])
    
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [fileName, setFileName] = useState("Upload Image");

    // Messages
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [successMessage, setSuccessMessage] = useState<string>("")

    const [loading, setLoading] = useState<boolean>(false);

    const aboveLimit = isAboveLimit();


    function handleCacheUpdate(inventoryItem: IEbayInventoryItem) {
        const inventoryCacheKey = `${ebayInventoryCacheKey}-${session?.user.id}`;
        
        // Update the cache with the new item
        addCacheData(inventoryCacheKey, inventoryItem);
    }

    function isAboveLimit() {
        const plan = session?.user.authentication.subscribed;
        if (!plan) {
            setErrorMessage("Please subscribe to a plan to add listings.");
            setLoading(false);
            return true;
        }
        const manualListings = session?.user.store?.ebay.numListings.manual || 0;

        if (manualListings >= subscriptionLimits[plan].manual) {
            setErrorMessage(`You have reached the maximum number of manual listings for your plan. Please upgrade your plan to add more or wait till next month.`);
            setLoading(false);
            return true;
        }

        return false;
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true);
        
        const aboveLimit = isAboveLimit();
        if (aboveLimit) return;

        const inventoryItem: IEbayInventoryItem = {
            customTag: customTag,
            dateListed: formatDateToISO(new Date(dateListed)),
            image: [imageUrl],
            initialQuantity: Number(quantity),
            itemId: itemId,
            itemName: itemName,
            price: Number(listingPrice),
            purchase: {
                date: datePurchased ? datePurchased : dateListed,
                platform: purchasePlatform || null,
                price: purchasePrice ? Number(purchasePrice) : null,
                quantity: quantity ? Number(quantity) : null
            },
            quantity: Number(quantity),
            recordType: "manual",
        }

        const { success, error } = await createNewInventoryItemAdmin(session?.user.id ?? "", storePlatforms.ebay, inventoryItem);
        if (!success) {
            console.error("Error creating new inventory item", error)
            setErrorMessage("Error creating new inventory item")
            return
        }

        handleCacheUpdate(inventoryItem);

        setLoading(false);
        setSuccessMessage("Listing Added!")
    }

    function handleChange(value: string, type: string) {
        switch (type) {
            case "customTag":
                validateTextInput(value, setCustomTag)
                break
            case "dateListed":
                setDateListed(value)
                break
            case "datePurchased":
                setDatePurchased(value)
                break
            case "itemId":
                setItemId(value)
                break
            case "itemName":
                validateTextInput(value, setItemName)
                break
            case "listingPrice":
                validatePriceInput(value, setListingPrice)
                break
            case "purchasePlatform":
                validateTextInput(value, setPurchasePlatform)
                break
            case "purchasePrice":
                validatePriceInput(value, setPurchasePrice)
                break
            case "quantity":
                validateNumberInput(value, setQuantity)
                break
        }
    }

    async function handleImageUpload(url?: string | null) {
        const finalUrl = imageUrl || url;
        if (finalUrl) {
            setImageUrl(finalUrl);
        }
    }

    return (
        <Modal title="Add a new eBay listing" className="max-w-[21rem] sm:max-w-xl flex-grow" setDisplayModal={setDisplayModal}>
            {aboveLimit && (
                <div className="text-center">
                    <span>Sorry you&aposve reach your max manual listings for this month</span>
                </div>
            )}
            
            {!aboveLimit && (
                <form className="w-full max-w-xl flex flex-col gap-4" onSubmit={handleSubmit}>
                    <Input type="text" placeholder="Enter item id" title="Product ID" value={itemId} onChange={(e) => handleChange(e.target.value, "itemId")} />
                    <div className="flex flex-col sm:flex-row items-center w-full gap-4">
                        <Input type="text" placeholder="Enter item name" title="Product Name" value={itemName} onChange={(e) => handleChange(e.target.value, "itemName")} />
                        <Input type="text" placeholder="Enter quantity" title="Quantity" value={quantity} onChange={(e) => handleChange(e.target.value, "quantity")} />
                    </div>
                    <div className="flex flex-col sm:flex-row items-center w-full gap-4">
                        <Input type="text" placeholder="Enter listing price" title="Listing Price" value={listingPrice} onChange={(e) => handleChange(e.target.value, "listingPrice")} />
                        <Input type="text" placeholder="Enter purchase price" title="Purchase Price (Optional)" value={purchasePrice} onChange={(e) => handleChange(e.target.value, "purchasePrice")} />
                    </div>
                    <div className="flex flex-col sm:flex-row items-center w-full gap-4">
                        <Input type="text" placeholder="Enter purchase platform" title="Purchase Platform (Optional)" value={purchasePlatform} onChange={(e) => handleChange(e.target.value, "purchasePlatform")} />
                        <Input type="text" placeholder="Enter custom tag" title="Custom Tag (Optional)" value={customTag} onChange={(e) => handleChange(e.target.value, "customTag")} />
                    </div>
                    <div className="flex flex-col sm:flex-row items-center w-full gap-4">
                        <Input type="date" placeholder="Enter listing date" title="Listing Date" className="w-full" value={dateListed} onChange={(e) => handleChange(e.target.value, "dateListed")} />
                        <Input type="date" placeholder="Enter purchase date" title="Purchase Date" className="w-full" value={dateListed} onChange={(e) => handleChange(e.target.value, "datePurchased")} />
                    </div>
                    <hr />
                    <div className="w-full flex flex-row gap-4 justify-between items-center">
                        <div className="flex flex-row gap-2">
                            <div className='flex items-center'>
                                <button
                                    type="button"
                                    className="bg-houseBlue text-white text-sm py-2 px-4 rounded-md hover:bg-houseHoverBlue transition duration-200"
                                    onClick={() => setIsModalOpen(true)}>
                                    {imageUrl ? "Change Image" : "Upload Image"}
                                </button>
                            </div>
                            {imageUrl && (
                                <figure className="border-[3px] rounded-full">
                                    <Image
                                        src={imageUrl}
                                        alt="Uploaded Image"
                                        width={40}
                                        height={40}
                                        className="rounded-full w-10 h-10 object-cover"
                                    />
                                </figure>
                            )}
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={loading || !itemName || !itemId || !listingPrice || !quantity || !dateListed}
                                className="disabled:bg-gray-600 disabled:pointer-events-none bg-houseBlue text-white text-sm py-2 px-4 rounded-md hover:bg-houseHoverBlue transition duration-200"
                            >
                                {successMessage ? successMessage : loading ? "Adding..." : "Add Listing"}
                            </button>
                        </div>
                    </div>
                    <hr />
                    {errorMessage && (
                        <div>
                            <p className="text-red-500 text-sm">{errorMessage}</p>
                        </div>
                    )}
                </form>
            )}


            {/* Modal for uploading the image */}
            {isModalOpen && (
                <ImageUpload
                    title="Upload Listing Image"
                    fileName={fileName}
                    url={imageUrl}
                    setIsModalOpen={setIsModalOpen}
                    setFileName={setFileName}
                    setUrl={setImageUrl}
                    handleUpload={handleImageUpload}
                />
            )}
        </Modal>
    )
}

export default NewEbayListingForm;
