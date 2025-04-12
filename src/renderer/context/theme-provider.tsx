import {
	PropsWithChildren,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";

type ThemeProviderState = {
	theme: ThemeType;
	colorScheme?: Omit<ThemeType, "system">;
	setTheme: (theme: ThemeType) => void;
};

const initialState: ThemeProviderState = {
	theme: "system",
	setTheme: () => null,
};

export const ThemeProviderContext =
	createContext<ThemeProviderState>(initialState);

type ThemeProviderProps = {
	defaultTheme?: ThemeType;
	storageKey?: string;
};

export const ThemeProvider = ({
	children,
	defaultTheme = "system",
	storageKey = "vite-ui-theme",
	...props
}: PropsWithChildren<ThemeProviderProps>) => {
	const [theme, setTheme] = useState<ThemeType>(
		(localStorage.getItem(storageKey) as ThemeType) || defaultTheme,
	);
	const [colorScheme, setColorScheme] = useState<Omit<ThemeType, "system">>();

	useEffect(() => {
		const root = window.document.documentElement;

		root.classList.remove("light", "dark");

		setColorScheme(theme);
		root.classList.add(theme);
	}, [theme]);

	const value = {
		theme,
		colorScheme,
		setTheme: (theme: ThemeType) => {
			localStorage.setItem(storageKey, theme);
			setTheme(theme);
		},
	};
	return (
		<ThemeProviderContext.Provider {...props} value={value}>
			{children}
		</ThemeProviderContext.Provider>
	);
};

export const useTheme = () => {
	const context = useContext(ThemeProviderContext);

	if (context === undefined)
		throw new Error("useTheme must be used within a ThemeProvider");

	return context;
};
