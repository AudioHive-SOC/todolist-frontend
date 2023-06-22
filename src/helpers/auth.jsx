import axios from "axios";
import { isExpired } from "react-jwt";

export function setAuthToken(token) {
	if (token) {
		// set Authorization header in axios using accessToken
		axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	} else {
		// remove Authorization header from axios
		delete axios.defaults.headers.common["Authorization"];
	}
}

export async function isAuthenticated() {
	const accessToken = localStorage.getItem("token");
	if (accessToken) {
		if (!isExpired(accessToken)) {
			// set Authorization header in axios using accessToken
			axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
			return true;
		}
	}
	// remove Authorization header from axios
	delete axios.defaults.headers.common["Authorization"];
	const x = await regenerateAccessToken();
	return x;
}

export async function regenerateAccessToken() {
	try {
		const response = await axios.get("/auth/refresh-token");
		if (response.statusCode == 200) {
			const accessToken = response.data.accessToken;
			// set Authorization header in axios using accessToken
			axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
			return true;
		} else return false;
	} catch (error) {
		console.log(error);
		return false;
	}
}

export async function authenticate(type, email, password) {
	try {
		const response = await axios.post(`/auth/${type}`, {
			email,
			password,
		});
		if (response.status == 200) {
			const accessToken = response.data.accessToken;
			// set Authorization header in axios using accessToken
			axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
			localStorage.setItem("token", accessToken);
			return true;
		} else {
			return false;
		}
	} catch (error) {
		console.log(error);
		return false;
	}
}
