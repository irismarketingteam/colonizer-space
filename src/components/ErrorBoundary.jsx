import { Component } from 'react'
import { Link } from 'react-router-dom'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="font-mono text-micro uppercase tracking-widest text-text-tertiary mb-4">Error</p>
            <h1 className="font-display font-bold text-h1 text-text-primary mb-4">Something went wrong</h1>
            <p className="text-text-secondary mb-8">An unexpected error occurred.</p>
            <Link
              to="/"
              onClick={() => this.setState({ hasError: false })}
              className="inline-block px-6 py-3 border border-accent/30 text-accent hover:bg-accent/10 transition-colors font-medium"
            >
              Return to base
            </Link>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
