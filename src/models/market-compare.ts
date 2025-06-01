export interface IMarketSoldItem {
    platform?: string | null;
    title?: string | null;
    link?: string | null;
    sales?: {
        week?: number | null;
        month?: number | null;
    }
    price?: IMarketStats
}

export interface IMarketListedItem {
    platform?: string | null;
    title?: string | null;
    link?: string | null;
    freeDelieveryAmount?: number | null;
    amount?: number | null;
    price?: IMarketStats
}


export interface IMarketListing {
    title?: string | null;
    price?: number | null;
    date?: Date | null;
}


export interface IMarketStats {
    median?: number | null;
    mean?: number | null;
    min?: number | null;
    max?: number | null;
}
  