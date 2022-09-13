import { useState, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import { authorize } from './api'
import './Login.css';

export default function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const isValid = useMemo(
        () => username.length > 0 && password.length > 0,
        [username, password]
    );

    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        
        setIsLoading(true);
        let response: Response | undefined;
        try {
            response = await authorize({ username, password });
        } catch {
            // todo
            return;
        } finally {
            setIsLoading(false);
        }

        if (response.ok) {
            navigate("/");
        } else {
            // todo
        }
    }

    return (
        <form onSubmit={handleLogin}>
            <label htmlFor="username">Username:</label>
            <input name="username" type="text"
                   value={username} onChange={e => setUsername(e.target.value)} />
            <label htmlFor="password">Password:</label>
            <input name="password" type="password"
                   value={password} onChange={e => setPassword(e.target.value)} />
            <button type="submit" disabled={isLoading}>Login</button>
        </form>
    );
}
      
      
