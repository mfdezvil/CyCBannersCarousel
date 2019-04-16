import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';

import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { 
  IPropertyPaneConfiguration, 
  IPropertyPaneField, 
  IPropertyPaneDropdownProps, 
  PropertyPaneDropdown, 
  PropertyPaneTextField, 
  PropertyPaneToggle 
} from "@microsoft/sp-property-pane";

import * as strings from 'CyCBannersCarouselWebPartStrings';
import CyCBannersCarousel from './components/CyCBannersCarousel';
import { ICyCBannersCarouselProps } from './components/ICyCBannersCarouselProps';
import { IDropdownOption } from 'office-ui-fabric-react/lib/components/Dropdown';
import { ISPList } from './models/ISPList';
import { ISPColumn } from './models/ISPColumn';
import { PropertyPaneAsyncDropdown } from '../../controls/PropertyPaneAsyncDropdown/PropertyPaneAsyncDropdown';
import { update, get } from '@microsoft/sp-lodash-subset';
import { ListAccessManager } from './managers/ListAccessManager';

export interface ICyCBannersCarouselWebPartProps {
  listName: string;
  fieldTitle: string;
  fieldSubtitle: string;
  fieldImage: string;
  fieldURL: string;

  enableNavigation: boolean;
  enablePagination: boolean;
  enableAutoplay: boolean;
  delayAutoplay: number;
  disableAutoplayOnInteraction: boolean;
  slidesPerView: string;
  spaceBetweenSlides: string;
  enableLoop: boolean;
  imageAsBackground: boolean;
  speed: string;
  height: string;
}

export default class CyCBannersCarouselWebPart extends BaseClientSideWebPart<ICyCBannersCarouselWebPartProps> {

  private _lists: IDropdownOption[] = null;
  private _listFields: IDropdownOption[] = null;

  private fieldTitleDropDown: IPropertyPaneField<IPropertyPaneDropdownProps>;
  private fieldSubtitleDropDown: IPropertyPaneField<IPropertyPaneDropdownProps>;
  private fieldImageDropDown: IPropertyPaneField<IPropertyPaneDropdownProps>;
  private fieldURLDropDown: IPropertyPaneField<IPropertyPaneDropdownProps>;

  private listAccessManager: ListAccessManager= null;

