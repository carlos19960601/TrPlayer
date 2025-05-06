type TranscriptionType = {
  id: string;
  targetId: string;
  targetType: string;
  state: "pending" | "processing" | "finished";
  model: string;
  language?: string;
  result: AlignmentResult;
}

type AlignmentResult = {
  timeline: Timeline;
}


type Timeline = TimelineEntry[];

type TimelineEntry = {
  text: string;
  startTime: number;
  endTime: number;
}