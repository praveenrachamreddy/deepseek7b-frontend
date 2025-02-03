export const getBotResponse = async (prompt) => {
	try {
		const response = await fetch("https://ollama-flask-route-praveen.apps.ocp4.imss.work/api/generate", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ prompt }),
		});

		const data = await response.json();
		return { success: true, text: data.data.text };
	} catch (error) {
		console.error("API Error:", error);
		return { success: false, text: "Error fetching response" };
	}
};
