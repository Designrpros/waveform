// src/types/styled.d.ts
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    body: string;
    text: string;
    subtleText: string;
    cardBg: string;
    headerBg: string;
    borderColor: string;
    buttonBg: string;
    buttonHoverBg: string;
    backgroundImage: string;
    imageOpacity: string;
    accentGradient: string;
    accentColor: string;
    secondaryButtonBorderColor?: string; // Added this
    primaryButtonTextColor?: string; // Added this
  }
}