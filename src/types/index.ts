export interface StyleMap {
  [selector: string]: {
    [property: string]: string
  }
}

export interface ChangeRecord {
  selector: string
  property: string
  previousValue: string | null
  newValue: string
  timestamp: number
}

export interface PersistedDomain {
  styles: StyleMap
  updatedAt: number
}

export type ExtensionState = 'active' | 'inactive'
