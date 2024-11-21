interface ISection {
	label: string;
	value: string;
	className?: string;
}

interface IMonitorCard {
	header: string;
	title: string;
	image: string;
	link: string;
	ebay_link?: string;
	timestamp: Date;
	className?: string;
	sections?: [ISection, ISection];
	tableContents: { [key: string]: { value: string | number; className?: string } };
	tableClassName?: string;
	[key: string]: any;
}


interface IDoc {
	[key: string]: any;
}


interface ISortingDoc {
	price: number;
	ebay_mean_price: number;
	ebay_max_price: number;
	timestamp: Date;
	estimatedProfit?: number | undefined;
	sold_last_7_days: number;
	sold_last_month: number;
	[key: string]: any;
}


export type { IMonitorCard, IDoc, ISortingDoc } 