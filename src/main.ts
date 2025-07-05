import log from "@main/logger";
import settings from "@main/settings";
import mainWindow from "@main/window";
import { BrowserWindow, app, protocol } from "electron";
import started from "electron-squirrel-startup";
import fs, { createReadStream, statSync } from "fs-extra";
import { getMimeType } from "./utils";

const logger = log.scope("main");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
	app.quit();
}

protocol.registerSchemesAsPrivileged([
	{
		scheme: "local",
		privileges: {
			standard: true,
			secure: true,
			stream: true,
			supportFetchAPI: true,
			codeCache: true,
		},
	},
]);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
	protocol.handle("local", (request) => {
		logger.debug("original url: ", request.url);
		const filepath = decodeURI(request.url).replace("local:", "");

		// 获取Range请求头
		const range = request.headers.get("range");

		const stats = statSync(filepath);
		const fileSize = stats.size;
		const mimeType = getMimeType(filepath);

		// 处理Range请求
		if (range) {
			const rangeMatch = range.match(/bytes=(\d+)-(\d*)/);
			if (rangeMatch) {
				const start = parseInt(rangeMatch[1], 10);
				const end = rangeMatch[2] ? parseInt(rangeMatch[2], 10) : fileSize - 1;

				// 确保范围有效
				if (start >= 0 && start < fileSize && end >= start && end < fileSize) {
					const contentLength = end - start + 1;
					const stream = createReadStream(filepath, { start, end });

					return new Response(stream as any, {
						status: 206, // Partial Content
						headers: {
							"Content-Type": mimeType,
							"Content-Length": contentLength.toString(),
							"Accept-Ranges": "bytes",
							"Content-Range": `bytes ${start}-${end}/${fileSize}`,
							"Cache-Control": "no-cache",
						},
					});
				}
			}
		}

		// 不是Range请求或Range无效，返回完整文件
		const stream = createReadStream(filepath);
		return new Response(stream as any, {
			status: 200,
			headers: {
				"Content-Type": mimeType,
				"Content-Length": fileSize.toString(),
				"Accept-Ranges": "bytes",
				"Cache-Control": "no-cache",
			},
		});
	});

	mainWindow.init();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		mainWindow.init();
	}
});

// Clean up cache folder before quit
app.on("before-quit", () => {
	try {
		fs.emptyDirSync(settings.cachePath());
	} catch (error) {
		// todo
	}
});
