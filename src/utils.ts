import { AudioFormats, VideoFormats } from "./constants"

export const determineMediaType = (filepath: string): MediaType => {
  if (AudioFormats.some((ext) => filepath.endsWith(ext))) return "Audio" as MediaType
  if (VideoFormats.some((ext) => filepath.endsWith(ext))) return "Video" as MediaType

  return "Unknown" as MediaType
}