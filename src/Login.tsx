import React, { useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { ProgressButtonComponent } from '@syncfusion/ej2-react-splitbuttons';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { LocationState } from './location';
import { useAuthContext } from './auth-context';
import { useErrorMessage } from './util';
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

    const isValid = useMemo(
        () => username.length > 0 && password.length > 0,
        [username, password]
    );

    const { login, authState, error } = useAuthContext();

    const errorMessage = useErrorMessage(error);

    const loginButtonRef = useRef<ProgressButtonComponent>(null);
    useLayoutEffect(() => {
        if (!isLoading) {
            loginButtonRef.current?.progressComplete();
        }
    }, [isLoading]);

    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        
        setIsLoading(true);
        try {
            await login(username, password);
        } catch {
            return;
        } finally {
            setIsLoading(false);
        }

        navigate(locationState?.previousLocation ?? "/");
    }

    return (
        <div className="login-page">
            <form onSubmit={handleLogin}>
                {authState === "TokenExpired" &&
                    <div className="token-expired" role="alert">
                        Session has expired. Please log in again.
                    </div>
                }
                <h1>Login</h1>
                <TextBoxComponent placeholder="Username" cssClass="e-outline" floatLabelType="Auto"
                    value={username} input={({value}) => setUsername(value)} />
                <TextBoxComponent type="password" placeholder="Password" cssClass="e-outline" floatLabelType="Auto"
                    value={password} input={({value}) => setPassword(value)} />
                <ProgressButtonComponent ref={loginButtonRef} duration={30000}
                        type="submit" disabled={isLoading || !isValid} isPrimary={true}
                        cssClass="e-block" spinSettings={{position: "Left"}}>
                    Login
                </ProgressButtonComponent>
                {authState === "InvalidCredentials" ?
                    <div className="error" role="alert">
                        Username or password is incorrect.
                    </div>
                : authState === "Error" &&
                    <div className="error" role="alert">
                        Couldn't log in:<br />
                        {errorMessage}
                    </div>
                }
            </form>
        </div>
    );
}