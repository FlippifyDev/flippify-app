export const formatTableDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    };
    return date.toLocaleDateString("en-GB", options);
};


export const formatTimePastTimestamp = (timestamp: Date) => {
    const now = new Date();
    const dealTime = new Date(timestamp);

    const diffMs = now.getTime() - dealTime.getTime(); // Difference in milliseconds
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)); // Difference in days
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60)); // Difference in hours
    const diffMinutes = Math.floor(diffMs / (1000 * 60)); // Difference in minutes

    // If the deal was found today, display hours/minutes ago
    if (diffDays === 0) {
        if (diffHours > 0) {
            return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else if (diffMinutes > 0) {
            return `${diffMinutes} min${diffMinutes > 1 ? 's' : ''} ago`;
        } else {
            return 'Just now';
        }
    }

    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};


export const formatTimeUntil = (date: Date) => {
    const now = new Date();
    const timeRemaining = date.getTime() - now.getTime();

    if (timeRemaining > 0) {
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        if (days > 0) {
            return `${days}d ${hours}h ${minutes}m ${seconds}s`;
        } else if (hours > 0) {
            return `${hours}h ${minutes}m ${seconds}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds}s`;
        } else {
            return `${seconds}s`;
        }
    } else {
        return 'Released!';
    }
};


export const formatTimeFrom = (daysAgo: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString();
};

/**
 * Helper function to format dates to the required ISO 8601 format (e.g., 2024-11-01T17:12:26.000Z).
 * @param date - The Date object to format.
 * @returns A string formatted in ISO 8601 format with milliseconds.
 */
export function formatDateToISO(date: Date, useCurrentTime?: boolean): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    let hours: string, minutes: string, seconds: string, milliseconds: string;

    if (useCurrentTime) {
        const now = new Date();
        hours = String(now.getHours()).padStart(2, "0");
        minutes = String(now.getMinutes()).padStart(2, "0");
        seconds = String(now.getSeconds()).padStart(2, "0");
        milliseconds = String(now.getMilliseconds()).padStart(3, "0");
    } else {
        hours = String(date.getHours()).padStart(2, "0");
        minutes = String(date.getMinutes()).padStart(2, "0");
        seconds = String(date.getSeconds()).padStart(2, "0");
        milliseconds = String(date.getMilliseconds()).padStart(3, "0");
    }
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
}



export function handleShortDate(date: string): string {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const d = new Date(date);
    const day = d.getDate();
    const month = months[d.getMonth()];

    const getOrdinal = (n: number): string => {
        if (n > 3 && n < 21) return `${n}th`;
        switch (n % 10) {
            case 1: return `${n}st`;
            case 2: return `${n}nd`;
            case 3: return `${n}rd`;
            default: return `${n}th`;
        }
    };

    return `${getOrdinal(day)} ${month}`;
}