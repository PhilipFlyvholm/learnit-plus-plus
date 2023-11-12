import base from "data-text:./main.css";
import learnitpp from "./lpp/styles";
import hacker from "data-text:./hacker/main.css";
import retro from "data-text:./retro/main.css";
export type theme = { css: string; hasDarkMode: boolean };
export const themes: { [key: string]: theme } = {
  "Features only": { css: "", hasDarkMode: false },
  "LearnIT++": { css: learnitpp, hasDarkMode: true },
  "Hacker mode": { css: hacker, hasDarkMode: false },
  "Retro theme": { css: retro, hasDarkMode: false },
};

export const defaultTheme = "LearnIT++";

export const getTheme = (
  theme: string | null = null
): theme => {
  console.log("Getting theme", theme);
  
  if (!theme) theme = defaultTheme;
  return {
    css: base + themes[theme].css,
    hasDarkMode: themes[theme].hasDarkMode,
  };
};
