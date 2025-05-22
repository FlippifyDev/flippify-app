"use client";

// Local Imports
import Modal from '../../dom/ui/Modal'
import Input from '../../dom/ui/Input';
import ImageUpload from '../../dom/ui/ImageUpload';
import { shortenText } from '@/utils/format';
import { formatDateToISO } from '@/utils/format-dates';
import { currencySymbols } from '@/config/currency-config';
import { createNewOrderItemAdmin } from '@/services/firebase/create-admin';
import { IListing, IOrder, OrderStatus } from '@/models/store-data';
import { fetchUserInventoryAndOrdersCount } from '@/utils/extract-user-data';
import { inventoryCacheKey, orderCacheKey, subscriptionLimits } from '@/utils/constants';
import { addCacheData, getCachedData, removeCacheData, updateCacheData } from '@/utils/cache-helpers';
import { validateAlphaNumericInput, validateNumberInput, validateTextInput } from '@/utils/input-validation';
import { generateRandomFlippifyOrderId, generateRandomFlippifyTransactionId } from '@/utils/generate-random';

// External Imports
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { MdImageNotSupported } from 'react-icons/md';



interface NewOrderProps {
    fillItem?: IListing;
    setDisplayModal: (value: boolean) => void;
    setTriggerUpdate?: (value: boolean) => void;
}


