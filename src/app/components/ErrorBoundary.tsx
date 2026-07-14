import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Error no capturado en la aplicación:", error, info.componentStack);
  }

  handleReload = () => {
    this.setState({ error: null });
    window.location.reload();
  };

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-6">
          <div className="text-center max-w-md">
            <p
              className="text-2xl mb-4 tracking-wide text-white"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Algo salió mal
            </p>
            <p className="text-white/50 text-sm mb-8">
              Ocurrió un error inesperado cargando esta página. Intenta recargar — si el problema
              persiste, contáctanos.
            </p>
            <button
              onClick={this.handleReload}
              className="px-6 py-3 text-sm uppercase tracking-widest text-white transition-colors"
              style={{ backgroundColor: "#C9A84C" }}
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
