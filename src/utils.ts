import path from "node:path";
import { AudioFormats, VideoFormats } from "./constants";

export const determineMediaType = (filepath: string): MediaType => {
	if (AudioFormats.some((ext) => filepath.endsWith(ext)))
		return "Audio" as MediaType;
	if (VideoFormats.some((ext) => filepath.endsWith(ext)))
		return "Video" as MediaType;

	return "Unknown" as MediaType;
};

// 获取文件的MIME类型
export const getMimeType = (filepath: string): string => {
	const ext = path.extname(filepath).toLowerCase();
	const mimeTypes: { [key: string]: string } = {
		".mp4": "video/mp4",
		".avi": "video/x-msvideo",
		".mov": "video/quicktime",
		".wmv": "video/x-ms-wmv",
		".flv": "video/x-flv",
		".webm": "video/webm",
		".mkv": "video/x-matroska",
		".mp3": "audio/mpeg",
		".wav": "audio/wav",
		".flac": "audio/flac",
		".aac": "audio/aac",
		".ogg": "audio/ogg",
	};
	return mimeTypes[ext] || "application/octet-stream";
};
