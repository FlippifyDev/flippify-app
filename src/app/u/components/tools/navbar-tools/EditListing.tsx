"use client"


// Local Imports
import Modal from "../../dom/ui/Modal"
import Input from "../../dom/ui/Input"
import ImageUpload from "../../dom/ui/ImageUpload"
import { addCacheData } from "@/utils/cache-helpers"
import { formatDateToISO } from "@/utils/format-dates"
import { IListing } from "@/models/store-data"
import { inventoryCacheKey } from "@/utils/constants"
import { validateAlphaNumericInput, validateIntegerInput, validatePriceInput } from "@/utils/input-validation"

// External Imports
import { FormEvent, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { updateListing } from "@/services/firebase/update"


interface EditListingProps {
    fillItem: IListing;
    setDisplayModal: (value: boolean) => void;
}


const EditListing: React.FC<EditListingProps> = ({ fillItem, setDisplayModal }) => {
    const { data: session } = useSession();

    // General Info
    const [itemId, setItemId] = useState<string>("")
    const [itemName, setItemName] = useState<string>("")
    const [imageUrl, setImageUrl] = useState<string>("");
    const [customTag, setCustomTag] = useState<string>("");
    const [storeType, setStoreType] = useState<string>("");

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

    useEffect(() => {
        if (!fillItem) return;

        handleListingClick(fillItem);
    }, [fillItem])

    function handleCacheUpdate(inventoryItem: IListing) {
        const cacheKey = `${inventoryCacheKey}-${session?.user.id}`;

        // Update the cache with the new item
        addCacheData(cacheKey, inventoryItem);
    }

    function handleListingClick(item: IListing) {
        // General Info
        setItemId(item.itemId ?? "N/A");
        setItemName(item.name ?? "N/A");
        setImageUrl(item.image ? item.image[0] : "");
        setCustomTag(item.customTag || "");
        setStoreType(item.storeType || "")

        // Set Listing Info
        setDateListed(new Date(item.dateListed ?? "").toISOString().split('T')[0]);
        setListingPrice(item.price?.toString() ?? "N/A")

        // Set Purchase Info
        setPurchasePrice(item.purchase?.price ? item.purchase.price.toString() : "");
        const purchaseDate = item.purchase?.date || item.dateListed;
        setDatePurchased(new Date(purchaseDate ?? "").toISOString().split('T')[0]);
        setPurchasePlatform(item.purchase?.platform || "");
        setQuantity(item.quantity?.toString() ?? "N/A")
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setErrorMessage("")
        setLoading(true);

        const inventoryItem: IListing = {
            currency: session?.user.preferences?.currency ?? "USD",
            customTag: customTag,
            dateListed: formatDateToISO(new Date(dateListed)),
            image: [imageUrl],
            initialQuantity: Number(quantity),
            itemId: itemId,
            name: itemName,
            price: Number(listingPrice),
            purchase: {
                date: datePurchased ? formatDateToISO(new Date(datePurchased)) : formatDateToISO(new Date(dateListed)),
                platform: purchasePlatform || null,
                price: purchasePrice ? Number(purchasePrice) : null,
            },
            quantity: Number(quantity),
            recordType: "manual",
            lastModified: formatDateToISO(new Date()),
            storeType: storeType
        }

        const { success, error } = await updateListing(session?.user.id ?? "", inventoryItem, storeType);
        if (!success) {
            setErrorMessage(`Error editing item`)
        } else {
            handleCacheUpdate(inventoryItem);
            setSuccessMessage("Listing Edited!");
        }

        setLoading(false);
    }

    function handleChange(value: string, type: string) {
        switch (type) {
            case "customTag":
                validateAlphaNumericInput(value, setCustomTag)
                break
            case "dateListed":
                setDateListed(value)
                break
            case "datePurchased":
                setDatePurchased(value)
                break
            case "itemName":
                validateAlphaNumericInput(value, setItemName)
                break
            case "listingPrice":
                validatePriceInput(value, setListingPrice)
                break
            case "purchasePlatform":
                validateAlphaNumericInput(value, setPurchasePlatform)
                break
            case "purchasePrice":
                validatePriceInput(value, setPurchasePrice)
                break
            case "quantity":
                validateIntegerInput(value, setQuantity)
                break
            case "storeType":
                validateAlphaNumericInput(value, setStoreType)
                break
        }
    }

    async function handleImageUpload(url?: string | null) {
        const finalUrl = url || imageUrl;
        if (finalUrl) {
            setImageUrl(finalUrl);
        }
    }

    return (
        <Modal title="Edit listing" className="max-w-[21rem] sm:max-w-xl flex-grow" setDisplayModal={setDisplayModal}>
            <form className="w-full max-w-xl flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row items-center w-full gap-4">
                    <Input type="text" placeholder="Enter item id" title="Product ID" value={itemId} onChange={(e) => handleChange(e.target.value, "itemId")} />
                    <Input type="text" placeholder="Enter marketplace" title="Marketplace" value={storeType} onChange={(e) => handleChange(e.target.value, "storeType")} />
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
                    <Input type="date" placeholder="Enter purchase date" title="Purchase Date" className="w-full" value={datePurchased} onChange={(e) => handleChange(e.target.value, "datePurchased")} />
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
                            {successMessage ? successMessage : loading ? "Updating..." : "Edit Listing"}
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

export default EditListing;
