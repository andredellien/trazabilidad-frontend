import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./shared/components/layout";
import DashboardPage from "./features/Dashboard/DashboardPage";
import LoginForm from "./features/Auth/components/LoginForm";
import ProtectedRoute from "./shared/components/ProtectedRoute";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<LoginForm />} />
				<Route element={<ProtectedRoute />}>
					<Route element={<Layout />}>
						<Route path="/dashboard" element={<DashboardPage />} />
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App; 