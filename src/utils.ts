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


/**
 * 格式化数字，保留指定位数，不足则前补0
 * @param {number|string} num - 输入的数字或字符串
 * @param {number} digits - 要保留的位数
 * @param {boolean} [strict=true] - 是否严格处理，只保留纯数字部分
 * @returns {string}
 */
function formatDigits(num: string | number, digits: number, strict = false) {
	let str = num.toString();

	if (strict) {
		// 快速提取所有数字字符
		const digitsOnly = [];
		for (let i = 0; i < str.length && digitsOnly.length < digits; i++) {
			const ch = str[i];
			if (ch >= '0' && ch <= '9') digitsOnly.push(ch);
		}
		str = digitsOnly.join('');
	}

	// 截取最多 digits 位
	const truncated = str.slice(0, digits);

	// 补前导 0（使用 padStart）
	return truncated.padStart(digits, '0');

}

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

export function millisecondsToAssTimestamp(ms: number) {
	const hours = Math.floor(ms / 3600000).toString();
	const minutes = Math.floor((ms % 3600000) / 60000).toString();
	const seconds = Math.floor(((ms % 360000) % 60000) / 1000).toString();
	const milliseconds = Math.floor(ms % 1000).toString();
	return `${hours}:${formatDigits(minutes, 2)}:${formatDigits(seconds, 2)}.${formatDigits(milliseconds, 2)}`;
}


const scriptHeader = `[Script Info]

ScriptType: v4.00+
WrapStyle: 0
Collisions: Reverse
PlayResX: 384
PlayResY: 288
Timer: 100.0000
ScaledBorderAndShadow: no
Last Style Storage: Default
Video Aspect Ratio: 0
Video Zoom: 6
Video Position: 0

[V4+ Styles]
Format: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding
Style: Default,HONOR Sans CN,20,&H0080FFFF,&H000000FF,&H00000000,&H00000000,-1,0,0,0,100,100,1,0,1,2,0,2,1,1,6,1
Style: Secondary,Helvetica,12,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,2,0,2,1,1,6,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

export function timelineToAss(recognitionResult: RecognitionResult, language: ExportLanguageType): string {
	let result = scriptHeader
	if (language === "original" || language === "multi") {
		const transcriptContent = recognitionResult.timeline.map((t) => {
			return `Dialogue: 1,${millisecondsToAssTimestamp(t.startTime)},${millisecondsToAssTimestamp(t.endTime)},Secondary,,0,0,0,,${t.text}`
		}).join("\n")

		result += transcriptContent
	}

	if (language === "multi") {
		result += "\n"
	}

	if (language === "translated" || language === "multi") {
		if (recognitionResult.translationLanguage) {
			const translationContent = recognitionResult.timeline.map((t) => {
				return `Dialogue: 1,${millisecondsToAssTimestamp(t.startTime)},${millisecondsToAssTimestamp(t.endTime)},Default,,0,0,0,,${t.translation}`
			}).join("\n")
			result += translationContent
		}
	}

	return result
}