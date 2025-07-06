import { VideoFormats } from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { SelectValue } from "@radix-ui/react-select";
import {
	Button,
	DialogFooter,
	Form,
	FormControl,
	FormField,
	FormItem,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@renderer/components/ui";
import { t } from "i18next";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const VideoExportConfigForm = (props: {
	onSubmit: (data: MediaExportConfigType) => void;
}) => {
	const { onSubmit } = props;

	const exportConfigFormSchema = z.object({
		format: z.string(),
	});

	const form = useForm<z.infer<typeof exportConfigFormSchema>>({
		resolver: zodResolver(exportConfigFormSchema),
		values: {
			format: "mp4",
		},
	});

	return (
		<Form {...form}>
			<form className="py-4" onSubmit={form.handleSubmit(onSubmit)}>
				<div className="flex flex-col gap-4">
					<div className="flex justify-between items-center">
						<div className="flex flex-col">
							<p className="font-bold">{t("media.format")}</p>
							<p className="text-muted-foreground text-xs">
								{t("media.formatHint")}
							</p>
						</div>
						<FormField
							control={form.control}
							name="format"
							render={({ field }) => (
								<FormItem>
									<Select value={field.value} onValueChange={field.onChange}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a format" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{VideoFormats.map((format) => (
												<SelectItem key={format} value={format}>
													{format}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</FormItem>
							)}
						/>
					</div>
					<DialogFooter className="">
						<DialogClose asChild>
							<Button type="button" variant="secondary">
								{t("cancel")}
							</Button>
						</DialogClose>
						<Button type="submit">{t("export.self")}</Button>
					</DialogFooter>
				</div>
			</form>
		</Form>
	);
};
