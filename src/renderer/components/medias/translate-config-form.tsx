import { LANGUAGES } from "@/constants";
import { useAiCommand } from "@/renderer/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Button,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@renderer/components/ui";
import { t } from "i18next";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const TranslateConfigForm = (props: {
	onSubmit: (data: TranslateConfigType) => void;
}) => {
	const { llmProviders } = useAiCommand();
	const translateConfigFormSchema = z.object({
		providerId: z.string(),
		targetLanguage: z.string(),
		modelId: z.string(),
	});

	const form = useForm<z.infer<typeof translateConfigFormSchema>>({
		resolver: zodResolver(translateConfigFormSchema),
		values: {
			providerId: "openrouter",
			targetLanguage: "zh-CN",
			modelId: "deepseek/deepseek-chat:free",
		},
	});

	const selectedProviderId = form.watch("providerId");
	const selectedProviderModels =
		llmProviders.find(
			(llmProvider) => llmProvider.providerId === selectedProviderId,
		)?.models || [];

	if (selectedProviderModels.length > 0) {
		form.setValue("modelId", selectedProviderModels[0].id);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(props.onSubmit)}>
				<div className="flex flex-col gap-4">
					<FormField
						control={form.control}
						name="providerId"
						render={({ field }) => {
							return (
								<FormItem>
									<FormLabel>{t("translation.service")}</FormLabel>
									<Select
										value={field.value}
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Select a provider" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{llmProviders.map((llmProvider) => (
												<SelectItem
													value={llmProvider.providerId}
													key={llmProvider.providerId}
												>
													{llmProvider.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</FormItem>
							);
						}}
					/>

					<FormField
						control={form.control}
						name="targetLanguage"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t("translation.targetLanguage")}</FormLabel>
								<Select value={field.value} onValueChange={field.onChange}>
									<FormControl>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select a language" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{LANGUAGES.map((language) => (
											<SelectItem value={language.code} key={language.code}>
												{language.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="modelId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t("translation.model")}</FormLabel>
								<Select value={field.value} onValueChange={field.onChange}>
									<FormControl>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select a model" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{selectedProviderModels.map((model) => (
											<SelectItem value={model.id} key={model.id}>
												{model.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormItem>
						)}
					/>

					<Button type="submit">{t("translate")}</Button>
				</div>
			</form>
		</Form>
	);
};