const NewOrder: React.FC<NewOrderProps> = ({ fillItem, setDisplayModal, setTriggerUpdate }) => {
    const { data: session, update: updateSession } = useSession();
    const currencySymbol = currencySymbols[session?.user.preferences?.currency ?? ""]

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [aboveLimit, setAboveLimit] = useState(false);

    // General Info
    const [itemId, setItemId] = useState<string>("");
    const [itemName, setItemName] = useState<string>("");
    const [fileName, setFileName] = useState("Upload Image");
    const [customTag, setCustomTag] = useState<string>("");
    const [imageUrl, setImageUrl] = useState<string>("");
    const [storeType, setStoreType] = useState<string>("")

    // Listing Info
    const [dateListed, setDateListed] = useState<string>(new Date().toISOString().split('T')[0])
    const [quantity, setQuantity] = useState<string>("1")

    const [listing, setListing] = useState<string>("")
    const [listingDowndownItems, setListingDowndownItems] = useState<IListing[]>([])

    // Purchase Info
    const [datePurchased, setDatePurchased] = useState<string>(new Date().toISOString().split('T')[0])
    const [purchasePlatform, setPurchasePlatform] = useState<string>("")
    const [purchasePrice, setPurchasePrice] = useState<string>("")
    const [purchaseQuantity, setPurchaseQuantity] = useState<number>(0)

    // Sale Info
    const [saleDate, setSaleDate] = useState<string>(new Date().toISOString().split('T')[0])
    const [salePrice, setSalePrice] = useState<string>("")

    // Shipping Info
    const [shippingFees, setShippingFees] = useState<string>("")
    const [shippingCompany, setShippingCompany] = useState<string>("")
    const [shippingStatus, setShippingStatus] = useState<OrderStatus>("Active")

    const [loading, setLoading] = useState<boolean>(false);

    const inventoryCache = `${inventoryCacheKey}-${session?.user?.id}`;
    const cachedListings = getCachedData(inventoryCache) as Record<string, IListing> | null;

    // Messages
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [successMessage, setSuccessMessage] = useState<string>("")

    useEffect(() => {
        const checkLimit = () => {
            const plan = session?.user.authentication?.subscribed;
            if (!plan) {
                setErrorMessage("Please subscribe to a plan to add orders.");
                setAboveLimit(true);
                return;
            }
            const count = fetchUserInventoryAndOrdersCount(session.user);
            if (count.manualOrders >= subscriptionLimits[plan].manual) {
                setErrorMessage(`You have reached the maximum number of manual orders for your plan. Please upgrade your plan to add more or wait till next month.`);
                setAboveLimit(true);
                return;
            }

            setAboveLimit(false);
        };

        if (session?.user) checkLimit();
    }, [session?.user]);

    useEffect(() => {
        if (!fillItem) return;

        handleListingClick(fillItem);
    }, [fillItem])

    async function handleCacheAndSessionUpdate(orderItem: IOrder) {
        if (!orderItem.storeType) return;

        const orderCache = `${orderCacheKey}-${session?.user.id}`;
        const inventoryItem = cachedListings?.[itemId] as IListing;
        const newQuantity = (inventoryItem.quantity ?? 0) - Number(quantity);

        // Step 1: Add the order item to the orders cache
        addCacheData(orderCache, orderItem);

        const currentStore = session!.user.store || {};
        const currentNumOrders = currentStore.numOrders?.manual ?? 0;
        const currentTotalNumOrders = currentStore.numOrders?.manual ?? 0;
        const currentNumListings = currentStore.numListings?.manual ?? 0;
        let decrementListingAmount = 0

        // Step 2: Update the inventory item in the inventory cache 
        if (newQuantity <= 0) {
            removeCacheData(inventoryCache, itemId);
            decrementListingAmount = 1;
        } else {
            updateCacheData(inventoryCache, { ...inventoryItem, quantity: newQuantity });
        }

        await updateSession({
            ...session!,
            user: {
                ...session!.user,
                store: {
                    ...currentStore,
                    numOrders: {
                        ...currentStore.numOrders,
                        manual: currentNumOrders + 1,
                        totalManual: currentTotalNumOrders + 1
                    },
                    numListings: {
                        ...currentStore.numListings,
                        manual: currentNumListings - decrementListingAmount
                    }
                },
            },
        });
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setErrorMessage("");
        setLoading(true);

        if (aboveLimit) return;

        const orderItem: IOrder = {
            additionalFees: 0,
            createdAt: formatDateToISO(new Date()),
            customTag: customTag,
            image: [imageUrl],
            name: itemName,
            itemId: itemId ?? null,
            lastModified: formatDateToISO(new Date()),
            listingDate: formatDateToISO(new Date(dateListed)),
            orderId: generateRandomFlippifyOrderId(20),
            purchase: {
                currency: session?.user.preferences?.currency ?? "USD",
                date: datePurchased ? formatDateToISO(new Date(datePurchased)) : formatDateToISO(new Date(dateListed)),
                platform: purchasePlatform || null,
                price: purchasePrice ? Number(purchasePrice) : null,
                quantity: purchaseQuantity
            },
            recordType: "manual",
            refund: null,
            sale: {
                buyerUsername: "",
                currency: session?.user.preferences?.currency ?? "USD",
                date: formatDateToISO(new Date(saleDate)),
                platform: session?.user.preferences?.locale ?? "US",
                price: Number(salePrice),
                quantity: Number(quantity),
            },
            shipping: {
                fees: shippingFees ? Number(shippingFees) : 0,
                paymentToShipped: undefined,
                service: shippingCompany || undefined,
                timeDays: undefined,
                trackingNumber: undefined,
            },
            status: shippingStatus ?? "Active",
            storeType: storeType,
            transactionId: generateRandomFlippifyTransactionId(20)
        }

        const { success, error, orderExists } = await createNewOrderItemAdmin(session?.user.id ?? "", storeType, orderItem);
        if (!success) {
            console.error("Error creating new order item", error)
            if (orderExists) {
                setErrorMessage(error);
            } else {
                setErrorMessage("Error creating new order item")
            }
        } else {
            await handleCacheAndSessionUpdate(orderItem);
            setSuccessMessage("Order Added!")
        }

        setLoading(false);
        setTriggerUpdate?.(true);
        setDisplayModal(false);
    }

    function handleSearchForListing(value: string) {
        if (!value) {
            setListingDowndownItems([]);
            return;
        }
        const filteredListings = Object.values(cachedListings ?? {})?.filter((listing: IListing) => {
            return listing.itemId?.toLowerCase().includes(value.toLowerCase()) || listing.name?.toLowerCase().includes(value.toLowerCase())
        }) || [];
        setListingDowndownItems(filteredListings);
    }

    function handleListingClick(item: IListing) {
        // General Info
        setItemId(item.itemId ?? "N/A");
        setItemName(item.name ?? "N/A");
        setStoreType(item.storeType ?? "");
        setImageUrl(item.image ? item.image[0] : "");
        setCustomTag(item.customTag || "");

        // Set Listing Info
        setListing(item.itemId ?? "N/A");
        setDateListed(new Date(item.dateListed ?? "").toISOString().split('T')[0]);

        // Set Purchase Info
        setPurchasePrice(item.purchase?.price ? item.purchase.price.toString() : "");
        const purchaseDate = item.purchase?.date || item.dateListed;
        setDatePurchased(new Date(purchaseDate ?? "").toISOString().split('T')[0]);
        setPurchasePlatform(item.purchase?.platform || "");
        setPurchaseQuantity(item.initialQuantity ?? 0)

        // Set Sale Info
        setSalePrice(item.price?.toString() ?? "N/A");
        setSaleDate(new Date().toISOString().split('T')[0]);


        setListingDowndownItems([]);
    }

    function handleChange(value: string, type: string) {
        switch (type) {
            case "listing":
                handleSearchForListing(value);
                setListing(value);
                break;
            case "storeType":
                validateAlphaNumericInput(value.toLowerCase(), setStoreType) // Must be lowercase
                break
            case "saleDate":
                setSaleDate(value);
                break;
            case "itemName":
                validateTextInput(value, setItemName);
                break;
            case "quantity":
                validateNumberInput(value, setQuantity);
                break;
            case "salePrice":
                validateNumberInput(value, setSalePrice);
                break;
            case "shippingFees":
                validateNumberInput(value, setShippingFees);
                break;
            case "shippingCompany":
                validateTextInput(value, setShippingCompany);
                break;
            default:
                break;
        }
    }

    async function handleImageUpload(url?: string | null) {
        const finalUrl = url || imageUrl;
        if (finalUrl) {
            setImageUrl(finalUrl);
        }
    }

    return (
        <Modal title="Add a new order" className="relative max-w-[21rem] sm:max-w-xl flex-grow" setDisplayModal={setDisplayModal}>
            {aboveLimit && (
                <div className="text-center">
                    <span>Sorry you&apos;ve reach your max manual orders for this month</span>
                </div>
            )}

            {!aboveLimit && (
                <form className="w-full max-w-xl flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className='relative flex flex-col sm:flex-row items-center w-full gap-4'>
                        <Input type="text" placeholder='Enter listing (id or name)' title="Listing (Optional)" value={listing} onChange={(e) => handleChange(e.target.value, "listing")} />
                        <Input type="text" placeholder="Enter marketplace" title="Marketplace" value={storeType} onChange={(e) => handleChange(e.target.value, "storeType")} />
                        <SelectRelatedListing listingDowndownItems={listingDowndownItems} currencySymbol={currencySymbol} onClick={handleListingClick} />
                    </div>
                    <div className="flex flex-col sm:flex-row items-center w-full gap-4">
                        <Input type="text" placeholder="Enter item name" title="Product Name" value={itemName} onChange={(e) => handleChange(e.target.value, "itemName")} />
                        <Input type="text" placeholder="Enter quantity" title="Quantity" value={quantity} onChange={(e) => handleChange(e.target.value, "quantity")} />
                    </div>
                    <div className="flex flex-col sm:flex-row items-center w-full gap-4">
                        <Input type="text" placeholder="Enter sale price" title={`Sale Price (${currencySymbol})`} value={salePrice} onChange={(e) => handleChange(e.target.value, "salePrice")} />
                        <Input type="date" placeholder="Enter sale date" title="Sale Date" className="w-full" value={saleDate} onChange={(e) => handleChange(e.target.value, "saleDate")} />
                    </div>
                    {/* Radio Buttons which select shipping status */}
                    <ShippingStatusRadioButtons shippingStatus={shippingStatus} setShippingStatus={setShippingStatus} />

                    {(shippingStatus === "InProcess" || shippingStatus === "Completed") && (
                        <div className="flex flex-col sm:flex-row items-center w-full gap-4">
                            <Input type="text" placeholder="Enter shipping fees" title="Shipping Fees" value={shippingFees} onChange={(e) => handleChange(e.target.value, "shippingFees")} />
                            <Input type="text" placeholder="Enter shipping company" title="Shipping Company" className="w-full" value={shippingCompany} onChange={(e) => handleChange(e.target.value, "shippingCompany")} />
                        </div>
                    )}

                    <hr />
                    <div className="w-full flex flex-row gap-4 justify-between items-center">
                        <div className='flex flex-row gap-2'>
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
                                disabled={loading || !saleDate || !salePrice || !quantity || !itemName || !storeType}
                                className="disabled:bg-muted disabled:pointer-events-none bg-houseBlue text-white text-sm py-2 px-4 rounded-md hover:bg-houseHoverBlue transition duration-200"
                            >
                                {successMessage ? successMessage : loading ? "Adding..." : "Add Sale"}
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
                    title="Upload Order Image"
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


interface ShippingStatusRadioButtonsProps {
    shippingStatus: OrderStatus | null,
    setShippingStatus: (status: OrderStatus) => void
}

const ShippingStatusRadioButtons: React.FC<ShippingStatusRadioButtonsProps> = ({ shippingStatus, setShippingStatus }) => {
    return (
        <div className='flex flex-row items-center w-full'>
            <label className="flex items-center p-2 gap-2 border rounded-l-md w-full">
                <input
                    type="radio"
                    name="shippingStatus"
                    value="Active"
                    checked={shippingStatus === "Active"}
                    className='radio radio-xs'
                    onChange={(e) => setShippingStatus("Active")}
                />
                Not fulfilled
            </label>
            <label className="flex items-center p-2 gap-2 border-y w-full">
                <input
                    type="radio"
                    name="shippingStatus"
                    value="Shipped"
                    checked={shippingStatus === "InProcess"}
                    className='radio radio-xs'
                    onChange={(e) => setShippingStatus("InProcess")}
                />
                Shipped
            </label>
            <label className="flex items-center p-2 gap-2 border rounded-r w-full">
                <input
                    type="radio"
                    name="shippingStatus"
                    value="Completed"
                    checked={shippingStatus === "Completed"}
                    className='radio radio-xs'
                    onChange={(e) => setShippingStatus("Completed")}
                />
                Completed
            </label>
        </div>
    )
}


interface SelectRelatedListingProps {
    listingDowndownItems: IListing[],
    currencySymbol: string,
    onClick: (item: IListing) => void
}


const SelectRelatedListing: React.FC<SelectRelatedListingProps> = ({ listingDowndownItems, currencySymbol, onClick }) => {
    return (
        listingDowndownItems.length > 0 && (
            <div className='absolute left-0 top-full mt-1 w-full bg-white shadow-md rounded-lg flex flex-col max-h-48 overflow-y-auto'>
                {listingDowndownItems.map((item: IListing) => (
                    <div key={item.itemId} onClick={() => { onClick(item) }} className='flex flex-row items-center justify-between gap-2 hover:bg-gray-100 p-4 rounded-lg select-none cursor-pointer'>
                        <div className='flex flex-row items-center gap-2'>
                            <figure className="border-[3px] rounded-full">
                                <Image
                                    src={item.image ? item.image[0] : ""}
                                    alt={item.name ?? "N/A"}
                                    className='h-9 w-9 object-cover rounded-full'
                                    width={50}
                                    height={50}
                                />
                            </figure>
                            <div className='flex flex-col'>
                                <span className='text-sm font-semibold'>{shortenText(item.name ?? "N/A")}</span>
                                <span className='text-xs text-gray-500'>{item.itemId}</span>
                            </div>
                        </div>
                        <div className='flex justify-end items-center'>
                            <span className='font-semibold'>{currencySymbol}{item.price}</span>
                        </div>
                    </div>
                ))}
            </div>
        )
    )
}

export default NewOrder;
