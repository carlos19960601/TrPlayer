import log from "electron-log/renderer";
import {
	PropsWithChildren,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";
import { AppSettingsProviderContext } from "./app-settings-provider";

const logger = log.scope("model-provider.tsx");

type ModelProviderState = {
	models: ModelType[];
	reload?: () => void;
	downloadingModel?: ModelType;
	downloadModel?: (model: ModelType) => void;
	cancelDownload?: (model: ModelType) => void;
};

const initialState: ModelProviderState = {
	models: [],
};

export const ModelProviderContext =
	createContext<ModelProviderState>(initialState);

export const ModelProvider = ({ children }: PropsWithChildren) => {
	const { TrPlayerApp } = useContext(AppSettingsProviderContext);
	const [models, setModels] = useState<ModelType[]>([]);
	const [downloadingModel, setDownloadingModel] = useState<ModelType>();

	useEffect(() => {
		fetchModels();
	}, []);

	const fetchModels = () => {
		return TrPlayerApp.model.getModels().then((models) => setModels(models));
	};

	const downloadModel = async (model: ModelType) => {
		setDownloadingModel(model);

		try {
			await TrPlayerApp.model.download(model);
		} catch (err) {
			logger.error("model download failed", err);
		} finally {
			setDownloadingModel(undefined);
		}
	};

	const cancelDownload = async (model: ModelType) => {
		if (model.value !== downloadingModel.value) return;

		try {
			await TrPlayerApp.model.cancel(model);
		} finally {
			setDownloadingModel(undefined);
		}
	};

	return (
		<ModelProviderContext.Provider
			value={{
				models,
				downloadingModel,
				downloadModel,
				cancelDownload,
				reload: fetchModels,
			}}
		>
			{children}
		</ModelProviderContext.Provider>
	);
};
