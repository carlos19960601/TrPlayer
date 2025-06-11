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
	addDblistener?: (callback: (event: CustomEvent) => void) => void;
	removeDbListener?: (callback: (event: CustomEvent) => void) => void;
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

	const addDblistener = (callback: (event: CustomEvent) => void) => {
		document.addEventListener("db-on-transaction", callback);
	};

	const removeDbListener = (callback: (event: CustomEvent) => void) => {
		document.removeEventListener("db-on-transaction", callback);
	};

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

	useEffect(() => {
		if (state === "connected") {
			TrPlayer.db.onTransaction((_event, state) => {
				logger.debug("db-on-transaction", state);

				const event = new CustomEvent("db-on-transaction", { detail: state });
				document.dispatchEvent(event);
			});
		}

		return () => {
			TrPlayer.db.removeListeners();
		};
	}, [state]);

	return (
		<DbProviderContext.Provider
			value={{
				state,
				addDblistener,
				removeDbListener,
			}}
		>
			{children}
		</DbProviderContext.Provider>
	);
};
