"use client"


// Local Imports
import Modal from "../../dom/ui/Modal"
import Input from "../../dom/ui/Input"
import ImageUpload from "../../dom/ui/ImageUpload"
import { addCacheData } from "@/utils/cache-helpers"
import { formatDateToISO } from "@/utils/format-dates"
import { IListing } from "@/models/store-data"
import { createNewInventoryItemAdmin } from "@/services/firebase/create-admin"
import { generateRandomFlippifyListingId } from "@/utils/generate-random"
import { fetchUserInventoryAndOrdersCount } from "@/utils/extract-user-data"
import { inventoryCacheKey, subscriptionLimits } from "@/utils/constants"
import { validateAlphaNumericInput, validateIntegerInput, validatePriceInput } from "@/utils/input-validation"

// External Imports
import { FormEvent, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { MdImageNotSupported } from "react-icons/md"


interface NewListingProps {
    setDisplayModal: (value: boolean) => void;
    setTriggerUpdate?: (value: boolean) => void;
}


const NewListing: React.FC<NewListingProps> = ({ setDisplayModal, setTriggerUpdate }) => {
    const { data: session, update: updateSession } = useSession();

    // General Info
    const [itemId, setItemId] = useState<string>(generateRandomFlippifyListingId(20))
    const [itemName, setItemName] = useState<string>("")
    const [imageUrl, setImageUrl] = useState<string>("");
    const [customTag, setCustomTag] = useState<string>("")
    const [storeType, setStoreType] = useState<string>("")

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
    const [aboveLimit, setAboveLimit] = useState<boolean>(false);

    useEffect(() => {
        const checkLimit = () => {
            const plan = session?.user.authentication?.subscribed;
            if (!plan) {
                setErrorMessage("Please subscribe to a plan to add orders.");
                setAboveLimit(true);
                return;
            }
            const count = fetchUserInventoryAndOrdersCount(session.user);
            if (count.manualListings >= subscriptionLimits[plan].manual) {
                setErrorMessage(`You have reached the maximum number of manual listings for your plan. Please upgrade your plan to add more or wait till next month.`);
                setAboveLimit(true);
                return;
            }

            setAboveLimit(false);
        };

        if (session?.user) checkLimit();
    }, [session?.user]);


    async function handleCacheUpdate(inventoryItem: IListing) {
        if (!inventoryItem.storeType) return;

        const cacheKey = `${inventoryCacheKey}-${session?.user.id}`;

        // Update the cache with the new item
        addCacheData(cacheKey, inventoryItem);

        const currentStore = session!.user.store || {};
        const currentNumListings = currentStore.numListings?.manual ?? 0;

        await updateSession({
            ...session!,
            user: {
                ...session!.user,
                store: {
                    ...session!.user.store,
                    ...currentStore,
                    numListings: {
                        ...currentStore.numListings,
                        manual: currentNumListings + 1
                    }
                },
            },
        });
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setErrorMessage("")
        setLoading(true);

        if (aboveLimit) return;

        const inventoryItem: IListing = {
            createdAt: formatDateToISO(new Date()),
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

        const { success, error, listingExists } = await createNewInventoryItemAdmin(session?.user.id ?? "", storeType, inventoryItem);
        if (!success) {
            console.error("Error creating new inventory item", error)
            if (listingExists) {
                setErrorMessage(error)
            } else {
                setErrorMessage(`Error creating new inventory item`)
            }
        } else {
            await handleCacheUpdate(inventoryItem);
            setSuccessMessage("Listing Added!");
        }

        setLoading(false);
        setTriggerUpdate?.(true);
        setDisplayModal(false);
    }

    function handleChange(value: string, type: string) {
        switch (type) {
            case "customTag":
                validateAlphaNumericInput(value, setCustomTag)
                break
            case "storeType":
                validateAlphaNumericInput(value.toLowerCase(), setStoreType) // Must be lowercase
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
        }
    }

    async function handleImageUpload(url?: string | null) {
        const finalUrl = imageUrl || url;
        if (finalUrl) {
            setImageUrl(finalUrl);
        }
    }

    return (
        <Modal title="Add a new listing" className="max-w-[21rem] sm:max-w-xl flex-grow" setDisplayModal={setDisplayModal}>
            {aboveLimit && (
                <div className="text-center">
                    <span>Sorry you&apos;ve reach your max manual listings for this month</span>
                </div>
            )}

            {!aboveLimit && (
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
                            <button
                                type="submit"
                                disabled={loading || !itemName || !itemId || !listingPrice || !quantity || !dateListed || !storeType}
                                className="disabled:bg-muted disabled:pointer-events-none bg-houseBlue text-white text-sm py-2 px-4 rounded-md hover:bg-houseHoverBlue transition duration-200"
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

export default NewListing;
