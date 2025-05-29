import { IListing, IOrder } from "@/models/store-data";
import { filterOrdersByDateRange } from "./filters";
import { IOneTimeExpense } from "@/models/expenses";

// Helper function to format dates to readable format
export const formatDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString(); // Formats date as YYYY/MM/DD
};

function escapeCSVField(value: any): string {
    if (value == null) return '""';
    const str = String(value);
    // double any existing quotes, then wrap the whole thing in quotes
    return `"${str.replace(/"/g, '""')}"`;
}

// Function to format orders for CSV export
function formatOrdersForCSVExport(orders: IOrder[], timeFrom: string, timeTo: string): string | null {
    // Create the CSV header with new columns for Profit and ROI
    const csvHeader = [
        "Transaction ID",
        "Order ID",
        "Item Name",
        "Purchase Platform",
        "Purchase Price",
        "Purchase Quantity",
        "Sale Price",
        "Sale Quantity",
        "Sale Platform",
        "Shipping Fees",
        "Shipping Time (Days)",
        "Tracking Number",
        "Listing Date",
        "Sale Date",
        "Status",
        "Custom Tag",
        "Profit",
        "ROI (%)"
    ];

    // Filter orders based on the time range
    const filteredOrders = filterOrdersByDateRange(orders, timeFrom, timeTo);
    if (filteredOrders.length === 0) {
        return null; // Return null if no orders found in the given time range
    }

    // Map each order to CSV row
    const csvRows = filteredOrders.map(order => {
        const {
            transactionId,
            orderId,
            name,
            storeType,
            purchase,
            sale,
            shipping,
            listingDate,
            status,
            customTag
        } = order;
        
        const salePrice = sale?.price ?? "N/A";
        const purchasePrice = purchase?.price ?? "N/A";
        const shippingFees = shipping?.fees ?? 0;

        // Calculate Profit
        let profit: number | "N/A" = "N/A";
        if (salePrice !== "N/A" && purchasePrice !== "N/A") {
            profit = salePrice - purchasePrice - shippingFees
        }

        // Calculate ROI (Return on Investment)
        let totalCost: number | "N/A" = "N/A";
        let roi: string | "N/A" = "N/A";

        if (profit !== "N/A" && purchasePrice !== "N/A") {
            totalCost = purchasePrice + shippingFees;
            roi = ((profit / totalCost) * 100).toFixed(2)
        }

        return [
            `"\'${transactionId}"`,
            `"\'${orderId}"`,
            escapeCSVField(name ?? "N/A"),
            escapeCSVField(purchase?.platform ?? "N/A"),
            purchasePrice, 
            purchase?.quantity ?? "N/A",
            sale?.price ? sale.price.toFixed(2) : "N/A",
            sale?.quantity ? sale.quantity : "N/A",
            escapeCSVField(sale?.platform ?? "N/A"),
            shipping?.fees ? shipping.fees : "N/A",
            shipping?.timeDays ? shipping.timeDays : "N/A", 
            shipping?.trackingNumber ? shipping.trackingNumber : "N/A",
            listingDate ? formatDate(listingDate): "N/A",
            sale?.date ? formatDate(sale.date): "N/A",   
            status,
            customTag ?? "N/A",  
            profit,
            roi  
        ].join(","); // Join fields with a comma to create a CSV row
    });

    // Join header and rows together to create CSV content
    const csvContent = [
        csvHeader.join(","), // Header row
        ...csvRows  // Data rows
    ].join("\n"); // Join rows with newline character

    return csvContent;
}


// —— 1) SALES ——
export function formatSalesForCSVExport(
    orders: IOrder[],
    timeFrom: string,
    timeTo: string
): string | null {
    const header = [
        "Sale Date",
        "Transaction ID",
        "Order ID",
        "Item Name",
        "Marketplace",
        "Sale Price",
        "Quantity",
        "Shipping Fees",
        "Buyer",
        "Currency",
    ];
    const filtered = filterOrdersByDateRange(orders, timeFrom, timeTo)
        .filter(o => o.sale && o.status === "Completed");

    if (!filtered.length) return null;

    const rows = filtered.map(o => [
        o.sale!.date ? formatDate(o.sale!.date) : "N/A",
        `"\'${o.transactionId}"`,
        `"\'${o.orderId}"`,
        escapeCSVField(o.name ?? "N/A"),
        escapeCSVField(o.storeType ?? "N/A"),
        o.sale!.price?.toFixed(2) ?? "N/A",
        o.sale!.quantity?.toString() ?? "N/A",
        o.shipping?.fees?.toFixed(2) ?? "0.00",
        o.sale!.buyerUsername ?? "N/A",
        o.sale!.currency ?? "N/A",
    ].join(","));

    return [header.join(","), ...rows].join("\n");
}

