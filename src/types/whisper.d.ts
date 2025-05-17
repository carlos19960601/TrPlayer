interface WhisperResult {
  systeminfo: string
  model: WhisperModel
  params: WhisperParams
  result: Result
  transcription: WhisperTranscription[]
}

interface WhisperModel {
  type: string
  multilingual: boolean
  vocab: number
  audio: WhisperAudio
  text: WhisperText
  mels: number
  ftype: number
}

interface WhisperAudio {
  ctx: number
  state: number
  head: number
  layer: number
}

interface WhisperText {
  ctx: number
  state: number
  head: number
  layer: number
}

interface WhisperParams {
  model: string
  language: string
  translate: boolean
}

interface Result {
  language: string
}

interface WhisperTranscription {
  timestamps: Timestamps
  offsets: Offsets
  text: string
}

interface Timestamps {
  from: string
  to: string
}

interface Offsets {
  from: number
  to: number
}
