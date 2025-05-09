import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "../features/Dashboard/DashboardPage";
import MateriaPrimaPage from "../features/MateriaPrima/MateriaPrimaPage";
import LotePage from "../features/GestionLotes/GestionLotesPage";
import CodigoQRPage from "../features/CodigoQR/CodigoQRPage";
import LoginForm from "../features/Auth/components/LoginForm";
import RegisterForm from "../features/Auth/components/RegisterForm";
import RequireAuth from "../shared/guards/RequireAuth";
import ProcesoTransformacion from "../features/ProcesoTransformacion/ProcesoTransformacion";
import FormularioMaquina from "../features/ProcesoTransformacion/FormularioMaquina";
import SeleccionarLote from "../features/ProcesoTransformacion/SeleccionarLote";

const AppRoutes = () => {
	return (
		<BrowserRouter>
			<Routes>
				{/* ------------- RUTAS PÚBLICAS ------------- */}

				<Route path="/" element={<LoginForm />} />
				<Route path="/register" element={<RegisterForm />} />

				{/* ------------- RUTAS PROTEGIDAS ------------- */}

				<Route
					path="/dashboard"
					element={
						<RequireAuth>
							<DashboardPage />
						</RequireAuth>
					}
				/>
				<Route
					path="/materia-prima"
					element={
						<RequireAuth>
							<MateriaPrimaPage />
						</RequireAuth>
					}
				/>
				<Route
					path="/gestion-lotes"
					element={
						<RequireAuth>
							<LotePage />
						</RequireAuth>
					}
				/>
				<Route
					path="/codigo-qr"
					element={
						<RequireAuth>
							<CodigoQRPage />
						</RequireAuth>
					}
				/>
				<Route
					path="/proceso/:idLote"
					element={
						<RequireAuth>
							<ProcesoTransformacion />
						</RequireAuth>
					}
				/>
				<Route
					path="/proceso/:idLote/maquina/:numeroMaquina"
					element={<FormularioMaquina />}
				/>
				<Route path="/seleccionar-lote" element={<SeleccionarLote />} />
			</Routes>
		</BrowserRouter>
	);
};

export default AppRoutes;
