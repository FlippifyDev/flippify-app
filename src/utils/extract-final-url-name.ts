// Function to process the title from the URL
export const getProcessedTitle = () => {
	const path = window.location.pathname; // Get the current URL path
	const pathSegments = path.split('/');  // Split the path into segments
	const lastSegment = pathSegments[pathSegments.length - 1];  // Get the last segment

	// Capitalize and remove dashes
	const formattedTitle = lastSegment
		.replace(/-/g, ' ')  // Replace dashes with spaces
		.replace(/\b\w/g, (char) => char.toUpperCase());  // Capitalize first letter of each word

	return formattedTitle;
};