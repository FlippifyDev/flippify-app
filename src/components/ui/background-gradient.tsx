import { cn } from "@/src/lib/utils";
import React from "react";
import { motion } from "framer-motion";

export const BackgroundGradient = ({
	children,
	className,
	containerClassName,
	animate = true,
}: {
	children?: React.ReactNode;
	className?: string;
	containerClassName?: string;
	animate?: boolean;
}) => {
	const variants = {
		initial: {
			backgroundPosition: "0 50%",
		},
		animate: {
			backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
		},
	};

	return (
		<div className={cn("relative p-[2px]", containerClassName)}>
			<motion.div
				variants={animate ? variants : undefined}
				initial={animate ? "initial" : undefined}
				animate={animate ? "animate" : undefined}
				transition={
					animate
						? {
							duration: 5,
							repeat: Infinity,
							repeatType: "reverse",
						}
						: undefined
				}
				style={{
					backgroundSize: animate ? "400% 400%" : undefined,
				}}
				className={cn(
					"absolute inset-0 z-[1] opacity-50 blur-md transition duration-500 will-change-transform", // Removed hover effect
					// Blue gradient effect
					"bg-[radial-gradient(circle_farthest-side_at_0_100%,#00aaff,transparent),radial-gradient(circle_farthest-side_at_100%_0,#1a73e8,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#b3e5fc,transparent),radial-gradient(circle_farthest-side_at_0_0,#1a73e8,#141316)]"
				)}
			/>
			<motion.div
				variants={animate ? variants : undefined}
				initial={animate ? "initial" : undefined}
				animate={animate ? "animate" : undefined}
				transition={
					animate
						? {
							duration: 5,
							repeat: Infinity,
							repeatType: "reverse",
						}
						: undefined
				}
				style={{
					backgroundSize: animate ? "400% 400%" : undefined,
				}}
				className={cn(
					"absolute inset-0 rounded-2xl z-[1] will-change-transform",
					"bg-[radial-gradient(circle_farthest-side_at_0_100%,#00aaff,transparent),radial-gradient(circle_farthest-side_at_100%_0,#1a73e8,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#b3e5fc,transparent),radial-gradient(circle_farthest-side_at_0_0,#1a73e8,#141316)]"
				)}
			/>

			<div className={cn("relative z-10", className)}>{children}</div>
		</div>
	);
};
