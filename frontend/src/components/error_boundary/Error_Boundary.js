import { Component } from "react";
import ErrorMessage from "../error_message/Error_message"

class ErrorBoundary extends Component {
    state = { error: false };

    componentDidCatch(error, errorInfo) {
        this.setState({ error: true });
    }

    render() {
        if (this.state.error === true) {
            return <ErrorMessage />;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;