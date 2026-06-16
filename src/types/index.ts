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
    borderEditor: boolean
    effectsEditor: boolean
    layoutEditor: boolean
    flexboxEditor: boolean
    transformEditor: boolean
    gridEditor: boolean
    backgroundEditor: boolean
    filterEditor: boolean
    textDecorationEditor: boolean
    outlineEditor: boolean
    cursorEditor: boolean
    animationEditor: boolean
    listEditor: boolean
    tableEditor: boolean
    columnsEditor: boolean
    scrollSnapEditor: boolean
    svgEditor: boolean
    writingModeEditor: boolean
    fontDetector: boolean
    classResolver: boolean
    responsivePreview: boolean
    customCSS: boolean
    colorPalette: boolean
  }
  useSync?: boolean
  ignoredDomains?: string[]
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
