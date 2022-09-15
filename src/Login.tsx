import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { ApiError } from './api'
import { useAuthContext } from './auth-context';
import './Login.css';

export default function Login() {
    useEffect(() => {
        document.title = "Login";
    }, []);

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const isValid = useMemo(
        () => username.length > 0 && password.length > 0,
        [username, password]
    );

    const { login } = useAuthContext();

    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        
        setIsLoading(true);
        try {
            await login(username, password);
        } catch (error) {
            if (error instanceof ApiError) {
                // todo
            }
            return;
        } finally {
            setIsLoading(false);
        }

        navigate("/");
    }

    return (
        <div className="login-page">
            <form onSubmit={handleLogin}>
                <h1>Login</h1>
                <div className="field-container">
                    <TextBoxComponent placeholder="Username" cssClass="e-outline" floatLabelType="Auto"
                        value={username} input={({value}) => setUsername(value)} />
                </div>
                <div className="field-container">
                    <TextBoxComponent type="password" placeholder="Password" cssClass="e-outline" floatLabelType="Auto"
                        value={password} input={({value}) => setPassword(value)} />
                </div>
                <ButtonComponent type="submit" disabled={isLoading || !isValid} isPrimary={true} cssClass="e-block">Login</ButtonComponent>
            </form>
        </div>
    );
}
      
      
