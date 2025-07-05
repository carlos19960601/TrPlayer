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


export function millisecondsToTimestamp(ms: number) {
	const hours = Math.floor(ms / 3600000).toString();
	const minutes = Math.floor((ms % 3600000) / 60000).toString();
	const seconds = Math.floor(((ms % 360000) % 60000) / 1000).toString();
	const milliseconds = Math.floor(ms % 1000).toString();
	return `${hours.padStart(2, "0")}:${minutes.padStart(
		2,
		"0"
	)}:${seconds.padStart(2, "0")},${milliseconds}`;
}
