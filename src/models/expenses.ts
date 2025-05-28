export type Expense = "one-time" | "subscription"

export type WeeklyRenewal = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
export type MonthlyRenewal = string;
export type YearlyRenewal = string;
export type Renewal = "daily" | WeeklyRenewal | MonthlyRenewal | YearlyRenewal;
export type BillingCycle = "daily" | "weekly" | "monthly" | "yearly"

interface IExpenseBase {
    id?: string | null;
    name?: string | null;
    amount?: number | null;
    provider?: string | null;
    currency?: string | null;
    createdAt?: string | null;
    notes?: string | null;
}

interface IOneTimeExpense extends IExpenseBase {
    type?: "one-time" | null;
    date?: string | null;
}


interface ISubscriptionExpense extends IExpenseBase {
    type?: "subscription" | null;
    active?: boolean | null;
    billingCycle?: BillingCycle | null;
    renewalDate?: Renewal | null;
    startDate?: string | null;
    endDate?: "indefinite" | string | null;
}

export type { IOneTimeExpense, ISubscriptionExpense }