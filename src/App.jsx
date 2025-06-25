import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./shared/components/layout";
import DashboardPage from "./features/Dashboard/DashboardPage";
import LoginForm from "./features/Auth/components/LoginForm";
import ProtectedRoute from "./shared/components/ProtectedRoute";
import GestionPedidosPage from "./features/GestionPedidos/GestionPedidosPage";

function App() {
	return (
		<BrowserRouter>
			<ToastContainer
				position="top-right"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
			<Routes>
				<Route path="/" element={<LoginForm />} />
				<Route element={<ProtectedRoute />}>
					<Route element={<Layout />}>
						<Route path="/dashboard" element={<DashboardPage />} />
						<Route path="/gestion-pedidos" element={<GestionPedidosPage />} />
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App; 