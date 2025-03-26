import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const { actions } = useContext(Context); // Cambié 'store, actions' a solo 'actions' porque no usas store
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmitRegister = async (e) => {
        e.preventDefault();
        if (email && password) {
            console.log("Iniciando registro..."); // Debug
            const response = await actions.registerUser({ email, password });
            console.log("Resultado del registro:", response); // Debug
            if (response) {
                navigate("/dashboard");
            } else {
                alert("Falló el registro. Revisa la consola.");
            }
        }
    };

    return (
        <div className="form container mt-4">
            <h2>Registrarse</h2>
            <form onSubmit={handleSubmitRegister}>
                <div className="mb-3">
                    <label className="form-label">Correo electrónico</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit" className="btn btn-primary">Sign Up</button>
            </form>
        </div>
    );
};

export default SignUp;