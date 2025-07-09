import log from "@/main/logger";
import { timelineToAss } from "@/utils";
import { Transcription, Video } from "@main/db/models";
import { IpcMainInvokeEvent, ipcMain } from "electron";
import { Attributes, WhereOptions } from "sequelize";

const logger = log.scope("db/handlers/videos-handler");

class VideosHandler {
	private async findOne(
		_event: IpcMainInvokeEvent,
		where: WhereOptions<Attributes<Video>>
	): Promise<Video | null> {
		const video = await Video.findOne({
			where,
		});

		if (!video) return;

		return video.toJSON();
	}

	private async create(_event: IpcMainInvokeEvent, uri: string) {
		logger.info("Creating video...", { uri });

		const file = uri;
		let source;
		if (uri.startsWith("http")) {
			// todo download file from uri
			if (!file) throw new Error("Failed to download file");
			source = uri;
		}

		try {
			const video = await Video.buildFromLocalFile(file, { source });
			return video.toJSON();
		} catch (err) {
			logger.error(err.message);
			throw err;
		}
	}

	private async export(_event: IpcMainInvokeEvent, id: string, params: {
		savePath: string;
		language: ExportLanguageType;
		format: string;
	}) {
		const video = await Video.findByPk(id, {
			include: [
				{
					association: "transcription",
					model: Transcription,
				}
			]
		});
		if (!video) {
			throw new Error("Video not found");
		}


		const assContent = timelineToAss(video.transcription.recognitionResult, params.language)
		// fs.writeFileSync(params.filePath, assContent)

		return
	}

	register() {
		ipcMain.handle("videos-find-one", this.findOne);
		ipcMain.handle("videos-create", this.create);
		ipcMain.handle("videos-export", this.export);
	}

	unregister() {
		ipcMain.removeHandler("videos-create");
		ipcMain.removeHandler("videos-find-one");
		ipcMain.removeHandler("videos-export");
	}
}

export const videosHandler = new VideosHandler();
