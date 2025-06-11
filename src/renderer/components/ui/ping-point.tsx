import { cn } from "@renderer/lib/utils";

export const PingPoint = (props: {
	colorClassName?: string;
	size?: number;
	className?: string;
}) => {
	const { colorClassName = "bg-sky-500", size = 4, className } = props;

	return (
		<span className={cn(`relative flex size-${size}`, className)}>
			<span
				className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colorClassName}`}
			></span>
			<span
				className={`relative inline-flex rounded-full size-${size} ${colorClassName}`}
			></span>
		</span>
	);
};
