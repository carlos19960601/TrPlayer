type TranscriptionType = {
  id: string;
  targetId: string;
  targetType: string;
  state: "pending" | "processing" | "finished";
  model: string;
  language: string;
  recognitionResult?: RecognitionResult;
  filename: string;
  coverUrl: string;
  createdAt: Date;
}

type Timeline = TimelineEntry[];

type TimelineEntry = {
  text: string;
  startTime: number;
  endTime: number;
}

type RecognitionResult = {
  language: string;
  timeline: Timeline;
}

