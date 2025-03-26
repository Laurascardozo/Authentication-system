const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			
		},
		actions: {
			registerUser: async (registration) => {
				const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:3001";
				const endpoint = `${backendUrl.replace(/\/+$/, '')}/api/register`; // Cambiado a /api/register
				console.log("Intentando hacer fetch a:", endpoint);
				console.log("Datos enviados:", registration);
				try {
					const response = await fetch(endpoint, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(registration),
					});
			
					if (!response.ok) {
						const errorData = await response.json();
						console.error(`Error en la solicitud: ${response.status} ${response.statusText}`, errorData);
						return false;
					}
			
					const data = await response.json();
					console.log("Respuesta del backend:", data);
					sessionStorage.setItem('token', data.token);
					return true;
				} catch (error) {
					console.error("Error en la solicitud:", error.message);
					console.error("Detalles del error:", error);
					return false;
				}
			},
			loginUser: async (email, password) => {
				const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:3001";
				const endpoint = `${backendUrl}/api/login`; 
			
				try {
					const response = await fetch(endpoint, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ email, password }),
					});
			
					if (!response.ok) {
						const errorData = await response.json();
						console.error(`Error en la solicitud: ${response.status} ${response.statusText}`, errorData);
						return false;
					}
			
					const data = await response.json();
					sessionStorage.setItem('token', data.token);
					return true;
				} catch (error) {
					console.error("Error en la solicitud:", error.message);
					return false;
				}
			},
		}
	};
};

export default getState;
