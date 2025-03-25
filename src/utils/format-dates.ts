export const formatTableDate = (dateString: string | null | undefined) => {
	if (!dateString) return "N/A";
	const options: Intl.DateTimeFormatOptions = {
		day: "2-digit",
		month: "short",
		year: "numeric",
	};
	const date = new Date(dateString);
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
    return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
};

/**
 * Helper function to format dates to the required ISO 8601 format (e.g., 2024-11-01T17:12:26.000Z).
 * @param date - The Date object to format.
 * @returns A string formatted in ISO 8601 format with milliseconds.
 */
export function formatDateToISO(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;
}