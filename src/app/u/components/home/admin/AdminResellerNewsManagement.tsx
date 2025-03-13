import React, { useState, useEffect } from 'react';
import { database } from '@/lib/firebase/config';
import { useSession } from 'next-auth/react';
import { ref, push, set, get, remove } from "firebase/database";

const AdminResellerNewsManagement = () => {
	const [newsTitle, setNewsTitle] = useState("");
	const [newsSubTitle, setNewsSubTitle] = useState("");
	const [newsDescription, setNewsDescription] = useState("");
	const [newsImage, setNewsImage] = useState<any>(null);
	const [newsLink, setNewsLink] = useState<any>(null);
	const [news, setNews] = useState<any[]>([]);
	const [selectedNewsArticles, setSelectedNewsArticles] = useState<string[]>([]);

	const { data: session } = useSession(); // Use session to get username

	// Fetch news from Firebase using get (one-time fetch)
	useEffect(() => {
		const newsRef = ref(database, 'resellerNews');
		const fetchNews = async () => {
			try {
				const snapshot = await get(newsRef);
				if (snapshot.exists()) {
					const newsList: any[] = [];
					snapshot.forEach((childSnapshot) => {
						newsList.push({ id: childSnapshot.key, ...childSnapshot.val() });
					});
					setNews(newsList);
				} else {
					setNews([]); // No news found
				}
			} catch (error) {
				console.error("Error fetching reseller news:", error);
				alert("Error fetching reseller news.");
			}
		};

		fetchNews(); // Call the function to fetch news

	}, []); // Empty dependency array to run once when component mounts

	const handleAddNews = async () => {
		if (!newsTitle || !newsSubTitle || !newsDescription || !newsImage) {
			alert("Please fill in all fields.");
			return;
		}

		if (!session?.user?.name) {
			alert("Unable to retrieve username.");
			return;
		}

		const newsRef = ref(database, 'resellerNews');
		const newNewsRef = push(newsRef);

		try {
			await set(newNewsRef, {
				title: newsTitle,
				subTitle: newsSubTitle,
				description: newsDescription,
				image: newsImage,
				link: newsLink,
				date: Date.now(),
			});

			setNewsTitle("");
			setNewsSubTitle("");
			setNewsDescription("");
			setNewsImage(null);
			setNewsLink(null);
			alert("Reseller news added!");
		} catch (error) {
			console.error("Error adding reseller news:", error);
			alert("Error adding reseller news.");
		}
	};

	const handleDeleteSelectedNews = async () => {
		if (selectedNewsArticles.length === 0) {
			alert("No news articles selected.");
			return;
		}

		try {
			for (const newsId of selectedNewsArticles) {
				const newsRef = ref(database, `resellerNews/${newsId}`);
				await remove(newsRef);
			}
			setSelectedNewsArticles([]);
			alert("Selected news articles deleted!");
		} catch (error) {
			console.error("Error deleting news articles:", error);
			alert("Error deleting news articles.");
		}
	};

	const handleSelectNewsArticle = (newsId: string) => {
		if (selectedNewsArticles.includes(newsId)) {
			setSelectedNewsArticles(selectedNewsArticles.filter(id => id !== newsId));
		} else {
			setSelectedNewsArticles([...selectedNewsArticles, newsId]);
		}
	};

	return (
		<div className="w-full bg-white p-5 rounded-lg shadow-lg">
			<h2 className="text-2xl font-semibold mb-4">Reseller News Management</h2>

			{/* Add News Form */}
			<div className="mb-4">
				<label className="block text-gray-700">Title</label>
				<input
					type="text"
					value={newsTitle}
					onChange={(e) => setNewsTitle(e.target.value)}
					className="input input-bordered w-full"
					placeholder='e.g. News Example Title'
				/>
			</div>

			<div className="mb-4">
				<label className="block text-gray-700">Sub Title</label>
				<input
					type="text"
					value={newsSubTitle}
					onChange={(e) => setNewsSubTitle(e.target.value)}
					className="input input-bordered w-full"
					placeholder='e.g. News Example Sub Title'
				/>
			</div>

			<div className="mb-4">
				<label className="block text-gray-700">Description</label>
				<textarea
					value={newsDescription}
					onChange={(e) => setNewsDescription(e.target.value)}
					className="textarea textarea-bordered w-full"
				/>
			</div>

			<div className="mb-4">
				<label className="block text-gray-700">Optional Link</label>
				<input
					type="text"
					value={newsLink}
					onChange={(e) => setNewsLink(e.target.value)}
					className="input input-bordered w-full"
					placeholder="e.g. https://www.example.com/"
				/>
			</div>

			<div className="mb-4">
				<label className="block text-gray-700">Image Link</label>
				<input
					type="text"
					value={newsImage}
					onChange={(e) => setNewsImage(e.target.value)}
					className="input input-bordered w-full"
					placeholder='e.g. https://www.example.com/image.png'
				/>
			</div>

			<button onClick={handleAddNews} className="btn bg-houseBlue hover:bg-houseHoverBlue text-white w-full mb-4">
				Add News
			</button>

			{/* News List */}
			<h3 className="text-xl font-semibold mb-4">Delete News Articles</h3>
			{news.length > 0 ? (
				<div>
					<ul>
						{news.map((news) => (
							<li key={news.id} className="flex items-center justify-between mb-2">
								<div>
									<strong>{news.title}</strong> - {news.subTitle}
								</div>
								<input
									type="checkbox"
									className="checkbox checkbox-houseBlue"
									checked={selectedNewsArticles.includes(news.id)}
									onChange={() => handleSelectNewsArticle(news.id)}
								/>
							</li>
						))}
					</ul>

					<button
						onClick={handleDeleteSelectedNews}
						className="btn bg-gray-300 text-black hover:bg-red-600 hover:text-white transition-colors duration-200 mt-4"
						disabled={selectedNewsArticles.length === 0}
					>
						Delete Selected News Articles
					</button>
				</div>
			) : (
				<p>No news articles available for deletion.</p>
			)}
		</div>
	);
};

export default AdminResellerNewsManagement;
