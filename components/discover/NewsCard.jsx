import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

function NewsCard({ news, variant = "full" }) {
	const isCompact = variant === "compact";

	return (
		<div
			className="border rounded-2xl mt-6 cursor-pointer"
			onClick={() => window.open(news?.url, "_blank")}
		>
			<img
				src={news?.thumbnail?.original || null}
				alt={news?.title}
				height={isCompact ? 200 : 400}
				className={`${
					isCompact ? "h-[200px]" : "h-[400px]"
				} w-full object-cover rounded-t-2xl`}
			/>
			<div className="p-4">
				<h2
					className={`font-bold ${
						isCompact ? "text-base" : "text-lg"
					} text-gray-600 line-clamp-2`}
				>
					{news?.title}
				</h2>

				<ReactMarkdown
					rehypePlugins={[rehypeRaw]}
					components={{
						p: ({ node, ...props }) => (
							<p
								{...props}
								className="text-md line-clamp-2 text-gray-500"
							/>
						),
					}}
				>
					{news?.description || ""}
				</ReactMarkdown>
			</div>
		</div>
	);
}

export default NewsCard;
