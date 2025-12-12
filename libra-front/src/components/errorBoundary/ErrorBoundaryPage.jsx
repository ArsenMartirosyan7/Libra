import React from 'react';
import { ErrorScreen } from './ErrorScreen';

import { ErrorBoundary } from './ErrorBoundary';
import { withRouter } from './utils';

class ErrorBoundaryPageContent extends ErrorBoundary {
  componentDidUpdate(prevProps) {
    const { hasError } = this.state;
    const { pathname: prevPathname } = prevProps.location;
    const { pathname: currentPathname } = this.props.location;

    if (prevPathname !== currentPathname && hasError) {
      this.setState({
        hasError: false,
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return <ErrorScreen />;
    }

    return this.props.children;
  }
}

export const ErrorBoundaryPage = withRouter(ErrorBoundaryPageContent);
