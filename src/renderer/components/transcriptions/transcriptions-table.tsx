import { t } from "i18next";
import { TrashIcon } from "lucide-react";
import {
	Button,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui";

export const TranscriptionsTable = (props: {
	transcriptions: TranscriptionType[];
}) => {
	const { transcriptions } = props;
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="capitalize">
						{t("models.transcription.filename")}
					</TableHead>
					<TableHead className="capitalize">{t("actions")}</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{transcriptions.map((transcription) => (
					<TableRow key={transcription.id}>
						<TableCell>{transcription.filename}</TableCell>
						<TableCell>
							<div className="flex items-center">
								<Button title={t("delete")} variant="ghost">
									<TrashIcon className="h-4 w-4 text-destructive" />
								</Button>
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};
