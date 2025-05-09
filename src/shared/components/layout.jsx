import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";

export default function Layout() {
	const [collapsed, setCollapsed] = useState(false);

	return (
		<div style={{ display: "flex", height: "100vh" }}>
			<Sidebar onCollapse={setCollapsed} />
			<main
				style={{
					marginLeft: collapsed ? "60px" : "220px",
					padding: "2rem",
					transition: "margin-left 0.2s",
					width: "100%",
				}}
			>
				<Outlet />
			</main>
		</div>
	);
}
