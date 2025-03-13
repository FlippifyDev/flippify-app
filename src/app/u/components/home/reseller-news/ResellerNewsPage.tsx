"use client"

import React, { useState, useEffect } from 'react';
import { database } from '@/lib/firebase/client';
import { ref, get } from "firebase/database";
import NewsCard from './NewsCard';

interface NewsItem {
	id: string;
	title: string;
	subTitle: string;
	link?: string;
	description: string;
	image: string;
	date: Date;
}

const ResellerNewsPage = () => {
	const [newsData, setNewsData] = useState<NewsItem[]>([]);

	useEffect(() => {
		const newsRef = ref(database, 'resellerNews');
		const fetchNews = async () => {
			try {
				const snapshot = await get(newsRef);  // Fetch data once
				if (snapshot.exists()) {
					const newsList: NewsItem[] = [];
					snapshot.forEach((childSnapshot) => {
						newsList.push({
							id: childSnapshot.key,
							...childSnapshot.val(),
						});
					});
					setNewsData(newsList);
				} else {
					setNewsData([]);  // No news data found
				}
			} catch (error) {
				console.error("Error fetching reseller news:", error);
				alert("Error fetching reseller news.");
			}
		};

		fetchNews(); // Fetch the data on component mount

	}, []); // Empty dependency array to ensure it runs only once

	return (
		<div className="container mx-auto px-4 py-5">
			<div className="grid grid-cols-1 gap-4">
				{newsData.length > 0 ? (
					newsData.map((newsItem) => (
						<NewsCard
							key={newsItem.id} // Use ID as a unique key
							title={newsItem.title}
							sub_title={newsItem.subTitle}
							description={newsItem.description}
							image={newsItem.image}
							date={newsItem.date}
							link={newsItem.link}
						/>
					))
				) : (
					<NewsCard
						title="No news right now"
						sub_title="Be sure to come back later"
						description="We upload important news which impacts resellers."
						image="https://imgur.com/2GEHpJf.png"
						date={new Date()}
					/>
				)}
			</div>
		</div>
	);
};

export default ResellerNewsPage;
