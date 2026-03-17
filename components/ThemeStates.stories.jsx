import { useEffect, useMemo, useState } from 'react';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { useTheme } from '@/context/ThemeContext';

const ThemeStatePreview = () => {
  const { theme, cycleTheme } = useTheme();
  const [state, setState] = useState('rest');

  useEffect(() => {
    const interval = setInterval(() => {
      setState((current) => {
        if (current === 'rest') return 'hover';
        if (current === 'hover') return 'active';
        return 'rest';
      });
    }, 1600);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      cycleTheme();
    }, 4800);
    return () => clearInterval(interval);
  }, [cycleTheme]);

  const stateClass = useMemo(() => {
    if (state === 'hover') return 'is-hover';
    if (state === 'active') return 'is-active';
    return '';
  }, [state]);

  const focusClass = state === 'active' ? 'is-focus' : stateClass;

  return (
    <div className={`rounded-xl border ${theme.utilities.border} ${theme.utilities.bgSurface} p-6 space-y-8`}>
      <div className="space-y-2">
        <p className={`text-[10px] uppercase tracking-[0.4em] ${theme.utilities.textMuted}`}>Theme</p>
        <h2 className={`text-xl font-bold uppercase tracking-[0.2em] ${theme.utilities.textPrimary}`}>{theme.label}</h2>
        <p className={`text-xs uppercase tracking-[0.3em] ${theme.utilities.textMuted}`}>State: {state}</p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button className={`${theme.components.buttonPrimary} ${stateClass} px-10 py-4 text-[10px] uppercase tracking-[0.3em] font-bold`}>
          Primary
        </button>
        <button className={`${theme.components.buttonOutline} ${stateClass} px-10 py-4 text-[10px] uppercase tracking-[0.3em] font-bold`}>
          Outline
        </button>
        <button className={`theme-link ${stateClass} text-[10px] uppercase tracking-[0.3em] font-bold`}>
          Link Style
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button className={`border ${theme.utilities.border} ${theme.utilities.textPrimary} theme-hover-bg-muted theme-hover-text-primary ${stateClass} px-6 py-3 text-[10px] uppercase tracking-[0.3em] font-bold flex items-center gap-2`}>
          <HiOutlineShoppingBag className="text-base" />
          Icon Button
        </button>
        <input
          className={`theme-input border px-5 py-3 text-[11px] uppercase tracking-[0.25em] outline-none ${focusClass}`}
          placeholder="Input Field"
        />
        <select className={`theme-input border px-5 py-3 text-[11px] uppercase tracking-[0.25em] outline-none ${focusClass}`}>
          <option>Option One</option>
          <option>Option Two</option>
        </select>
      </div>
    </div>
  );
};

const meta = {
  title: 'Theme/States',
  component: ThemeStatePreview
};

export default meta;

export const Overview = {
  render: () => <ThemeStatePreview />
};
