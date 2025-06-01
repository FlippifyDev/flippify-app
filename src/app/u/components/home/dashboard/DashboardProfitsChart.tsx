import { useEffect } from "react";
import ApexCharts from "apexcharts";
import { format, parse } from "date-fns";
import { enGB } from "date-fns/locale";

interface ChartData {
    categories: string[];
    series: { name: string; data: number[] }[];
}

interface DashboardProfitsChartProps {
    salesData: ChartData;
    selectedRange: number;
    currencySymbol: string;
}

const DashboardProfitsChart: React.FC<DashboardProfitsChartProps> = ({
    salesData,
    selectedRange,
    currencySymbol,
}) => {
    useEffect(() => {
        let offsetY = 0;
        // Make a shallow copy of categories & series, then “inflate” if length === 1
        let chartCategories = [...salesData.categories];
        let chartSeries = salesData.series.map((s) => ({ ...s, data: [...s.data] }));

        if (salesData.categories.length === 1) {
            // Duplicate that single category twice
            const onlyCat = salesData.categories[0];
            chartCategories = [onlyCat, onlyCat];

            // For each series, duplicate the single value
            chartSeries = salesData.series.map((s) => {
                const onlyVal = s.data[0];
                return { name: s.name, data: [onlyVal, onlyVal] };
            });
            offsetY = 0.1
        }

        const options: ApexCharts.ApexOptions = {
            chart: {
                type: "area",
                height: 300,
                toolbar: {
                    show: false,
                },
            },
            series: chartSeries,
            xaxis: {
                categories: chartCategories,
                labels: {
                    show: true,
                    formatter: (val: string) => {

                        // Ensure `val` is a valid string and parse it as an ISO date
                        if (typeof val !== "string") return "";

                        const index = chartCategories.indexOf(val);

                        try {
                            const date = parse(val, "dd MM yyyy", new Date(), { locale: enGB });
                            const monthDate = parse(val, "MM yyyy", new Date(), { locale: enGB });
                            if (isNaN(date.getTime()) && isNaN(monthDate.getTime())) return ""; // Return empty if dates are invalid

                            // Adjust date format based on selected range
                            if (selectedRange <= 7) {
                                // daily
                                return format(date, "dd MMM", { locale: enGB });
                            } else if (selectedRange <= 30) {
                                // weekly
                                return format(date, "dd MMM", { locale: enGB });
                            } else if (selectedRange <= 90) {
                                // Show ~10 dates per month (around 30 dates total for 90 days)
                                return index % 3 === 0 ? format(date, "MMM d", { locale: enGB }) : "";
                            } else if (selectedRange <= 730) {
                                // Show each month for the yearly range
                                const monthYearString = format(monthDate, "MMM yyyy", { locale: enGB });
                                const previousDate = index > 0 ? new Date(salesData.categories[index - 1]) : null;
                                const monthChanged = previousDate ? monthDate.getMonth() !== previousDate.getMonth() : true;

                                return monthChanged ? monthYearString : "";
                            } else {
                                // longer periods
                                return format(date, "yyyy", { locale: enGB });
                            }
                        } catch (error) {
                            return "";
                        }
                    },
                    rotate: -45,
                },
            },
            yaxis: {
                min: (min) => {
                    return min - Math.abs(min * offsetY);
                },
                max: (max) => {
                    return max + Math.abs(max * offsetY);
                },
                labels: {
                    show: true,
                    formatter: (val: number) => {
                        if (!currencySymbol) {
                            return `${val.toFixed(2)}`;
                        }
                        return `${currencySymbol}${val.toFixed(2)}`;
                    },
                },
            },
            stroke: {
                curve: "smooth",
            },
            dataLabels: {
                enabled: false,
            },
            tooltip: {
                enabled: true,
                x: {
                    show: true,
                    formatter: (val: number) => {
                        const dateString = chartCategories[val - 1];

                        if (dateString === undefined) {
                            return "";
                        }
                        // Parse the date string into a Date object
                        const parsedDate = parse(dateString, "dd MM yyyy", new Date());
                        const parsedMonthDate = parse(dateString, "MM yyyy", new Date());

                        // Check if the date is valid
                        if (isNaN(parsedDate.getTime()) && isNaN(parsedMonthDate.getTime())) {
                            return "";
                        }

                        if (selectedRange <= 90) {
                            return format(parsedDate, "dd MMM yyyy", { locale: enGB });
                        }
                        return format(parsedMonthDate, "MMM yyyy", { locale: enGB });
                    },
                },
                y: {
                    formatter: (val: number) => {
                        if (!currencySymbol) {
                            return "";
                        }
                        return `${currencySymbol}${val.toFixed(2)}`;
                    },
                },
            },
            colors: ["#008ffb", "#5a9bd5", "#87b3d9"] // (revenue, costs, and profits)
        };

        const chart = new ApexCharts(
            document.querySelector("#area-chart"),
            options
        );
        chart.render();

        return () => {
            chart.destroy();
        };
    }, [salesData, selectedRange, currencySymbol]);

    return <div id="area-chart"></div>;
};

export default DashboardProfitsChart;
