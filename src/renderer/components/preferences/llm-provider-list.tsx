import { useAiCommand } from "@/renderer/hooks";
import { Button } from "../ui";

export const LlmProviderList = (props: {
	selectedProvider: LlmProviderType;
	setSelectedProvider: (provider: LlmProviderType) => void;
}) => {
	const { selectedProvider, setSelectedProvider } = props;
	const { llmProviders } = useAiCommand();

	return (
		<div className="h-full w-60 flex flex-col gap-2">
			{llmProviders.map((provider) => (
				<Button
					key={provider.providerId}
					variant={
						selectedProvider?.providerId === provider.providerId
							? "default"
							: "outline"
					}
					size="lg"
					className="w-full justify-start"
					onClick={() => setSelectedProvider(provider)}
				>
					{<provider.icon />}
					{provider.name}
				</Button>
			))}
		</div>
	);
};
