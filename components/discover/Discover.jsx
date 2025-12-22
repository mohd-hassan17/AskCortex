"use client";

import { SEARCH_RESULT } from "@/services/Shared";
import axios from "axios";
import {
	Cpu,
	DollarSign,
	Globe,
	Palette,
	Star,
	Volleyball,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import NewsCard from "./NewsCard";
 

const options = [
	{
		title: "Top",
		icon: Star,
	},
	{
		title: "Tech & Science",
		icon: Cpu,
	},
	{
		title: "Finance",
		icon: DollarSign,
	},
	{
		title: "Art & Culture",
		icon: Palette,
	},
	{
		title: "Sports",
		icon: Volleyball,
	},
];

function Discover() {
	const [selectedOption, setSelectedOption] = useState("Top");
	const [latestNews, setLatestNews] = useState(
	SEARCH_RESULT.news.results
);

	return (
		<div className="mt-20 px-10 md:px-20 lg:px-36 xl:px-56">
			<h2 className="font-bold text-3xl flex gap-2 items-center">
				<Globe />
				<span>Discover</span>
			</h2>

			<div className="flex mt-5">
				{options.map((option, index) => (
					<div
						key={index}
						onClick={() => setSelectedOption(option.title)}
						className={`flex gap-1 p-1 px-3 hover:text-primary items-center rounded-full
            cursor-pointer ${
				selectedOption == option.title && "bg-accent text-primary"
			}`}
					>
						<option.icon className="h-4 w-4" />
						<h2 className="text-sm">{option.title}</h2>
					</div>
				))}
			</div>
			<div className="space-y-6">
				{latestNews
					?.map((news, index) => {
						// Every 4th card (index 3, 7, 11, etc.) is full width
						if ((index + 1) % 4 === 0) {
							return (
								<div key={index} className="w-full">
									<NewsCard news={news} variant="full" />
								</div>
							);
						}

						// For other cards, only render if it's the first card in a group of 3
						const isFirstInGroup = index % 4 === 0;
						if (!isFirstInGroup) return null;

						// Get the next 3 cards (or remaining cards if less than 3)
						const groupCards = latestNews.slice(index, index + 3);

						return (
							<div
								key={`group-${index}`}
								className="grid grid-cols-1 md:grid-cols-3 gap-4"
							>
								{groupCards.map((groupNews, groupIndex) => (
									<NewsCard
										key={index + groupIndex}
										news={groupNews}
										variant="compact"
									/>
								))}
							</div>
						);
					})
					.filter(Boolean)}
			</div>
		</div>
	);
}

export default Discover;