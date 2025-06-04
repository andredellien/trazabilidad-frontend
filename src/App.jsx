import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./shared/components/layout";
import DashboardPage from "./features/Dashboard/DashboardPage";
import LoginPage from "./features/Auth/LoginPage";
import ProtectedRoute from "./shared/components/ProtectedRoute";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route element={<ProtectedRoute />}>
					<Route element={<Layout />}>
						<Route path="/" element={<DashboardPage />} />
						
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App; 