import log from "electron-log/renderer";
import { useContext, useState } from "react";
import { AppSettingsProviderContext } from "../context";

const logger = log.scope("use-transcribe.tsx");

export const useTranscribe = () => {
	const { TrPlayerApp } = useContext(AppSettingsProviderContext);
	const [output, setOutput] = useState<string>("");

	const transcode = async (src: string): Promise<string> => {
		const output = await TrPlayerApp?.ffmpeg?.transcode(src);
		return output;
	};

	const transcribe = async (
		mediaSrc: string,
		params?: {
			targetId?: string;
			targetType?: string;
			language: string;
			model: string;
		},
	) => {
		const { language, model } = params || {};
		const url = await transcode(mediaSrc);

		const result = await transcribeByLocal(url, {
			language,
			model,
		});

		return result;
	};

	const transcribeByLocal = async (
		url: string,
		options: { language: string; model: string },
	) => {
		const { language, model } = options;
		const res = await TrPlayerApp.whisper.recognize({ url, language, model });

		setOutput("Whisper transcribe done");

		return res;
	};

	return {
		transcribe,
		output,
	};
};
