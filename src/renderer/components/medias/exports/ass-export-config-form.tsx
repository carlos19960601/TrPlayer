import { ExportLanguages } from "@/constants";
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

export const AssExportConfigForm = (props: {
	onSubmit: (data: AssExportConfigType) => void;
}) => {
	const { onSubmit } = props;

	const assExportConfigFormSchema = z.object({
		language: z.string(),
	});

	const form = useForm<z.infer<typeof assExportConfigFormSchema>>({
		resolver: zodResolver(assExportConfigFormSchema),
		values: {
			language: "multi",
		},
	});

	return (
		<Form {...form}>
			<form className="py-4" onSubmit={form.handleSubmit(onSubmit)}>
				<div className="flex flex-col gap-4">
					<div className="flex justify-between items-center">
						<div className="flex flex-col">
							<p className="font-bold">{t("export.language")}</p>
							<p className="text-muted-foreground text-xs">
								{t("export.languageHint")}
							</p>
						</div>
						<FormField
							control={form.control}
							name="language"
							render={({ field }) => (
								<FormItem>
									<Select value={field.value} onValueChange={field.onChange}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a format" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{ExportLanguages.map((lang) => (
												<SelectItem key={lang} value={lang}>
													{t(`export.languages.${lang}`)}
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
