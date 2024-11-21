const Loading = () => {
	return (
		<div>
			<div className="flex flex-col items-center justify-center min-h-screen">
				<div className="mt-4 text-white text-lg font-semibold z-30">

				</div>
				<div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-discordBlue"></div>
			</div>
		</div>
	);
};

export default Loading;
