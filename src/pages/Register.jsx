import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { authenticate, isAuthenticated } from "../helpers/auth";
import { toast } from "react-hot-toast";

function reducer(state, action) {
	if (["email", "password"].includes(action.type)) {
		return {
			...state,
			[action.type]: action.value,
		};
	}
}

export default function Register() {
	const [state, dispatch] = useReducer(reducer, { email: "", password: "" });
	const navigate = useNavigate();

	async function initial() {
		const x = await isAuthenticated();
		if (x) {
			navigate("/");
		}
	}

	useEffect(() => {
		initial();
	}, []);

	async function handleClick() {
		const registeredAndloggedIn = await authenticate(
			"register",
			state.email,
			state.password
		);
		if (registeredAndloggedIn) {
			navigate("/");
		} else {
			toast.error("Error while registering in. Check logs.");
		}
	}

	return (
		<div>
			<div>Register</div>
			<input
				type="email"
				value={state.email}
				onChange={(e) => dispatch({ type: "email", value: e.target.value })}
			/>
			<input
				type="password"
				pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
				value={state.password}
				onChange={(e) => dispatch({ type: "password", value: e.target.value })}
			/>
			<button onClick={handleClick}>Register</button>
			<button onClick={() => navigate("/login")}>
				Want to login instead ?
			</button>
		</div>
	);
}
