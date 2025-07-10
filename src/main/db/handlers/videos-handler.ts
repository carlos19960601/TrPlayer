import ffmpeg from "@/main/ffmpeg";
import log from "@/main/logger";
import settings from "@/main/settings";
import { timelineToAss } from "@/utils";
import { Transcription, Video } from "@main/db/models";
import { IpcMainInvokeEvent, ipcMain } from "electron";
import fs from "fs-extra";
import path from "node:path";
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

	private async export(
		_event: IpcMainInvokeEvent,
		id: string,
		params: {
			savePath: string;
			language: ExportLanguageType;
			format: string;
		}
	) {
		logger.info("export video", {
			id,
			params,
		});

		const video = await Video.findByPk(id, {
			include: [
				{
					association: "transcription",
					model: Transcription,
				},
			],
		});
		if (!video) {
			throw new Error("Video not found");
		}

		if (!video.transcription?.recognitionResult) {
			throw new Error("No transcription result found for this video");
		}

		// 确保输出目录存在
		fs.ensureDirSync(path.dirname(params.savePath));

		// 生成 ASS 字幕内容
		const assContent = timelineToAss(
			video.transcription.recognitionResult,
			params.language
		);

		// 创建临时字幕文件
		const tempSubtitleFile = path.join(
			settings.cachePath(),
			`subtitle_${Date.now()}.ass`
		);

		try {
			// 写入字幕文件
			fs.writeFileSync(tempSubtitleFile, assContent);

			// 使用 ffmpeg 将字幕内嵌到视频中
			const outputPath = await ffmpeg.embedHardSubtitles(
				video.filePath,
				tempSubtitleFile,
				params.savePath
			);

			logger.info(`Video with embedded subtitles created: ${outputPath}`);

			return {
				success: true,
				outputPath,
				message: "Video exported successfully with embedded subtitles",
			};
		} catch (error) {
			logger.error("Error exporting video with subtitles:", error);
			throw error;
		}
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
