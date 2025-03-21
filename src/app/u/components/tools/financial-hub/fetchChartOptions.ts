import { IEbayOrder } from "@/models/store-data";

export function fetchChartOptions(orders: IEbayOrder[]) {
    // Initialize a map to hold total sales for each platform
    const platformSales = new Map<string, number>();

    // Iterate over orders and accumulate the sales by platform
    orders.forEach(order => {
        const platform = order.purchase.platform;
        if (!platform) return;  // Skip if platform is not defined
        const saleAmount = order.sale.price * order.sale.quantity;

        if (platformSales.has(platform)) {
            platformSales.set(platform, platformSales.get(platform)! + saleAmount);
        } else {
            platformSales.set(platform, saleAmount);
        }
    });

    // Extract the platforms and corresponding sales
    const labels = Array.from(platformSales.keys());
    const series = Array.from(platformSales.values());


    return {
        series: series,
        colors: ["#0b5339", "#cc0086", "#fc5007", "#000000", "#81ac6f", "#410c1c", "#f8e8d0", "#c99a3c"], 
        chart: {
            height: 320,
            type: "donut",
        },
        stroke: {
            colors: ["transparent"],
        },
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontFamily: "Inter, sans-serif",
                            offsetY: 20,
                        },
                        total: {
                            showAlways: true,
                            show: true,
                            label: "Revenue",
                            fontFamily: "Inter, sans-serif",
                            formatter: function (w: { globals: { seriesTotals: number[] } }) {
                                const sum = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                                return "$" + sum.toFixed(2);  // Fixed to 2 decimals
                            },
                        },
                        value: {
                            show: true,
                            fontFamily: "Inter, sans-serif",
                            offsetY: -20,
                            formatter: (value: number) => "$" + value.toFixed(2) + "k",  // Fixed to 2 decimals
                        },
                    },
                    size: "80%",
                },
            },
        },
        labels: labels,  // Dynamically set the labels based on platforms
        dataLabels: {
            enabled: false,
        },
        legend: {
            position: "bottom",
            fontFamily: "Inter, sans-serif",
        },
        yaxis: {
            labels: {
                formatter: (value: number) => "$" + value.toFixed(2),  // Fixed to 2 decimals
            },
        },
        xaxis: {
            formatter: (value: any) => {
                const numericValue = Number(value);
                if (isNaN(numericValue)) {
                    return value; // Return original value if it's not a valid number
                }
                return "$" + numericValue.toFixed(2); // Format as 2 decimal places
            },
            axisTicks: {
                show: false,
            },
            axisBorder: {
                show: false,
            },
        },
    }
}
