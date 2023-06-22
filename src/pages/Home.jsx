import { useEffect } from "react";
import { isAuthenticated } from "../helpers/auth";
import { useNavigate } from "react-router-dom";

export default function Home() {
	const navigate = useNavigate();

	async function initial() {
		const x = await isAuthenticated();
		if (!x) {
			navigate("/login");
		}
	}

	useEffect(() => {
		initial();
	}, []);

	return <div>Hi</div>;
}
