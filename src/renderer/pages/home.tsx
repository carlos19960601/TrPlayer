import ChooseLocalFile from "@renderer/components/medias/choose-local-file";
import { TranscriptionsComponent } from "@renderer/components/transcriptions";

const HomePage = () => {
	return (
		<div className="flex flex-col  w-5/6 mx-auto gap-10">
			<div className="grid select-none">
				<ChooseLocalFile />
			</div>

			<TranscriptionsComponent />
		</div>
	);
};

export default HomePage;
