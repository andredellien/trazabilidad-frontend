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
import Layout from "../shared/components/layout";
import Certificados from "../features/certificados/Certificados";
import CertificadoDetalle from "../features/certificados/CertificadoDetalle";
import CertificadoQR from "../features/certificados/CertificadoQR";
import CrearProceso from "../features/Proceso/CrearProceso";
import ListaProcesos from "../features/Proceso/ListaProcesos";
import Maquinas from "../features/Maquinas/maquinas";
import EditarProceso from "../features/Proceso/EditarProceso";
import ProcesoPDF from "../features/Proceso/ProcesoPDF";
import UsuariosPage from "../features/Usuarios/UsuariosPage";

const AppRoutes = () => {
	return (
		<BrowserRouter>
			<Routes>
				{/* ------------- RUTAS PÚBLICAS ------------- */}

				<Route path="/" element={<LoginForm />} />
				<Route path="/register" element={<RegisterForm />} />
				<Route path="/certificado/:idLote" element={<CertificadoDetalle />} />

				{/* ------------- RUTAS PROTEGIDAS ------------- */}

				<Route
					path="/"
					element={
						<RequireAuth>
							<Layout />
						</RequireAuth>
					}
				>
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
						path="/usuarios"
						element={
							<RequireAuth>
								<UsuariosPage />
							</RequireAuth>
						}
					/>
					<Route
						path="/proceso/:idLote/maquina/:numeroMaquina"
						element={<FormularioMaquina />}
					/>
					<Route path="/seleccionar-lote" element={<SeleccionarLote />} />
					<Route path="/certificados" element={<Certificados />} />
					<Route path="/certificado/:idLote/qr" element={<CertificadoQR />} />
					<Route path="/procesos/crear" element={<CrearProceso />} />
					<Route path="/procesos" element={<ListaProcesos />} />
					<Route path="/maquinas" element={<Maquinas />} />
					<Route path="/procesos/:id/editar" element={<EditarProceso />} />
					<Route path="/procesos/:id/pdf" element={<ProcesoPDF />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

export default AppRoutes;
