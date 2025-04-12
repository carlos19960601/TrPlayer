import { PagePlaceholder } from "@renderer/components/misc/page-placeholder";

const ErrorPage = () => {
  return (
    <div className="h-screen px-4 py-6 lg:px-8">
      <PagePlaceholder placeholder={"something wrong happen"} />
    </div>
  );
};

export default ErrorPage;
