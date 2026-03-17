import '../app/globals.css';
import { ThemeProvider } from '../context/ThemeContext';

export const decorators = [
  (Story) => (
    <ThemeProvider>
      <div className="min-h-screen theme-bg-page theme-text-primary p-6">
        <Story />
      </div>
    </ThemeProvider>
  )
];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' }
};
