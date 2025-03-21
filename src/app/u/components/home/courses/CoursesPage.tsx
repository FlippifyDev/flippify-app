import CourseCard from "./CourseCard";
import LayoutSubscriptionWrapper from "../../layout/LayoutSubscriptionWrapper";

const coursesData = {
	flippifyFundamentals: {
		title: "Flippify Fundamentals",
		tagline: "Your Launchpad to Reselling Success",
		image: "https://i.imgur.com/ahFKtE7.png",
		link: "/flippify-fundamentals",
	},
	theRetailGoldmine: {
		title: "The Retail Goldmine",
		tagline: "Unlocking Profits In-Store",
		image: "https://i.imgur.com/z2ztJqx.png",
		link: "/the-retail-goldmine",
	},
	theArtOfReselling: {
		title: "The Art of Reselling",
		tagline: "Mastering Your Online Reselling Empire",
		image: "https://i.imgur.com/bgsfbi2.png",
		link: "/the-art-of-reselling",
	},
	comingSoon: {
		title: "Coming Soon",
		tagline: "More Courses Coming Soon..",
		image: "https://i.imgur.com/HRI81ZJ.png",
		link: "/coming-soon",
	},
};

const CoursesPageContent = () => {
	return (
		<div className="w-full h-full mb-2 flex flex-col lg:flex-row lg:space-x-2 px-2">
			{/* Left Section: Courses */}
			<div className="flex-1 flex flex-col space-y-4 md:space-y-2">
				{/* Your Courses Section */}
				<div className="container mx-auto px-6 pb-6 md:pb-6 pt-4 mt-2 border bg-white shadow-lg rounded-lg">
					<h2 className="text-2xl font-bold pb-4 text-center lg:text-left">Courses</h2>

					<LayoutSubscriptionWrapper requiredSubscriptions={["elite"]}>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
							<CourseCard {...coursesData.theRetailGoldmine} type="yourCourses" />
							<CourseCard {...coursesData.theArtOfReselling} type="yourCourses" />
							<CourseCard {...coursesData.comingSoon} type="otherCourses" />
						</div>
					</LayoutSubscriptionWrapper>

					<LayoutSubscriptionWrapper requiredSubscriptions={["pro"]}>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
							<CourseCard {...coursesData.flippifyFundamentals} type="yourCourses" />
							<CourseCard {...coursesData.theRetailGoldmine} type="yourCourses" />
							<CourseCard {...coursesData.theArtOfReselling} type="otherCourses" />
							<CourseCard {...coursesData.comingSoon} type="otherCourses" />
						</div>
					</LayoutSubscriptionWrapper>

					<LayoutSubscriptionWrapper requiredSubscriptions={["standard"]}>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
							<CourseCard {...coursesData.flippifyFundamentals} type="yourCourses" />
							<CourseCard {...coursesData.theRetailGoldmine} type="otherCourses" />
							<CourseCard {...coursesData.theArtOfReselling} type="otherCourses" />
							<CourseCard {...coursesData.comingSoon} type="otherCourses" />
						</div>
					</LayoutSubscriptionWrapper>

					<LayoutSubscriptionWrapper requiredSubscriptions={["!member"]}>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center">
							<CourseCard {...coursesData.flippifyFundamentals} type="otherCourses" />
							<CourseCard {...coursesData.theRetailGoldmine} type="otherCourses" />
							<CourseCard {...coursesData.theArtOfReselling} type="otherCourses" />
							<CourseCard {...coursesData.comingSoon} type="otherCourses" />
						</div>
					</LayoutSubscriptionWrapper>
				</div>
			</div>

			{/* Right Side Section: 1-on-1 Support and Upcoming Events */}
			<div className="lg:w-1/4 flex-shrink-0 bg-white border shadow-lg rounded-lg px-4 py-6 lg:ml-4 mt-4 lg:mt-2">
				<h3 className="text-xl font-bold mb-4 text-center lg:text-left">Need 1-on-1 Support?</h3>
				<p className="text-gray-600 mb-4 text-center lg:text-left">
					Book a call with one of our experts for personalized assistance.
				</p>
				<div className="flex justify-center lg:justify-start">
					<button className="btn-disabled bg-gray-300 text-gray-400 opacity-90 py-2 px-4 rounded-lg transition duration-200">
						Coming Soon
					</button>
				</div>
			</div>
		</div>
	);
};

export default CoursesPageContent;