// —— 2) COGS ——
export function formatCOGSForCSVExport(
    orders: IOrder[],
    timeFrom: string,
    timeTo: string
): string | null {
    const header = [
        "Purchase Date",
        "Transaction ID",
        "Order ID",
        "Item Name",
        "Marketplace",
        "Purchase Price",
        "Quantity",
        "Currency",
    ];
    const filtered = filterOrdersByDateRange(orders, timeFrom, timeTo)
        .filter(o => o.purchase && o.sale && o.status === "Completed");

    if (!filtered.length) return null;

    const rows = filtered.map(o => [
        o.purchase!.date ? formatDate(o.purchase!.date) : "N/A",
        `"\'${o.transactionId}"`,
        `"\'${o.orderId}"`,
        escapeCSVField(o.name ?? "N/A"),
        escapeCSVField(o.storeType ?? "N/A"),
        o.purchase!.price?.toFixed(2) ?? "N/A",
        o.purchase!.quantity?.toString() ?? "N/A",
        o.purchase!.currency ?? "N/A",
    ].join(","));

    return [header.join(","), ...rows].join("\n");
}

// —— 3) INVENTORY ON HAND ——
/** Utility to filter listings by their `dateListed` */
function filterListingsByDateRange(
    listings: IListing[],
    timeFrom: string,
    timeTo: string
): IListing[] {
    const from = new Date(timeFrom).getTime();
    const to = new Date(timeTo).getTime();
    return listings.filter(l => {
        const d = l.dateListed ? new Date(l.dateListed).getTime() : NaN;
        return !isNaN(d) && d >= from && d <= to;
    });
}

export function formatInventoryForCSVExport(
    listings: IListing[],
    timeFrom: string,
    timeTo: string
): string | null {
    console.log("formatInventoryForCSVExport", listings);

    const header = [
        "Date Listed",
        "Item ID",
        "Item Name",
        "Marketplace",
        "Listing Price",
        "Purchase Price",
        "Quantity",
        "Currency",
    ];
    const filtered = filterListingsByDateRange(listings, timeFrom, timeTo);

    if (!filtered.length) return null;

    const rows = filtered.map(l => [
        l.dateListed ? formatDate(l.dateListed) : "N/A",
        `"\'${l.itemId}"`,
        escapeCSVField(l.name ?? "N/A"),
        escapeCSVField(l.storeType ?? "N/A"),
        l.price?.toFixed(2) ?? "N/A",
        l.purchase?.price?.toFixed(2) ?? "N/A",
        l.quantity?.toString() ?? "N/A",
        l.currency ?? "N/A",
    ].join(","));

    return [header.join(","), ...rows].join("\n");
}

// —— 4) REFUNDS ——
export function formatRefundsForCSVExport(
    orders: IOrder[],
    timeFrom: string,
    timeTo: string
): string | null {
    console.log("formatRefundsForCSVExport", orders);

    const header = [
        "Refund Date",
        "Transaction ID",
        "Order ID",
        "Item Name",
        "Marketplace",
        "Refund Amount",
        "Refunded To",
        "Status",
        "Currency",
    ];
    const filtered = filterOrdersByDateRange(orders, timeFrom, timeTo)
        .filter(o => o.refund && o.refund.amount);

    if (!filtered.length) return null;

    const rows = filtered.map(o => [
        o.refund!.refundedAt ? formatDate(o.refund!.refundedAt) : "N/A",
        `"\'${o.transactionId}"`,
        `"\'${o.orderId}"`,
        escapeCSVField(o.name ?? "N/A"),
        escapeCSVField(o.storeType ?? "N/A"),
        o.refund!.amount?.toFixed(2) ?? "N/A",
        o.refund!.refundedTo ?? "N/A",
        o.refund!.status ?? "N/A",
        o.refund!.currency ?? "N/A",
    ].join(","));

    return [header.join(","), ...rows].join("\n");
}

// —— 3) ONE-TIME EXPENSES ——
export function formatOneTimeExpensesForCSVExport(
    expenses: IOneTimeExpense[],
    timeFrom: string,
    timeTo: string
): string | null {
    const header = [
        "Date",
        "ID",
        "Name",
        "Amount",
        "Provider",
        "Currency",
    ];

    // Filter expenses by date (inclusive)
    const filtered = expenses
        .filter(exp => {
            if (!exp.date) return false;
            const d = new Date(exp.date).toISOString().slice(0, 10);
            return d >= timeFrom && d <= timeTo;
        });

    if (!filtered.length) return null;

    const rows = filtered.map(exp => [
        exp.date ? formatDate(exp.date) : "N/A",
        exp.id ? `"'${exp.id}"` : "N/A",
        escapeCSVField(exp.name ?? "N/A"),
        (exp.amount != null ? exp.amount.toFixed(2) : "0.00"),
        escapeCSVField(exp.provider ?? "N/A"),
        exp.currency ?? "N/A",
    ].join(","));

    return [header.join(","), ...rows].join("\n");
  }


function shortenText(name: string, length: number = 20): string {
    if (name.length <= length) {
        return name;
    }

    if (name.length <= 2 * length) {
        // For names between length and 2*length, split into two halves (minus 3 for the ellipsis)
        const half = Math.floor((name.length - 3) / 2);
        return `${name.substring(0, half)}...${name.substring(name.length - half)}`;
    }

    // For longer names, use the full cutoff at both ends.
    return `${name.substring(0, length)}...${name.substring(name.length - length)}`;
}

export { formatOrdersForCSVExport, shortenText };
