import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";

export default function Layout() {
	const [collapsed, setCollapsed] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkIsMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkIsMobile();
		window.addEventListener("resize", checkIsMobile);
		return () => window.removeEventListener("resize", checkIsMobile);
	}, []);

	return (
		<div style={{ display: "flex", height: "100vh" }}>
			<Sidebar onCollapse={setCollapsed} />
			<main
				style={{
					marginLeft: isMobile ? 0 : collapsed ? "60px" : "220px",
					padding: isMobile ? "2rem 1rem 2rem 3rem" : "2rem",
					transition: "margin-left 0.2s",
					width: "100%",
				}}
			>
				<Outlet />
			</main>
		</div>
	);
}
