export type StatusType = "active" | "under maintenance"

export interface IFirebaseConfig {
    status: StatusType;
    api: {
        ebay: StatusType
    }
}