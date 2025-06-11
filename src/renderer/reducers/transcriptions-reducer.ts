export const transcriptionsReducer = (transcriptions: TranscriptionType[], action: {
  type: "append" | "update" | "destroy" | "set",
  record?: Partial<TranscriptionType>;
  records?: Partial<TranscriptionType>[];
}) => {
  switch (action.type) {
    case "update":
      return transcriptions.map((transcription) => {
        if (transcription.id === action.record.id) {
          return Object.assign(transcription, action.record)
        }
        return transcription
      })
    case "destroy":
      return transcriptions.filter((transcription) => transcription.id !== action.record.id)
    case "set":
      return action.records || []
    default:
      throw Error(`Unknown action: ${action.type}`);
  }
}