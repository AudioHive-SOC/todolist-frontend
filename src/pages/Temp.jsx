import { useEffect, useState } from "react";
import { IoCloseCircleSharp } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-hot-toast";
import { isAuthenticated } from "../helpers/auth";
import { useNavigate } from "react-router-dom";

const ID = "647d95af94e51eede64604b7";
const baseUrl = "http://localhost:5000/api/";

export default function Home() {
	const [text, setText] = useState("");
	const [todos, setTodos] = useState([]);
	const navigate = useNavigate();

	async function addTodo() {
		const newList = [
			...todos,
			{
				text: text,
				timeStamp: new Date().toISOString(),
			},
		];
		updateTodos(newList, "TODO added");
	}

	async function deleteTodo(t) {
		const newList = todos.filter((x) => x.timeStamp != t);
		updateTodos(newList, "TODO deleted");
	}

	async function updateTodos(newList, msg) {
		try {
			const res = await axios.put(baseUrl + "updateTodos", newList, {
				params: { id: ID },
			});
			if (res.status == 200) {
				setTodos(newList);
				setText("");
				toast.success(msg);
			}
		} catch (error) {
			console.log(error);
			toast.error("Error, check log");
		}
	}

	async function fetchData() {
		try {
			const res = await axios.get(baseUrl + "getTodos", {
				params: { id: ID },
			});
			if (res.status == 200) {
				setTodos(res.data);
				console.log(res.data);
				toast.success("TODOS synced");
			} else {
				toast.error("Unable to connect");
			}
		} catch (error) {
			console.log(error);
			toast.error("Error, check log");
		}
	}

	useEffect(() => fetchData(), []);

	useEffect(() => {
		const x = isAuthenticated();
		if (!x) {
			navigate("/login");
		}
	}, []);

	return (
		<>
			<div>Todolist</div>
			<input
				value={text}
				onChange={(e) => setText(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						addTodo();
					}
				}}
			/>
			<button onClick={() => addTodo()}>Add todo</button>
			<div className="w-[20vw]">
				{todos.map((x) => (
					<div className="flex items-center justify-between" key={x.timeStamp}>
						<div>{x.text}</div>
						<div onClick={() => deleteTodo(x.timeStamp)}>
							<IoCloseCircleSharp />
						</div>
					</div>
				))}
			</div>
		</>
	);
}
