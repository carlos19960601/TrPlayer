import log from "@main/logger";
import { IpcMainInvokeEvent, ipcMain } from "electron";
import fs from "fs-extra";
import { spawn } from "node:child_process";
import os from "node:os";
import path from "node:path";
import settings from "./settings";

const logger = log.scope("Whisper");
const __dirname = import.meta.dirname;

const TEN_MINUTES = 1000 * 60 * 10; // 10 minutes

class Whisper {
	private binFile: string;
	private abortController: AbortController | null = null;

	constructor() {
		this.binFile = path.join(
			__dirname,
			"lib",
			"whisper",
			os.platform() === "win32" ? "main.exe" : "main"
		);
	}

	private recognize(params: TranscribeParamsType) {
		const modelPath = path.join(settings.modelPath(), `${params.model}.bin`);
		const filename = path.basename(params.url, path.extname(params.url));

		const outputFile = path.join(settings.cachePath(), filename);
		const command = [
			"-m",
			modelPath,
			"-f",
			params.url,
			"--print-progress",
			"--output-json",
			"--output-file",
			outputFile,
		];

		logger.info(`Running command: ${[this.binFile, ...command].join(" ")}`);

		if (fs.existsSync(this.binFile)) {
			logger.info(`${this.binFile} exists`);
		} else {
			logger.info(`${this.binFile} does not exists`);
		}

		return new Promise((resolve, reject) => {
			const proc = spawn(this.binFile, command, {
				timeout: TEN_MINUTES,
				signal: this.abortController?.signal,
			});

			proc.on("close", (code) => {
				if (code !== 0) {
					return reject(
						new Error(`Whisper recognize failed with code: ${code}`)
					);
				}

				if (fs.existsSync(`${outputFile}.json`)) {
					const stat = fs.statSync(`${outputFile}.json`);
					if (stat.size === 0) {
						reject(new Error("Whisper recognize failed: empty file"));
					} else {
						const whisperResult = fs.readJSONSync(
							`${outputFile}.json`
						) as WhisperResult;
						const recognizeResult = {
							language: whisperResult.result.language,
							timeline: whisperResult.transcription.map((t) => ({
								text: t.text,
								startTime: t.offsets.from,
								endTime: t.offsets.to,
							})),
						} as RecognitionResult;

						resolve(recognizeResult);
					}
				} else {
					reject(new Error("Whisper recognize failed: unknown error"));
				}
			});
		});
	}

	registerIpcHandlers() {
		ipcMain.handle(
			"whisper-recognize",
			(event: IpcMainInvokeEvent, params: TranscribeParamsType) => {
				return this.recognize(params);
			}
		);
	}
}

export default new Whisper();
