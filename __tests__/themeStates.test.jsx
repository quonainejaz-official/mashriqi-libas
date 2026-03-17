import fs from 'fs';
import path from 'path';
import { themes } from '@/lib/themeConfig';

let cachedCss = '';
let rootVars = {};

const injectGlobals = () => {
  if (document.getElementById('theme-globals')) {
    return;
  }
  const cssPath = path.join(process.cwd(), 'app', 'globals.css');
  const css = fs.readFileSync(cssPath, 'utf8');
  const cleaned = css
    .split('\n')
    .filter((line) => !line.trim().startsWith('@tailwind') && !line.trim().startsWith('@import'))
    .join('\n');
  cachedCss = cleaned;
  const rootMatch = cleaned.match(/:root\s*\{([\s\S]*?)\}/);
  if (rootMatch) {
    rootVars = rootMatch[1]
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith('--'))
      .reduce((acc, line) => {
        const [key, value] = line.split(':').map((part) => part.trim());
        if (key && value) {
          acc[key.replace('--', '').replace(';', '')] = value.replace(';', '');
        }
        return acc;
      }, {});
  }
  const style = document.createElement('style');
  style.id = 'theme-globals';
  style.innerHTML = cleaned;
  document.head.appendChild(style);
};

const resolveVar = (value, themeVars, depth = 0) => {
  if (!value || depth > 8) return value;
  const match = value.match(/var\(--([^)]+)\)/);
  if (!match) return value.trim();
  const token = match[1];
  if (themeVars[token]) {
    return themeVars[token];
  }
  if (rootVars[token]) {
    return resolveVar(rootVars[token], themeVars, depth + 1);
  }
  return value.trim();
};

const getRuleValue = (selector, property) => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`${escaped}\\s*\\{[^}]*?\\n\\s*${property}\\s*:\\s*([^;]+);`, 'm');
  const match = cachedCss.match(regex);
  return match ? match[1].trim() : '';
};

describe('theme states', () => {
  beforeAll(() => {
    injectGlobals();
  });

  const themeKeys = ['dark', 'light', 'gold'];

  themeKeys.forEach((themeKey) => {
    test(`${themeKey} theme button hover uses theme variables`, () => {
      const theme = themes[themeKey];
      const bgRule = getRuleValue('.theme-button-primary.is-hover', 'background-color');
      const borderRule = getRuleValue('.theme-button-primary.is-hover', 'border-color');
      const textRule = getRuleValue('.theme-button-primary.is-hover', 'color');

      expect(resolveVar(bgRule, theme.cssVars)).toBe(theme.cssVars['color-bg-contrast']);
      expect(resolveVar(borderRule, theme.cssVars)).toBe(theme.cssVars['color-bg-contrast']);
      expect(resolveVar(textRule, theme.cssVars)).toBe(theme.cssVars['color-button-text']);
    });

    test(`${themeKey} theme outline hover uses theme variables`, () => {
      const theme = themes[themeKey];
      const bgRule = getRuleValue('.theme-button-outline.is-hover', 'background-color');
      const borderRule = getRuleValue('.theme-button-outline.is-hover', 'border-color');
      const textRule = getRuleValue('.theme-button-outline.is-hover', 'color');

      expect(resolveVar(bgRule, theme.cssVars)).toBe(theme.cssVars['color-bg-contrast']);
      expect(resolveVar(borderRule, theme.cssVars)).toBe(theme.cssVars['color-bg-contrast']);
      expect(resolveVar(textRule, theme.cssVars)).toBe(theme.cssVars['color-text-inverse']);
    });

    test(`${themeKey} theme link hover uses theme variables`, () => {
      const theme = themes[themeKey];
      const textRule = getRuleValue('.theme-link.is-hover', 'color');
      expect(resolveVar(textRule, theme.cssVars)).toBe(theme.cssVars['color-accent']);
    });

    test(`${themeKey} theme input focus uses theme variables`, () => {
      const theme = themes[themeKey];
      const borderRule = getRuleValue('.theme-input.is-focus', 'border-color');
      const bgRule = getRuleValue('.theme-input', 'background-color');
      expect(resolveVar(borderRule, theme.cssVars)).toBe(theme.cssVars['color-focus']);
      expect(resolveVar(bgRule, theme.cssVars)).toBe(theme.cssVars['color-input-bg']);
    });
  });
});
