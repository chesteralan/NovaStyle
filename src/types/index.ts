export interface StyleMap {
  [selector: string]: {
    [property: string]: string
  }
}

export interface NovaStyleConfig {
  containerId: string
  mountPointId: string
  selector: string
  domain: string
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

declare global {
  interface Window {
    __NOVASTYLE_CONFIG__?: NovaStyleConfig
  }
}
