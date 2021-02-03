import React from "react";

export class ErrorBoundary extends React.Component {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    // componentDidCatch(error: any, errorInfo: any) {
    //     // You can also log the error to an error reporting service
    //     // logErrorToMyService(error, errorInfo);
    // }

    render() {
        return this.props.children;
    }
}