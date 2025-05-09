export const truncateText = (text: string, maxLength: number) => {
	if (text.length > maxLength) {
		return text.slice(0, maxLength - 3) + '...'; // Truncate and add ellipsis
	}
	return text;
};