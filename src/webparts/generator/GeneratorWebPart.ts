import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'GeneratorWebPartStrings';
import Generator from './components/Generator';
import { IGeneratorProps } from './components/IGeneratorProps';
import './components/page.css';

export interface IGeneratorWebPartProps {
  description: string;
  userRole?: 'admin' | 'contributor' | 'auto';
}

export default class GeneratorWebPart extends BaseClientSideWebPart<IGeneratorWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    this._applyFullWidth();

    const element: React.ReactElement<IGeneratorProps> = React.createElement(
      Generator,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        userRole: this.properties.userRole || 'auto',
        spHttpClient: this.context.spHttpClient,
        siteUrl: this.context.pageContext.web.absoluteUrl
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private _applyFullWidth(): void {
    // 1. Inject global stylesheet for full-bleed SharePoint canvas support
    const styleId = 'generator-spfx-full-bleed-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        .CanvasZoneContainer,
        .CanvasZone,
        .CanvasSection,
        .CanvasSection-xl12,
        .CanvasControl,
        .ControlZone,
        .ControlZone--control,
        div[data-automation-id="CanvasZone"],
        div[data-automation-id="CanvasSection"],
        div[data-automation-id="CanvasControl"],
        div[data-automation-id="CanvasControl-inner"],
        #workbenchPageContent,
        .SPCanvas,
        .SPCanvas-canvas {
          max-width: 100% !important;
          width: 100% !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
        }

        /* SharePoint page chrome override */
        .spAppAndPropertyPanelContainer .sp-appBar.spDeThemeAppBar,
        spAppAndPropertyPanelContainer .sp-appBar.spDeThemeAppBar,
        .mainHeader-116.mainHeader-116.mainHeader-116.mainHeader-116.mainHeader-116,
        .commandBarWrapper .ms-CommandBar,
        .s_Yo8kY_SIvUI,
        .s_fH4eG_SIvUI,
        .c_1avbf_St4iq,
        .mainHeader-237.mainHeader-237.mainHeader-237.mainHeader-237.mainHeader-237 {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    // 2. Direct DOM override on web part container & parent canvas wrappers
    if (this.domElement) {
      this.domElement.style.width = '100%';
      this.domElement.style.maxWidth = '100%';
      this.domElement.style.margin = '0';
      this.domElement.style.padding = '0';

      try {
        let el: HTMLElement | null = this.domElement.parentElement;
        while (el && el !== document.body) {
          if (
            el.classList.contains('CanvasZoneContainer') ||
            el.classList.contains('CanvasZone') ||
            el.classList.contains('CanvasSection') ||
            el.classList.contains('ControlZone') ||
            el.classList.contains('CanvasControl') ||
            (el.getAttribute('data-automation-id') && el.getAttribute('data-automation-id')!.indexOf('Canvas') !== -1) ||
            el.id === 'workbenchPageContent'
          ) {
            el.style.maxWidth = '100%';
            el.style.width = '100%';
            el.style.marginLeft = '0';
            el.style.marginRight = '0';
            el.style.paddingLeft = '0';
            el.style.paddingRight = '0';
          }
          el = el.parentElement;
        }
      } catch {
        // Safe fallback if DOM hierarchy traversal is restricted
      }
    }
  }

  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then(message => {
      this._environmentMessage = message;
    });
  }



  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
            case 'TeamsModern':
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              environmentMessage = strings.UnknownEnvironment;
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneDropdown('userRole', {
                  label: 'User Role Mode',
                  options: [
                    { key: 'auto', text: 'Auto (Detect from logged-in user)' },
                    { key: 'admin', text: 'Admin (Sai Naik)' },
                    { key: 'contributor', text: 'Coordinator / Contributor (Anushka R.)' }
                  ],
                  selectedKey: this.properties.userRole || 'auto'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
