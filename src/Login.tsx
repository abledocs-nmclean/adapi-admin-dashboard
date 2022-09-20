import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { LocationState } from './location';
import { ApiError } from './api'
import { useAuthContext } from './auth-context';
import { getErrorDisplayMessage } from './util';
import './Login.css';

export default function Login() {
    useEffect(() => {
        document.title = "Login";
    }, []);

    const navigate = useNavigate();
    const location = useLocation();
    const locationState = location.state as LocationState | undefined;

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const isValid = useMemo(
        () => username.length > 0 && password.length > 0,
        [username, password]
    );

    const { login, logoutReason } = useAuthContext();

    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        
        setErrorMessage(null);
        setIsLoading(true);
        try {
            await login(username, password);
        } catch (error) {
            if (error instanceof ApiError && error.response.status === 401) {
                setErrorMessage("Username or password is incorrect");
            } else {
                const displayMessage = await getErrorDisplayMessage(error);
                setErrorMessage(displayMessage);
            }
            return;
        } finally {
            setIsLoading(false);
        }

        navigate(locationState?.from ?? "/");
    }

    return (
        <div className="login-page">
            <form onSubmit={handleLogin}>
                {logoutReason === "TokenExpired" &&
                    <div className="token-expired" role="alert">
                        Session has expired. Please log in again.
                    </div>
                }
                <h1>Login</h1>
                <TextBoxComponent placeholder="Username" cssClass="e-outline" floatLabelType="Auto"
                    value={username} input={({value}) => setUsername(value)} />
                <TextBoxComponent type="password" placeholder="Password" cssClass="e-outline" floatLabelType="Auto"
                    value={password} input={({value}) => setPassword(value)} />
                <ButtonComponent type="submit" disabled={isLoading || !isValid} isPrimary={true} cssClass="e-block">Login</ButtonComponent>                
                {errorMessage && logoutReason !== "TokenExpired" &&
                    <div className="error" role="alert">
                        Couldn't log in:<br />
                        {errorMessage}
                    </div>
                }
            </form>
        </div>
    );
}
      
      
