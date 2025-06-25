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
import ProveedoresPage from "../features/Proveedores/pages/ProveedoresPage";
import PedidosPage from "../features/Pedidos/PedidosPage";
import GestionPedidosPage from "../features/GestionPedidos/GestionPedidosPage";
import MateriaPrimaBasePage  from '../features/MateriaPrima/MateriaPrimaBasePage';
import SolicitarMateriaPrimaPage from '../features/MateriaPrima/SolicitarMateriaPrimaPage';
import RecepcionMateriaPrimaPage from '../features/MateriaPrima/RecepcionMateriaPrimaPage';
import AlmacenajeSection from '../features/GestionLotes/components/AlmacenajeSection';
import LotesAlmacenadosSection from '../features/GestionLotes/components/LotesAlmacenadosSection';
import { VariablesEstandarPage } from '../features/VariablesEstandar';
import { DashboardClientePage } from '../features/Dashboard/components/DashboardClientePage';
// ...


const AppRoutes = () => {
	return (
		<BrowserRouter>
			<Routes>
				{/* ------------- RUTAS PÚBLICAS ------------- */}

				<Route path="/" element={<LoginForm />} />
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
						path="/dashboard-cliente"
						element={
							<RequireAuth>
								<DashboardClientePage />
							</RequireAuth>
						}
					/>
					<Route
						path="/register"
						element={
							<RequireAuth>
								<RegisterForm />
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
						path="/gestion-pedidos"
						element={
							<RequireAuth>
								<GestionPedidosPage />
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
						path="/proveedores"
						element={
							<RequireAuth>
								<ProveedoresPage />
							</RequireAuth>
						}
					/>
					<Route
						path="/pedidos"
						element={
							<RequireAuth>
								<PedidosPage />
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
					<Route path="/materia-prima-base" element={<MateriaPrimaBasePage />} />
					<Route path="/solicitar-materia-prima" element={<SolicitarMateriaPrimaPage />} />
					<Route path="/recepcion-materia-prima" element={<RecepcionMateriaPrimaPage />} />
					<Route
						path="/almacenaje"
						element={
							<RequireAuth>
								<AlmacenajeSection />
							</RequireAuth>
						}
					/>
					<Route
						path="/lotes-almacenados"
						element={
							<RequireAuth>
								<LotesAlmacenadosSection />
							</RequireAuth>
						}
					/>
					<Route path="/variables-estandar" element={<VariablesEstandarPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

export default AppRoutes;
