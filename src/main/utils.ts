import { createHash } from "crypto";
import { createReadStream } from "fs";

export const hashFile = (path: string, options: { algo: string }): Promise<string> => {
  const algo = options.algo || "md5"
  return new Promise((resolve, reject) => {
    const hash = createHash(algo)
    const stream = createReadStream(path)
    stream.on("error", reject)
    stream.on("data", (chunk) => hash.update(chunk))
    stream.on("end", () => resolve(hash.digest("hex")))
  })
};
