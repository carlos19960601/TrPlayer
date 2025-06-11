import settings from "@main/settings";
import log from "electron-log/main";
import path from "path";

log.initialize({ preload: true });

log.transports.console.level = "debug";

log.transports.file.level = "info";
log.transports.file.resolvePathFn = () =>
  path.join(settings.libraryPath(), "logs", "main.log");
log.errorHandler.startCatching();

export default log;
