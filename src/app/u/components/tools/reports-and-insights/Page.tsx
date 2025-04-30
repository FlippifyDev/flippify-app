"use client"

// Local Imports
import Card from '../../dom/ui/Card'
import Revenue from './Revenue'
import Expenses from './Expenses'
import Download from './Download'
import { IUser } from '@/models/user'
import { IOrder } from '@/models/store-data'
import InventoryAndCogs from './InventoryAndCogs'
import { formatDateToISO } from '@/utils/format-dates'
import { fetchUserStores } from '@/utils/extract-user-data'
import DateRangeSelector, { TimeRange, generateTimeRanges } from './DateRangeSelector'
import { retrieveOldestOrder, retrieveUserOrders, retrieveUserOrdersInPeriod } from '@/services/firebase/retrieve'

// External Imports
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'



function getLastYearBounds(): [string, string] {
    const now = new Date();
    const lastYear = now.getFullYear();

    // Jan 1st, 00:00:00.000 of last year
    const start = new Date(lastYear, 0, 1, 0, 0, 0, 0);

    // Dec 31st, 23:59:59.999 of last year
    const end = new Date(lastYear, 11, 31, 23, 59, 59, 999);

    return [formatDateToISO(start), formatDateToISO(end)];
}

function missingOrderInfo(items: IOrder[]) {
    let missingOrderInfoCount = 0;
    items.forEach((item) => {
        if (!item.purchase?.price || !item.purchase?.date || !item.purchase?.platform) {
            missingOrderInfoCount++;
        }
    });
    return missingOrderInfoCount;
}


const Page = () => {
    const { data: session } = useSession()
    const currency = session?.user.preferences?.currency || "USD";
    const [timeFrom, timeTo] = getLastYearBounds();

    // build a formatter
    const formatter = new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
    });


    // Date-range state
    const [timeRanges, setTimeRanges] = useState<TimeRange[]>([])
    const [selectedLabel, setSelectedLabel] = useState<string>('')
    const [periodStart, setPeriodStart] = useState<string>(timeFrom)
    const [periodEnd, setPeriodEnd] = useState<string>(timeTo)

    // Data state
    const [sales, setSales] = useState<IOrder[]>()
    const [inventoryBought, setInventoryBought] = useState<IOrder[]>()
    const [loading, setLoading] = useState(true);


    // Missing Info
    const [missingOrderInfoCount, setMissingOrderInfoCount] = useState(0);

    // Initialize time ranges based on oldest order
    useEffect(() => {
        if (!session?.user.id) return

        async function initTimeRanges() {
            const storeTypes = fetchUserStores(session?.user as IUser);

            const oldestOrder = await retrieveOldestOrder({
                uid: session?.user.id ?? "",
                storeTypes
            })
            const firstSaleDate = oldestOrder
                ? new Date(oldestOrder.sale?.date ?? "")
                : new Date()

            const end = new Date(firstSaleDate.getFullYear(), 11, 31, 23, 59, 59, 999);
 
            const ranges = generateTimeRanges(firstSaleDate, end)
            console.log(ranges)
            setTimeRanges(ranges)

            if (ranges.length > 0) {
                // default to the most recent range
                const last = ranges[ranges.length - 1]
                setSelectedLabel(last.label)

                const [startYear, endYear] = last.value.split('-').map(Number)
                setPeriodStart(formatDateToISO(new Date(startYear, 0, 1)))
                setPeriodEnd(formatDateToISO(new Date(endYear, 11, 31, 23, 59, 59, 999)))
            }
        }

        initTimeRanges()
    }, [session?.user])

    useEffect(() => {
        const fetchOrders = async () => {
            if (!session) return;
            setLoading(true);

            const storeTypes = fetchUserStores(session.user);

            const salesResult = await Promise.all(
                storeTypes.map((storeType) => {
                    return retrieveUserOrders({
                        uid: session.user.id as string,
                        timeFrom: periodStart,
                        timeTo: periodEnd,
                        ebayAccessToken: session.user.connectedAccounts?.ebay?.ebayAccessToken ?? "",
                        storeType,
                    }).then((order) => [storeType, order] as const);
                })
            );
            const sales = salesResult[salesResult.length - 1]?.[1] ?? [];


            const inventoryResult = await Promise.all(
                storeTypes.map((storeType) => {
                    return retrieveUserOrdersInPeriod({
                        uid: session.user.id as string,
                        timeFrom: periodStart,
                        timeTo: periodEnd,
                        storeType,
                    }).then((order) => [storeType, order] as const);
                })
            );

            const inventory = inventoryResult[inventoryResult.length - 1]?.[1] ?? [];

            setSales(sales);
            setInventoryBought(inventory)

            setMissingOrderInfoCount(missingOrderInfo(sales))
            setLoading(false);
        };

        if (session?.user.authentication?.subscribed) {
            fetchOrders();
        }
    }, [session, session?.user.id, periodStart, periodEnd, session?.user.connectedAccounts?.ebay?.ebayAccessToken, session?.user.authentication?.subscribed])

    return (
        <div className='flex flex-col md:flex-row gap-4'>
            <Card title='Tax report' className='max-w-xl'>
                <div className='flex flex-col gap-10'>
                    <Revenue sales={sales ?? []} formatter={formatter} />
                    <InventoryAndCogs sales={sales ?? []} formatter={formatter} inventoryBought={inventoryBought ?? []} periodStart={new Date(timeFrom)} periodEnd={new Date(timeTo)} />
                    <Expenses sales={sales ?? []} formatter={formatter} />
                </div>
            </Card>
            <div className="space-y-4">
                <Card title="Options" className='max-w-lg'>
                    <div className='flex flex-row justify-between'>
                        {timeRanges.length > 0 && (
                            <DateRangeSelector
                                value={selectedLabel}
                                onChange={(label, value) => {
                                    setSelectedLabel(label)
                                    const [startYear, endYear] = value.split('-').map(Number)
                                    setPeriodStart(formatDateToISO(new Date(startYear, 0, 1)))
                                    setPeriodEnd(formatDateToISO(new Date(endYear, 11, 31, 23, 59, 59, 999)))
                                }}
                                timeRanges={timeRanges}
                            />
                        )}
                        <Download 
                            orders={sales ?? []}
                            timeFrom={periodStart}
                            timeTo={periodEnd}

                        />
                    </div>
                </Card>
                {(missingOrderInfoCount > 0) && (
                    <Card title="Missing Info" className='max-w-lg'>
                        <span className='font-semibold'>{missingOrderInfoCount} sold products</span> are missing a purchase date, pricing, or shipping cost.

                    </Card>
                )}
                <Card title="Disclaimer" className='max-w-lg'>
                    The Tax Report in Flippify lets you neatly compile your buying, selling, and inventory data to streamline year-end tax prep. Please note that Flippify is not a substitute for professional tax software or advice. Always consult a qualified CPA or tax professional to confirm your filings are accurate and compliant.
                </Card>
            </div>
        </div>
    )
}

export default Page
