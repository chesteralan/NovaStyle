export interface StyleMap {
  [selector: string]: {
    [property: string]: string
  }
}

export interface NovaStyleSettings {
  defaultPosition: 'right' | 'left' | 'bottom' | 'top'
  panelWidth: number
  theme: 'light' | 'dark'
  visibleEditors: {
    classInput: boolean
    boxModel: boolean
    typography: boolean
    colorPicker: boolean
  }
}

export type ExtensionToggleMessage = {
  type: 'TOGGLE_EXTENSION'
  state: 'active' | 'inactive'
}

export type GetStylesMessage = {
  type: 'GET_STYLES'
  domain: string
}

export type SaveStylesMessage = {
  type: 'SAVE_STYLES'
  domain: string
  styles: StyleMap
}

export type UpdateClassesMessage = {
  type: 'UPDATE_CLASSES'
  classes: string[]
}

export type BackgroundMessage = GetStylesMessage | SaveStylesMessage
export type ContentMessage = ExtensionToggleMessage | UpdateClassesMessage
