import { AppSettingsProviderContext } from "@renderer/context";
import { PropsWithChildren, createContext, useContext, useState } from "react";

type MediaShadowProviderState = {
	media: AudioType | VideoType;
	decoded: boolean;
	decodeError: string;
};

export const MediaShadowProviderContext =
	createContext<MediaShadowProviderState>(null);

export const MediaShadowProvider = ({ children }: PropsWithChildren) => {
	const { TrPlayerApp } = useContext(AppSettingsProviderContext);

	const [media, setMedia] = useState<AudioType | VideoType>(null);
	const [decodeError, setDecodeError] = useState<string>(null);

	//  Player state
	const [decoded, setDecoded] = useState(false);

	return (
		<MediaShadowProviderContext.Provider
			value={{
				media,
				decoded,
				decodeError,
			}}
		>
			{children}
		</MediaShadowProviderContext.Provider>
	);
};
