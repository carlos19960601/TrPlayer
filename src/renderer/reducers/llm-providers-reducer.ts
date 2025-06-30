export const llmProvidersReducer = (llmProviders: LlmProviderType[], action: {
  type: "create" | "update" | "set",
  record?: LlmProviderType;
  records?: LlmProviderType[];
}) => {
  switch (action.type) {
    case "create":
    case "update":
      return llmProviders.map((llmProvider) => {
        if (llmProvider.providerId === action.record.providerId) {
          return Object.assign(llmProvider, action.record);
        } else {
          return llmProvider;
        }
      });
    case "set":
      return action.records || [];
    default:
      throw Error(`Unknown action: ${action.type}`);
  }
}