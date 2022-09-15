import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
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
        <form onSubmit={handleLogin}>
            <label htmlFor="username">Username:</label>
            <input name="username" type="text"
                   value={username} onChange={e => setUsername(e.target.value)} />
            <label htmlFor="password">Password:</label>
            <input name="password" type="password"
                   value={password} onChange={e => setPassword(e.target.value)} />
            <button type="submit" disabled={isLoading || !isValid}>Login</button>
        </form>
    );
}
      
      
