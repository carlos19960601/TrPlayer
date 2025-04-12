import { ModelProviderContext } from "@/renderer/context/model-provider";
import { Separator } from "@renderer/components/ui/separator";
import { useContext, useMemo } from "react";
import { ModelItem } from "./model-item";

interface ModelListProps {
	label?: string;
}

export const ModelList = (props: ModelListProps) => {
	const { label } = props;
	const { models } = useContext(ModelProviderContext);

	const labeledModel = useMemo(() => {
		return models.filter((model) => model.label === label);
	}, [models]);

	return (
		<div className="p-2">
			{labeledModel.map((model, index) => (
				<div key={model.value}>
					<ModelItem value={model.value} />
					{index < models.length - 1 && <Separator />}
				</div>
			))}
		</div>
	);
};
