"use client";

import React from "react";

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
}

export class ProductPortfolioErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("ProductPortfolio error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <section className="w-full py-20 bg-slate-50 dark:bg-slate-950">
                    <div className="max-w-4xl mx-auto text-center px-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                            Products Loading Error
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            We had trouble loading the product catalog. Please refresh the page.
                        </p>
                        <button
                            onClick={() => this.setState({ hasError: false })}
                            className="px-6 py-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors font-semibold"
                        >
                            Try Again
                        </button>
                    </div>
                </section>
            );
        }

        return this.props.children;
    }
}
