import { ModelProviderContext } from "@/renderer/context/model-provider";
import { cn } from "@/renderer/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Button,
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	PingPoint,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@renderer/components/ui";
import { t } from "i18next";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Progress } from "../ui/progress";

const transcriptionSchema = z.object({
	language: z.string(),
	model: z.string(),
});

export const TranscriptionCreateForm = (props: {
	onSubmit: (data: z.infer<typeof transcriptionSchema>) => void;
	onCancel?: () => void;
	transcribing: boolean;
	transcribingProgress: number;
	transcribingOutput: string;
}) => {
	const {
		transcribing = false,
		transcribingProgress,
		transcribingOutput,
		onSubmit,
		onCancel,
	} = props;
	const { models } = useContext(ModelProviderContext);

	const languages = [
		{ label: t("language.auto"), value: "auto" },
		{ label: t("language.en"), value: "en" },
		{ label: t("language.zh"), value: "zh" },
	];

	const form = useForm<z.infer<typeof transcriptionSchema>>({
		resolver: zodResolver(transcriptionSchema),
		values: {
			language: "auto",
			model: "ggml-tiny",
		},
	});

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="flex flex-col gap-4">
					<FormField
						control={form.control}
						name="language"
						render={({ field }) => (
							<FormItem>
								<div className="flex items-center justify-between">
									<FormLabel>{t("model.language")}</FormLabel>
									<Popover modal={true}>
										<PopoverTrigger asChild>
											<FormControl>
												<Button variant="outline" className="w-32">
													{field.value
														? languages.find(
																(language) => language.value === field.value,
															)?.label
														: "Select language"}
													<ChevronsUpDownIcon className="opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent>
											<Command>
												<CommandInput
													placeholder={t("language.searchPlaceholder")}
													className="h-9"
												/>
												<CommandList>
													<CommandEmpty>
														{t("language.emptyResults")}
													</CommandEmpty>
													<CommandGroup>
														{languages.map((language) => (
															<CommandItem
																value={language.label}
																key={language.value}
																onSelect={() => {
																	form.setValue("language", language.value);
																}}
															>
																{language.label}
																<CheckIcon
																	className={cn(
																		"ml-auto",
																		language.value === field.value
																			? "opacity-100"
																			: "opacity-0",
																	)}
																/>
															</CommandItem>
														))}
													</CommandGroup>
												</CommandList>
											</Command>
										</PopoverContent>
									</Popover>
								</div>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="model"
						render={({ field }) => (
							<FormItem>
								<div className="flex items-center justify-between">
									<FormLabel>{t("model.transcribe")}</FormLabel>
									<Select value={field.value} onValueChange={field.onChange}>
										<FormControl>
											<SelectTrigger className="w-32">
												<SelectValue placeholder="Select a fruit" />
											</SelectTrigger>
										</FormControl>

										<SelectContent>
											{models.map((model) => (
												<SelectItem value={model.value} key={model.value}>
													{model.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</FormItem>
						)}
					/>

					<TranscribeProgress
						transcribing={transcribing}
						transcribingProgress={transcribingProgress}
						transcribingOutput={transcribingOutput}
					/>

					<div className="flex justify-end space-x-4">
						{onCancel && (
							<Button variant="outline" onClick={onCancel}>
								{t("cancel")}
							</Button>
						)}
						<Button type="submit">{t("continue")}</Button>
					</div>
				</div>
			</form>
		</Form>
	);
};

const TranscribeProgress = (props: {
	transcribing: boolean;
	transcribingProgress: number;
	transcribingOutput?: string;
}) => {
	const { transcribing, transcribingProgress, transcribingOutput } = props;

	if (!transcribing) return null;

	return (
		<div>
			<div className="flex items-center space-x-4 mb-2">
				<PingPoint colorClassName="bg-yellow-500" />
				<span>{t("transcribing")}</span>
			</div>
			{transcribingProgress > 0 && <Progress value={transcribingProgress} />}
			{transcribingOutput && (
				<div>
					<code>{transcribingOutput}</code>
				</div>
			)}
		</div>
	);
};
