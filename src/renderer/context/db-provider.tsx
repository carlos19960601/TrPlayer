import log from "electron-log/renderer";
import { PropsWithChildren, createContext, useEffect, useState } from "react";

const logger = log.scope("db-provider.tsx");

type DbStateEnum =
	| "connected"
	| "connecting"
	| "error"
	| "disconnected"
	| "reconnecting";

type DbProviderState = {
	state: DbStateEnum;
};

const initialState: DbProviderState = {
	state: "disconnected",
};

export const DbProviderContext = createContext<DbProviderState>(initialState);

export const DbProvider = ({ children }: PropsWithChildren) => {
	const [state, setState] = useState<DbStateEnum>("disconnected");
	const TrPlayer = window.__TRPLAYER_APP__;
	const [path, setPath] = useState();
	const [error, setError] = useState();

	useEffect(() => {
		logger.info(
			"--- db state changed ---\n",
			`state: ${state};\n`,
			`path: ${path};\n`,
			`error: ${error};\n`,
		);

		if (state === "disconnected") {
			setTimeout(() => {
				connect();
			}, 1000);
		}
	}, [state]);

	const connect = async () => {
		if (["connected", "connecting"].includes(state)) return;
		logger.info("--- connecting db ---");
		setState("connecting");

		return TrPlayer.db
			.connect()
			.then((_db) => {
				setState(_db.state);
				setPath(_db.path);
				setError(_db.error);
			})
			.catch((err) => {
				setState("error");
				setError(err.message);
			});
	};

	return (
		<DbProviderContext.Provider
			value={{
				state,
			}}
		>
			{children}
		</DbProviderContext.Provider>
	);
};
