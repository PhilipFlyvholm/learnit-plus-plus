import base from "./main.css?inline";
import learnitpp from "./lpp/styles";

export const themes: { [key: string]: { css: string; hasDarkMode: boolean } } =
  {
    "Features only": { css: "", hasDarkMode: false },
    "LearnIT++": { css: learnitpp, hasDarkMode: true },
  };

export const defaultTheme = "LearnIT++";

export const getTheme = (
  theme: string | null
): { css: string; hasDarkMode: boolean } => {
  if (!theme) theme = defaultTheme;
  return {
    css: base + themes[theme].css,
    hasDarkMode: themes[theme].hasDarkMode,
  };
};
