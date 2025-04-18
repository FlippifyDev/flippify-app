import { IEbayOrder } from "@/models/store-data";
import { filterOrdersByDateRange } from "./filters";

// Helper function to format dates to readable format
export const formatDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString(); // Formats date as YYYY/MM/DD
};

// Function to format orders for CSV export
function formatOrdersForCSVExport(orders: IEbayOrder[], timeFrom: string, timeTo: string): string | null {
    // Create the CSV header with new columns for Profit and ROI
    const csvHeader = [
        "Order ID",
        "Item Name",
        "Purchase Price",
        "Purchase Quantity",
        "Sale Price",
        "Sale Quantity",
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
            orderId,
            name,
            purchase,
            sale,
            shipping,
            listingDate,
            status,
            customTag
        } = order;

        // Calculate Profit
        const profit = sale.price - (purchase.price ?? 0) - shipping.fees;

        // Calculate ROI (Return on Investment)
        const totalCost = (purchase.price ?? 0) + shipping.fees;
        const roi = totalCost > 0 ? ((profit / totalCost) * 100).toFixed(2) : "0.00"; // Avoid division by zero

        return [
            orderId,
            name,
            (purchase.price ?? 0).toFixed(2), // Format price with 2 decimal places
            purchase.quantity,
            sale.price.toFixed(2), // Format price with 2 decimal places
            sale.quantity,
            shipping.fees.toFixed(2), // Format fees with 2 decimal places
            shipping.timeDays,
            shipping.trackingNumber,
            formatDate(listingDate),  // Format date
            formatDate(sale.date),    // Format sale date
            status,
            customTag || "N/A",  // If no customTag, return "N/A"
            profit.toFixed(2), // Format profit with 2 decimal places
            roi  // ROI formatted with 2 decimal places
        ].join(","); // Join fields with a comma to create a CSV row
    });

    // Join header and rows together to create CSV content
    const csvContent = [
        csvHeader.join(","), // Header row
        ...csvRows  // Data rows
    ].join("\n"); // Join rows with newline character

    return csvContent;
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
