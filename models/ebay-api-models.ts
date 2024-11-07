interface IOrder {
    orderId: string;
    legacyItemId: string;
    itemName: string;
    quantitySold: number;
    saleDate: string;
    salePrice: number;
    salePlatform: string;
    shippingFees: number;
    otherFees: number;
    expectedPayoutDate: string | null | undefined;
    purchasePrice: number | null;
    purchaseDate: string | null;
    purchasePlatform: string | null;
    buyerUsername: string;
    customTag: string;
}


interface IUserData {

}


interface IEbayTokenData {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    error?: string;
    error_description?: string;
}


interface IEbayWarehouseData {
  location: {
    address: {
      city: string;
      country: string;  // Country code (e.g., 'US', 'GB', 'DE')
      stateOrProvince: string;
    };
  };
  name: string;
  merchantLocationStatus: "ENABLED" | "DISABLED";
  locationTypes: ["WAREHOUSE"];
}


export type { IOrder, IUserData, IEbayTokenData, IEbayWarehouseData }