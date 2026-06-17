import { Component, type ReactNode, type ErrorInfo } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[NovaStyle] Panel crashed:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="p-4 text-sm text-red-600 bg-red-50 rounded">
          <p className="font-medium mb-1">Something went wrong</p>
          <p className="text-red-500 mb-2 font-mono text-xs">{this.state.error.message}</p>
          <button
            className="px-3 py-1 text-xs bg-red-100 border border-red-200 rounded hover:bg-red-200"
            onClick={() => this.setState({ error: null })}
          >
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