  public render(): void {
    if(this.listAccessManager == null) {
      this.listAccessManager = new ListAccessManager(this.context.pageContext.web.absoluteUrl);
    }
    const element: React.ReactElement<ICyCBannersCarouselProps > = React.createElement(
      CyCBannersCarousel,
      {
        carouselSPConfig: {
          listName: this.properties.listName,
          fieldTitle: this.properties.fieldTitle,
          fieldSubtitle: this.properties.fieldSubtitle,
          fieldImage: this.properties.fieldImage,
          fieldURL: this.properties.fieldURL,
        },
        carouselOptions: {
          enableNavigation: this.properties.enableNavigation,
          enablePagination: this.properties.enablePagination,
          enableAutoplay: this.properties.enableAutoplay,
          delayAutoplay: this.properties.delayAutoplay,
          disableAutoplayOnInteraction: this.properties.disableAutoplayOnInteraction,
          slidesPerView: this.properties.slidesPerView,
          spaceBetweenSlides: this.properties.spaceBetweenSlides,
          enableLoop: this.properties.enableLoop,
          imageAsBackground: this.properties.imageAsBackground,
          speed: this.properties.speed,
          height: this.properties.height
        },
        listAccessManager: this.listAccessManager
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected get disableReactivePropertyChanges(): boolean {
    return true;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {

    this.initFieldDropdowns();

    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          displayGroupsAsAccordion: true,
          groups: [
            {
              groupName: strings.DataConfigurationGroupName,
              groupFields: [
                new PropertyPaneAsyncDropdown('listName', {
                  label: strings.ListFieldLabel,
                  loadOptions: this.loadLists.bind(this),
                  onPropertyChange: this.onListChange.bind(this),
                  selectedKey: this.properties.listName
                }),
                this.fieldTitleDropDown,
                this.fieldSubtitleDropDown,
                this.fieldImageDropDown,
                this.fieldURLDropDown
              ]
            },
            {
              groupName: strings.GeneralGroupName,
              isCollapsed: true,
              groupFields: [
                PropertyPaneToggle('enableNavigation', {
                  label: strings.EnableNavigation
                }),
                PropertyPaneToggle('enablePagination', {
                  label: strings.EnablePagination
                }),
                PropertyPaneTextField('slidesPerView', {
                  label: strings.SlidesPerWiew
                }), 
                PropertyPaneToggle('imageAsBackground', {
                  label: strings.UseImageAsBackground
                }),
              ]
            },
            {
              groupName: strings.AutoplayGroupName,
              isCollapsed: true,
              groupFields: [
                PropertyPaneToggle('enableAutoplay', {
                  label: strings.EnableAutoplay
                }),
                PropertyPaneTextField('delayAutoplay', {
                  label: strings.TimeBeforeChange,
                  description: strings.Miliseconds,
                  disabled: !this.properties.enableAutoplay
                }),
                PropertyPaneToggle('disableAutoplayOnInteraction', {
                  label: strings.DisableAutoplayOnInteraction,
                  disabled: !this.properties.enableAutoplay
                })
              ]
            },
            {
              groupName: strings.AdvancedGroupName,
              isCollapsed: true,
              groupFields: [
                PropertyPaneToggle('enableLoop', {
                  label: strings.EnableLoop
                }),
                PropertyPaneTextField('speed', {
                  label: strings.SpeedChange,
                  description: strings.Miliseconds,
                  disabled: !this.properties.enableAutoplay
                }),
                PropertyPaneTextField('spaceBetweenSlides', {
                  label: strings.SpaceBetweenBanners,
                  description: strings.InPixels,
                }),
                PropertyPaneTextField('height', {
                  label: strings.Height,
                  description: strings.InPixels,
                })
              ]
            }
          ]
        }
      ]
    };
  }

  private initFieldDropdowns(): void {
    this.fieldTitleDropDown = PropertyPaneDropdown('fieldTitle', {
      label: strings.TitleFieldLabel,
      options: this._listFields,
      selectedKey: this.properties.fieldTitle,
      disabled: !this.properties.listName});

    this.fieldSubtitleDropDown = PropertyPaneDropdown('fieldSubtitle', {
        label: strings.SubtitleFieldLabel,
        options: this._listFields,
        selectedKey: this.properties.fieldSubtitle,
        disabled: !this.properties.listName});

    this.fieldImageDropDown = PropertyPaneDropdown('fieldImage', {
      label: strings.ImageFieldLabel,
      options: this._listFields,
      selectedKey: this.properties.fieldImage,
      disabled: !this.properties.listName});

    this.fieldURLDropDown = PropertyPaneDropdown('fieldURL', {
      label: strings.URLFieldLabel,
      options: this._listFields,
      selectedKey: this.properties.fieldURL,
      disabled: !this.properties.listName});
  }

  private onListChange(propertyPath: string, newValue: any): void {

    const oldValue: any = get(this.properties, propertyPath);
    // store new value in web part properties
    update(this.properties, propertyPath, (): any => { return newValue; });
    // refresh web part

    this.render();
    this.resetFieldsDropdowns();


    this._listFields= null;
    const previousTitleField: string = this.properties.fieldTitle;
    const previousSubtitleField: string = this.properties.fieldSubtitle;
    const previousImageField: string = this.properties.fieldImage;
    const previousURLField: string = this.properties.fieldURL;

    this.properties.fieldTitle= null;
    this.properties.fieldSubtitle= null;
    this.properties.fieldImage = null;
    this.properties.fieldURL = null;

    this.onPropertyPaneFieldChanged('fieldTitle', previousTitleField, this.properties.fieldTitle);
    this.onPropertyPaneFieldChanged('fieldSubtitle', previousSubtitleField, this.properties.fieldSubtitle);
    this.onPropertyPaneFieldChanged('fieldImage', previousImageField, this.properties.fieldImage);
    this.onPropertyPaneFieldChanged('fieldURL', previousURLField, this.properties.fieldURL);

    this.loadListColumns().then((items: IDropdownOption[]) => {
      this.render();
      this.context.propertyPane.refresh();
    });
  }

  private loadLists(): Promise<IDropdownOption[]> {
    if(this._lists != null && this._lists.length>0 ) {
      return Promise.resolve(this._lists);
    }
    return new Promise<IDropdownOption[]>((resolve: (options: IDropdownOption[]) => void, reject: (error: any) => void) => {
      this.listAccessManager.GetLists().then((listdata: ISPList[]) => {
        this._lists = [];
        if(listdata != null && listdata.length>0) {
          listdata.forEach((list:ISPList) => {
            this._lists.push({key: list.Title, text: list.Title});
          });
        }
        //Cargar columnas si ya hay lista seleccionada al iniciar
        if(this.properties.listName != null && this._listFields== null) {
          this.loadListColumns().then((items: IDropdownOption[]) => { this.context.propertyPane.refresh();});
        }
        resolve(this._lists);
      });
    });
  }

  private loadListColumns(): Promise<IDropdownOption[]> {
    if(!this.properties.listName) {
      return Promise.resolve();
    }
    if(this._listFields != null && this._listFields.length>0 ) {
      return Promise.resolve(this._listFields);
    }
    return new Promise<IDropdownOption[]>((resolve: (options: IDropdownOption[]) => void, reject: (error: any) => void) => {
      this.listAccessManager.GetFieldsFromList(this.properties.listName).then((fieldsData: ISPColumn[]) => {
        this._listFields = [];
        if(fieldsData != null && fieldsData.length>0) {
          fieldsData.forEach((field:ISPColumn) => {
            this._listFields.push({key: field.InternalName, text: field.Title});
          });
        }
        resolve(this._listFields);
      });
    });
  }

  private resetFieldsDropdowns(): void {
    // reset selected values in item dropdown
    this._listFields= null;
    this.fieldTitleDropDown.properties.selectedKey = undefined;
    this.fieldTitleDropDown.properties.disabled = false;
    this.fieldSubtitleDropDown.properties.selectedKey = undefined;
    this.fieldSubtitleDropDown.properties.disabled = false;
    this.fieldImageDropDown.properties.selectedKey = undefined;
    this.fieldImageDropDown.properties.disabled = false;
    this.fieldURLDropDown.properties.selectedKey = undefined;
    this.fieldURLDropDown.properties.disabled = false;
  }

}
