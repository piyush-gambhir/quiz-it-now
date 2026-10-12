import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';

const config = [
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    // New in eslint-plugin-react-hooks via eslint-config-next 16.4: flags existing code.
    rules: { 'react-hooks/set-state-in-effect': 'warn' },
  },
];

export default config;
