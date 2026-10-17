import { SPHttpClient } from '@microsoft/sp-http';

export interface IGeneratorProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  userRole?: 'admin' | 'contributor' | 'auto';
  spHttpClient?: SPHttpClient;
  siteUrl?: string;
}
