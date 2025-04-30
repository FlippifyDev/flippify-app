import { IOrder } from "@/models/store-data"


function calculateMonthlyIncomeAndExpense(orders: IOrder[]) {
    const income: Record<string, number> = {}
    const expense: Record<string, number> = {}

    // Define month names for category labels
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    orders.forEach(order => {
        if (!order.sale?.date || !order.purchase?.price || !order.sale?.price) {
            return;
        }

        const saleDate = new Date(order.sale.date)
        const month = months[saleDate.getMonth()] // Get the month name

        const expenseAmount = order.purchase.price + (order.shipping?.fees ?? 0) + (order.additionalFees ?? 0);

        // Accumulate income and expense by month
        income[month] = (income[month] || 0) + order.sale.price
        expense[month] = (expense[month] || 0) + expenseAmount
    })

    // Only include months that have data
    const filteredMonths = Object.keys(income)
    const incomeData = filteredMonths.map(month => income[month]?.toFixed(2) ?? "0")
    const expenseData = filteredMonths.map(month => expense[month]?.toFixed(2) ?? "0")

    return { incomeData, expenseData, months: filteredMonths }
}

export function fetchBarChartOptions(orders: IOrder[], currencySymbol: string) {
    const { incomeData, expenseData, months } = calculateMonthlyIncomeAndExpense(orders)

    return {
        series: [
            {
                name: "Income",
                color: "#0D3B66",
                data: incomeData,
            },
            {
                name: "Expense",
                color: "#A9D6E5",
                data: expenseData,
            }
        ],
        chart: {
            sparkline: {
                enabled: false,
            },
            type: "bar",
            width: "100%",
            height: 300,
            toolbar: {
                show: false,
            },
        },
        fill: {
            opacity: 1,
        },
        plotOptions: {
            bar: {
                horizontal: true,
                columnWidth: "100%",
                borderRadiusApplication: "end",
                borderRadius: 6,
                dataLabels: {
                    position: "top",
                },
            },
        },
        legend: {
            show: true,
            position: "bottom",
        },
        dataLabels: {
            enabled: false,
        },
        tooltip: {
            shared: true,
            intersect: false,
            formatter: function (value: number) {
                if (isNaN(value)) {
                    return currencySymbol + "0.00"; 
                }
                return `${currencySymbol}${value.toFixed(2)}`
            },
        },
        xaxis: {
            labels: {
                show: true,
                style: {
                    fontFamily: "Inter, sans-serif",
                    cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400',
                },
                formatter: function (value: number) {
                    if (isNaN(value)) {
                        return currencySymbol + "0.00";
                    }
                    return `${currencySymbol}${value.toFixed(2)}`
                },
            },
            categories: months, 
            axisTicks: {
                show: false,
            },
            axisBorder: {
                show: false,
            },
        },
        yaxis: {
            labels: {
                show: true,
                style: {
                    fontFamily: "Inter, sans-serif",
                    cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400',
                },
            },
        },
        grid: {
            show: true,
            strokeDashArray: 4,
            padding: {
                left: 2,
                right: 2,
                top: -20,
            },
        },
    }
}
