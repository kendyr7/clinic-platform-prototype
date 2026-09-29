import '@mantine/core/styles.css';
import './styles.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createTheme, MantineProvider } from '@mantine/core';
import App from './App';

const theme = createTheme({
  primaryColor: 'blue',
  primaryShade: 6,
  fontFamily: 'Arial, Helvetica, sans-serif',
  headings: { fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: '600' },
  defaultRadius: 'sm',
  fontSizes: { xs: '0.75rem', sm: '0.8125rem', md: '0.875rem', lg: '1rem', xl: '1.125rem' },
  colors: {
    grape: ['#fbf4fc', '#f6e6f9', '#ebc9f1', '#dda7e7', '#cd7fda', '#bc56cc', '#ad3bc1', '#9c36b5', '#842a99', '#6e2380'],
  },
  shadows: { sm: '0 1px 3px rgba(76, 35, 87, 0.08), 0 1px 2px rgba(76, 35, 87, 0.04)' },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <App />
    </MantineProvider>
  </StrictMode>,
);
