import { VideoFormats } from "@/constants";
import ffmpeg from "@/main/ffmpeg";
import log from "@/main/logger";
import settings from "@/main/settings";
import { hashFile } from "@/main/utils";
import mainWindow from "@main/window";
import fs from "fs-extra";
import { t } from "i18next";
import path from "node:path";
import {
	AfterCreate,
	Column,
	DataType,
	Default,
	HasOne,
	IsUUID,
	Model,
	Table,
	Unique,
} from "sequelize-typescript";
import { v5 as uuidv5 } from "uuid";
import { Transcription } from "./transcription";

const logger = log.scope("db/models/video");

@Table({
	modelName: "Video",
	tableName: "videos",
	underscored: true,
})
export class Video extends Model<Video> {
	@IsUUID("all")
	@Default(DataType.UUIDV4)
	@Column({ primaryKey: true, type: DataType.UUID })
	id: string;

	@Unique
	@Column(DataType.STRING)
	md5: string;

	@Column(DataType.STRING)
	name: string;

	// 记录来源
	// 如果是通过url下载，就记录url
	// 如果是通过文件上传，记录为空
	@Column(DataType.STRING)
	source: string;

	@Column(DataType.STRING)
	coverUrl: string;

	@Column(DataType.STRING)
	filePath: string;

	@Column(DataType.JSON)
	metadata: any;

	@Column(DataType.VIRTUAL)
	get mediaType(): string {
		return "Video";
	}

	@HasOne(() => Transcription, {
		foreignKey: "targetId",
		constraints: false,
		scope: {
			target_type: "Video",
		},
	})
	transcription: Transcription;

	@Column(DataType.VIRTUAL)
	get src(): string {
		if (this.filePath) {
			return this.filePath;
		}
		return null;
	}

	@Column(DataType.VIRTUAL)
	get duration(): number {
		return this.getDataValue("metadata").duration;
	}

	@AfterCreate
	static generateCover(video: Video) {
		video.generateCover().catch((err) => {
			logger.error("generate cover error", video.id, err);
		});
	}

	async generateCover() {
		if (this.coverUrl) return;

		logger.info("generate cover for video: ", this.id);

		const coverUrl = await ffmpeg.generateCover(
			this.filePath,
			path.join(settings.storagePath(), `${Date.now()}.png`)
		);
		this.update({ coverUrl: coverUrl });
	}

	static async buildFromLocalFile(
		filePath: string,
		params?: { source?: string }
	): Promise<Video> {
		try {
			fs.accessSync(filePath, fs.constants.R_OK);
		} catch (error) {
			logger.error("access file error: ", error);
			throw new Error(t("models.video.fileNotFound", { file: filePath }));
		}

		// fetch metadata
		const fileMetadata = await ffmpeg.generateMetadata(filePath);
		const metadata = {
			...fileMetadata,
			duration: fileMetadata.format.duration,
		};

		const extname = path.extname(filePath).toLowerCase();
		if (!VideoFormats.includes(extname.split(".").pop() as string)) {
			throw new Error(t("models.video.fileNotSupported", { file: filePath }));
		}

		const md5 = await hashFile(filePath, { algo: "md5" });

		const existing = await Video.findOne({ where: { md5 } });
		if (existing) {
			logger.warn("Video already exists:", existing.id, existing.filePath);
			existing.changed("updatedAt", true);
			existing.update({ updatedAt: new Date() });
			return existing;
		}

		// Generate ID
		const id = uuidv5(`${filePath}/${md5}`, uuidv5.URL);
		logger.debug("Generated ID:", id);

		const name = path.basename(filePath, extname);
		const { source } = params || {};

		const record = this.build({
			id,
			name,
			source,
			filePath,
			md5,
			metadata,
		});

		return record.save().catch((err) => {
			logger.error(err);
			throw err;
		});
	}

	async export(savePath: string) {
		return;
	}

	static notify(video: Video, action: "create" | "update" | "destroy") {
		if (!mainWindow.win) return;

		mainWindow.win.webContents.send("db-on-transaction", {
			model: "Video",
			id: video.id,
			action: action,
			record: video.toJSON(),
		});
	}
}
