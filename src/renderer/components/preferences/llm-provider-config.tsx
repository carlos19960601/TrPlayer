import { AppSettingsProviderContext } from "@/renderer/context";
import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "i18next";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import PasswordInput from "../originui/password-input";
import {
	Button,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
} from "../ui";

const LlmProviderConfig = (props: { selectedProvider: LlmProviderType }) => {
	const { selectedProvider } = props;
	const { TrPlayerApp } = useContext(AppSettingsProviderContext);

	const llmProviderShape = {
		baseUrl: z
			.string()
			.url(t("form.field.url", { field: t("models.llmProvider.baseUrl") })),
		apiKey: z.string().min(1, {
			message: t("form.field.required", {
				field: t("models.llmProvider.apiKey"),
			}),
		}),
	};
	if (selectedProvider.providerId === "ollama") {
		delete llmProviderShape.apiKey;
	}
	const llmProviderConfigFormSchema = z.object(llmProviderShape);

	const form = useForm<z.infer<typeof llmProviderConfigFormSchema>>({
		resolver: zodResolver(llmProviderConfigFormSchema),
		values: {
			baseUrl: selectedProvider.baseUrl || "",
			apiKey: selectedProvider.apiKey || "",
		},
	});

	const handleApply = (data: z.infer<typeof llmProviderConfigFormSchema>) => {
		if (!selectedProvider.id) {
			TrPlayerApp.llmProviders
				.create({
					providerId: selectedProvider.providerId,
					name: selectedProvider.name,
					baseUrl: data.baseUrl,
					apiKey: data.apiKey,
				})
				.then(() => {
					toast.success("models.llmProvider.created");
				})
				.catch((error) => {
					toast.error(error.message);
				});
		} else {
			TrPlayerApp.llmProviders
				.update(selectedProvider.id, {
					baseUrl: data.baseUrl,
					apiKey: data.apiKey,
				})
				.then(() => {
					toast.success("models.llmProvider.updated");
				})
				.catch((error) => {
					toast.error(error.message);
				});
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleApply)}>
				<div className="flex flex-col gap-4">
					<FormField
						control={form.control}
						name="baseUrl"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t("provider.baseUrl")}</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder={selectedProvider.baseUrlPlaceholder}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{selectedProvider.providerId !== "ollama" && (
						<FormField
							control={form.control}
							name="apiKey"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t("provider.apiKey")}</FormLabel>
									<FormControl>
										<PasswordInput
											{...field}
											placeholder={selectedProvider.apiKeyPlaceholder}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}

					<Button type="submit">{t("apply")}</Button>
				</div>
			</form>
		</Form>
	);
};

export default LlmProviderConfig;
