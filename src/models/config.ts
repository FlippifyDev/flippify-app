export type StatusType = "active" | "under maintenance" | "under development"

export interface IFirebaseConfig {
    status: StatusType;
    api: {
        ebay: StatusType,
        depop: StatusType,
        product: StatusType,
    }
}