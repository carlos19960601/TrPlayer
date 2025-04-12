import { AlertTriangle } from "lucide-react";

export const PagePlaceholder = (props: {
	placeholder?: string;
	extra?: string;
	showBackButton?: boolean;
}) => {
	const { placeholder, extra, showBackButton } = props;

	return (
		<div className="h-full">
			<div>
				<AlertTriangle className="h-10 w-10 text-muted-foreground" />

				<h3 className="mt-4 text-lg font-semibold">
					{placeholder || "Not ready yet"}
				</h3>
			</div>
		</div>
	);
};
