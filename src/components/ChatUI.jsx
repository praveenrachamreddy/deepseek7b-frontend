import { useState, useEffect, useRef } from "react";
import { getBotResponse } from "../http/getAPIs";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark, oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Menu, MessageSquare, Settings } from "lucide-react";

export default function ChatUI() {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const messagesEndRef = useRef(null);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const sendMessage = async () => {
		if (!input.trim()) return;

		const userMessage = { type: "user", text: input };
		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setLoading(true);

		try {
			const response = await getBotResponse(input);
			setMessages((prev) => [...prev, { type: "bot", text: response.text }]);
		} catch (error) {
			console.error("Error fetching response:", error);
		}
		setLoading(false);
	};

	const renderMessage = (msg, index) => (
		<div
			key={index}
			className={`flex ${
				msg.type === "user" ? "justify-end" : "justify-start"
			}`}
		>
			<div
				className={`p-3 rounded-lg max-w-lg shadow-md ${
					msg.type === "user"
						? "bg-blue-500 text-white"
						: "bg-gray-800 text-gray-100"
				}`}
			>
				{msg.text.includes("```") ? (
					<SyntaxHighlighter language="javascript" style={oneDark}>
						{msg.text.replace(/```/g, "").trim()}
					</SyntaxHighlighter>
				) : (
					msg.text
				)}
			</div>
		</div>
	);

	return (
		<div className="flex h-screen bg-gray-900 text-white">
			{/* Sidebar */}
			<aside className="w-64 bg-gray-800 p-4 flex flex-col space-y-4 border-r border-gray-700">
				<h1 className="text-xl font-semibold">Deepseek AI</h1>
				{[
					{ icon: MessageSquare, label: "New Chat" },
					{ icon: Menu, label: "History" },
					{ icon: Settings, label: "Settings", extraClass: "mt-auto" },
				].map(({ icon: Icon, label, extraClass }, idx) => (
					<button
						key={idx}
						className={`flex items-center space-x-2 bg-gray-700 p-2 rounded-lg hover:bg-gray-600 ${extraClass}`}
					>
						<Icon size={18} />
						<span>{label}</span>
					</button>
				))}
			</aside>

			{/* Chat Window */}
			<div className="flex flex-col flex-1">
				<header className="p-4 bg-gray-800 text-center text-lg font-semibold">
					Chat Assistant
				</header>
				<div className="flex-1 overflow-y-auto p-4 space-y-4">
					{messages.map(renderMessage)}
					{loading && (
						<div className="text-gray-500 text-center">Thinking...</div>
					)}
					<div ref={messagesEndRef} />
				</div>

				{/* Input Box */}
				<div className="p-4 flex bg-gray-800 border-t border-gray-700">
					<input
						type="text"
						className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Ask me anything..."
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && sendMessage()}
					/>
					<button
						className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-blue-400"
						onClick={sendMessage}
						disabled={loading}
					>
						Send
					</button>
				</div>
			</div>
		</div>
	);
}
