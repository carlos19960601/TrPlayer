import { Separator } from "@renderer/components/ui";
import { useState } from "react";
import LlmProviderConfig from "./llm-provider-config";
import { LlmProviderList } from "./llm-provider-list";

export const LlmProviderSettings = () => {
	const [selectedProvider, setSelectedProvider] =
		useState<LlmProviderType>(null);

	return (
		<div className="flex h-full">
			<LlmProviderList
				selectedProvider={selectedProvider}
				setSelectedProvider={setSelectedProvider}
			/>
			<Separator orientation="vertical" className="mx-2" />
			{selectedProvider && (
				<div className="flex-1">
					<LlmProviderConfig selectedProvider={selectedProvider} />
				</div>
			)}
		</div>
	);
};
