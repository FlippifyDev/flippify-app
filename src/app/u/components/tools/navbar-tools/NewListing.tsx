"use client"


// Local Imports
import Modal from "../../dom/ui/Modal"
import Input from "../../dom/ui/Input"
import ImageUpload from "../../dom/ui/ImageUpload"
import { createItem } from "@/services/firebase/admin-create"
import { addCacheData } from "@/utils/cache-helpers"
import { inventoryCol } from "@/services/firebase/constants"
import { formatDateToISO } from "@/utils/format-dates"
import { retrieveIdToken } from "@/services/firebase/retrieve"
import { MdImageNotSupported } from "react-icons/md"
import { Condition, IListing, StoreType } from "@/models/store-data"
import { generateRandomFlippifyListingId } from "@/utils/generate-random"
import { fetchUserInventoryAndOrdersCount } from "@/utils/extract-user-data"
import { inventoryCacheKey, subscriptionLimits } from "@/utils/constants"
import { validateAlphaNumericInput, validateIntegerInput, validatePriceInput, validateSafeInput } from "@/utils/input-validation"

// External Imports
import { FormEvent, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Button from "../../dom/ui/Button"



interface NewListingProps {
    setDisplayModal: (value: boolean) => void;
    setTriggerUpdate?: (value: boolean) => void;
}


const NewListing: React.FC<NewListingProps> = ({ setDisplayModal, setTriggerUpdate }) => {
    const { data: session, update: updateSession } = useSession();

    // General Info
    const [itemId, setItemId] = useState<string>(generateRandomFlippifyListingId(20))
    const [itemName, setItemName] = useState<string>("");
    const [imageUrl, setImageUrl] = useState<string>("");
    const [customTag, setCustomTag] = useState<string>("");
    const [storeType, setStoreType] = useState<string>("");
    const [condition, setCondition] = useState<Condition>("");
    const [storageLocation, setStorageLocation] = useState<string>("");

    // Purchase Info
    const [purchasePrice, setPurchasePrice] = useState<string>("");
    const [purchasePlatform, setPurchasePlatform] = useState<string>("");
    const [datePurchased, setDatePurchased] = useState<string>(new Date().toISOString().split('T')[0]);

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
            if (plan === "free" && count.manualListings >= subscriptionLimits[plan].manual) {
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
        addCacheData(cacheKey, { [inventoryItem.itemId as string]: inventoryItem });

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
            condition: condition,
            customTag: customTag,
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

        const idToken = await retrieveIdToken();
        if (!idToken) return;
        const { success, error } = await createItem({ idToken, item: inventoryItem, rootCol: inventoryCol, subCol: inventoryItem.storeType as StoreType })

        if (!success) {
            console.error("Error creating new inventory item", error)
            setErrorMessage(error)
        } else {
            await handleCacheUpdate(inventoryItem);
            setSuccessMessage("Listing Added!");
        }

        setLoading(false);
        setTriggerUpdate?.(true);
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
                        <Input type="text" placeholder="Enter item id" title="Product ID" value={itemId} readOnly />
                        <Input type="text" placeholder="Enter marketplace" title="Marketplace" value={storeType} onChange={(e) => handleChange(e.target.value, "storeType", setStoreType)} />
                    </div>
                    <div className="flex flex-col sm:flex-row items-center w-full gap-4">
                        <Input type="text" placeholder="Enter item name" title="Product Name" value={itemName} onChange={(e) => handleChange(e.target.value, "itemName", setItemName)} />
                        <Input type="text" placeholder="Enter quantity" title="Quantity" value={quantity} onChange={(e) => handleChange(e.target.value, "quantity", setQuantity)} />
                    </div>
                    <div className="flex flex-col sm:flex-row items-center w-full gap-4">
                        <Input type="text" placeholder="Enter listing price" title="Listing Price / unit" value={listingPrice} onChange={(e) => handleChange(e.target.value, "listingPrice", setListingPrice)} />
                        <Input type="text" placeholder="Enter purchase price" title="Purchase Price  / unit (Optional)" value={purchasePrice} onChange={(e) => handleChange(e.target.value, "purchasePrice", setPurchasePrice)} />
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
                                text={successMessage ? successMessage : loading ? "Adding..." : "Add Listing"}
                                disabled={loading || !itemName || !itemId || !listingPrice || !quantity || !dateListed || !storeType}
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
