"use client"


// Local Imports
import Modal from "../../dom/ui/Modal"
import Input from "../../dom/ui/Input"
import ImageUpload from "../../dom/ui/ImageUpload"
import { updateItem } from "@/services/firebase/update"
import { inventoryCol } from "@/services/firebase/constants"
import { formatDateToISO } from "@/utils/format-dates"
import { retrieveIdToken } from "@/services/firebase/retrieve"
import { updateMovedItem } from "@/services/firebase/admin-update"
import { inventoryCacheKey } from "@/utils/constants"
import { Condition, IListing } from "@/models/store-data"
import { updateCacheData } from "@/utils/cache-helpers"
import { validateAlphaNumericInput, validateIntegerInput, validatePriceInput, validateSafeInput } from "@/utils/input-validation"

// External Imports
import { FormEvent, useEffect, useState } from "react"
import { MdImageNotSupported } from "react-icons/md"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Button from "../../dom/ui/Button"



interface EditListingProps {
    fillItem: IListing;
    setDisplayModal: (value: boolean) => void;
    setTriggerUpdate: (value: boolean) => void;
}


const EditListing: React.FC<EditListingProps> = ({ fillItem, setDisplayModal, setTriggerUpdate }) => {
    const { data: session } = useSession();
    const uid = session?.user.id as string;
    const cacheKey = `${inventoryCacheKey}-${session?.user.id}`;

    // General Info
    const [itemId, setItemId] = useState<string>("")
    const [itemName, setItemName] = useState<string>("")
    const [imageUrl, setImageUrl] = useState<string>("");
    const [customTag, setCustomTag] = useState<string>("");
    const [storeOldType, setStoreOldType] = useState<string>("");
    const [storeType, setStoreType] = useState<string>("");
    const [condition, setCondition] = useState<Condition>("")
    const [storageLocation, setStorageLocation] = useState<string>("")

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
        updateCacheData(cacheKey, { [inventoryItem.itemId as string]: inventoryItem });
    }

    function handleListingClick(item: IListing) {
        // General Info
        setItemId(item.itemId ?? "N/A");
        setItemName(item.name ?? "N/A");
        setImageUrl(item.image ? item.image[0] : "");
        setCustomTag(item.customTag || "");
        setStoreType(item.storeType || "");
        setStoreOldType(item.storeType || "");
        setStorageLocation(item.storageLocation || "");
        setCondition(item.condition || "");

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
            condition: condition,
            currency: session?.user.preferences?.currency ?? "USD",
            customTag: customTag,
            extra: fillItem.extra ?? {},
            dateListed: formatDateToISO(new Date(dateListed), true),
            image: [imageUrl],
            initialQuantity: Number(quantity),
            itemId: itemId,
            name: itemName,
            price: Number(listingPrice),
            purchase: {
                date: datePurchased ? formatDateToISO(new Date(datePurchased), true) : formatDateToISO(new Date(dateListed), true),
                platform: purchasePlatform || null,
                price: purchasePrice ? Number(purchasePrice) : null,
            },
            quantity: Number(quantity),
            recordType: "manual",
            lastModified: formatDateToISO(new Date()),
            storeType: storeType,
            storageLocation: storageLocation
        }

        try {
            if (inventoryItem.storeType !== storeOldType) {
                const idToken = await retrieveIdToken();
                if (!idToken) return;
                await updateMovedItem({ idToken, rootCol: inventoryCol, oldStoreType: storeOldType, item: inventoryItem })
                handleCacheUpdate(inventoryItem);
            } else {
                await updateItem({ uid, item: inventoryItem, rootCol: inventoryCol, subCol: inventoryItem.storeType, cacheKey: inventoryCacheKey })
            }
            setSuccessMessage("Listing Edited!");
        } catch (error) {
            setErrorMessage("Error editing item")
        }

        setTriggerUpdate(true);
        setLoading(false);
        setDisplayModal(false);
    }

    function handleChange(value: string, type: string, setFunction: (value: any) => void) {
        switch (type) {
            case "customTag":
            case "itemName":
            case "purchasePlatform":
            case "customTag":
            case "storageLocation":
            case "condition":
                validateSafeInput(value, setFunction)
                break
            case "storeType":
                validateAlphaNumericInput(value.toLowerCase(), setFunction) // Must be lowercase
                break
            case "dateListed":
            case "datePurchased":
                setFunction(value)
                break
            case "listingPrice":
            case "purchasePrice":
                validatePriceInput(value, setFunction)
                break
            case "quantity":
                validateIntegerInput(value, setFunction)
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
                    <Input type="text" placeholder="Enter item id" title="Product ID" value={itemId} readOnly />
                    <Input type="text" placeholder="Enter marketplace" title="Marketplace" value={storeType} onChange={(e) => handleChange(e.target.value, "storeType", setStoreType)} />
                </div>
                <div className="flex flex-col sm:flex-row items-center w-full gap-4">
                    <Input type="text" placeholder="Enter item name" title="Product Name" value={itemName} onChange={(e) => handleChange(e.target.value, "itemName", setItemName)} />
                    <Input type="text" placeholder="Enter quantity" title="Quantity" value={quantity} onChange={(e) => handleChange(e.target.value, "quantity", setQuantity)} />
                </div>
                <div className="flex flex-col sm:flex-row items-center w-full gap-4">
                    <Input type="text" placeholder="Enter listing price" title="Listing Price / unit" value={listingPrice} onChange={(e) => handleChange(e.target.value, "listingPrice", setListingPrice)} />
                    <Input type="text" placeholder="Enter purchase price" title="Purchase Price / unit (Optional)" value={purchasePrice} onChange={(e) => handleChange(e.target.value, "purchasePrice", setPurchasePrice)} />
                </div>
                <div className="flex flex-col sm:flex-row items-center w-full gap-4">
                    <Input type="text" placeholder="Enter purchase platform" title="Purchase Platform (Optional)" value={purchasePlatform} onChange={(e) => handleChange(e.target.value, "purchasePlatform", setPurchasePlatform)} />
                    <Input type="text" placeholder="Enter custom tag" title="Custom Tag (Optional)" value={customTag} onChange={(e) => handleChange(e.target.value, "customTag", setCustomTag)} />
                </div>
                <div className="flex flex-col sm:flex-row items-center w-full gap-4">
                    <Input type="text" placeholder="Enter storage location" title="Storage Location (Optional)" value={storageLocation} onChange={(e) => handleChange(e.target.value, "storageLocation", setStorageLocation)} />
                    <Input type="text" placeholder="Enter condition" title="Condition (Optional)" value={condition} onChange={(e) => handleChange(e.target.value, "condition", setCondition)} />
                </div>
                <div className="flex flex-col sm:flex-row items-center w-full gap-4">
                    <Input type="date" placeholder="Enter listing date" title="Listing Date" className="w-full" value={dateListed} onChange={(e) => handleChange(e.target.value, "dateListed", setDateListed)} />
                    <Input type="date" placeholder="Enter purchase date" title="Purchase Date" className="w-full" value={datePurchased} onChange={(e) => handleChange(e.target.value, "datePurchased", setDatePurchased)} />
                </div>
                <hr />
                <div className="w-full flex flex-row gap-4 justify-between items-center">
                    <div className="flex flex-row gap-2">
                        {imageUrl && (
                            <figure className="cursor-pointer hover:scale-105 transition duration-100 border-[3px] rounded-full" onClick={() => setIsModalOpen(true)}>
                                <Image
                                    src={imageUrl}
                                    alt="Uploaded Image"
                                    width={40}
                                    height={40}
                                    className="rounded-full w-10 h-10 object-cover"
                                />
                            </figure>
                        )}
                        {!imageUrl && (
                            <div className='cursor-pointer hover:scale-105 transition duration-100 border-[3px] w-10 h-10 rounded-full flex justify-center items-center' onClick={() => setIsModalOpen(true)}>
                                <MdImageNotSupported className='text-gray-200' />
                            </div>
                        )}
                    </div>
                    <div>
                        <Button
                            type="submit"
                            text={successMessage ? successMessage : loading ? "Updating..." : "Edit Listing"}
                            disabled={loading || !itemName || !itemId || !listingPrice || !quantity || !dateListed}
                        />
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
