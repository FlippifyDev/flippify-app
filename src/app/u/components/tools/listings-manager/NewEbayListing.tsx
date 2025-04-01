"use client"


// Local Imports
import Modal from "../../dom/ui/Modal"
import Input from "../../dom/ui/Input"
import ImageUpload from "../../dom/ui/ImageUpload"
import { addCacheData } from "@/utils/cache-helpers"
import { formatDateToISO } from "@/utils/format-dates"
import { IEbayInventoryItem } from "@/models/store-data"
import { createNewInventoryItem } from "@/services/firebase/create-admin"
import { ebayInventoryCacheKey, storePlatforms } from "@/utils/constants"
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

    const [customTag, setCustomTag] = useState<string>("")
    const [dateListed, setDateListed] = useState<string>(new Date().toISOString().split('T')[0])
    const [datePurchased, setDatePurchased] = useState<string>(new Date().toISOString().split('T')[0])
    const [imageUrl, setImageUrl] = useState<string>("");
    const [itemId, setItemId] = useState<string>("")
    const [itemName, setItemName] = useState<string>("")
    const [listingPrice, setListingPrice] = useState<string>("")
    const [purchasePlatform, setPurchasePlatform] = useState<string>("")
    const [purchasePrice, setPurchasePrice] = useState<string>("")
    const [quantity, setQuantity] = useState<string>("1")
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [fileName, setFileName] = useState("Upload Image");

    // Messages
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [successMessage, setSuccessMessage] = useState<string>("")

    const [loading, setLoading] = useState<boolean>(false)

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true);
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

        const { success } = await createNewInventoryItem(session?.user.id ?? "", storePlatforms.ebay, inventoryItem);

        if (!success) {
            console.error("Error creating new inventory item")
            setErrorMessage("Error creating new inventory item")
            return
        }

        // Update the cache with the new item
        const cacheKey = `${ebayInventoryCacheKey}-${session?.user.id}`;
        addCacheData(cacheKey, inventoryItem);
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
        <Modal className="max-w-xl flex-grow" setDisplayModal={setDisplayModal}>
            <form className="w-full max-w-xl flex flex-col gap-4" onSubmit={handleSubmit}>
                <Input type="text" placeholder="Enter item id" title="Product ID" value={itemId} onChange={(e) => handleChange(e.target.value, "itemId")} />
                <div className="w-full flex flex-col sm:flex-row gap-4">
                    <button
                        type="button"
                        className="bg-houseBlue text-white text-sm py-2 px-4 rounded-md hover:bg-houseHoverBlue transition duration-200"
                        onClick={() => setIsModalOpen(true)}>
                        {fileName}
                    </button>
                    {imageUrl && (
                        <figure>
                            <Image
                                src={imageUrl}
                                alt="Uploaded Image"
                                width={40}
                                height={40}
                                className="rounded-md"
                            />
                        </figure>
                    )}
                </div>
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

                <div className="flex flex-col sm:flex-row items-center w-full gap-4 justify-end mt-2">
                    <button
                        type="button"
                        onClick={() => setDisplayModal(false)}
                        className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-houseBlue text-white py-2 px-4 rounded-md hover:bg-houseHoverBlue transition duration-200"
                    >
                        {successMessage ? successMessage : loading ? "Adding..." : "Add Listing"}
                    </button>
                </div>
            </form>

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
