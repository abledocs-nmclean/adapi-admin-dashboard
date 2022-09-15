import React from 'react';
import { useNavigate } from "react-router-dom";
import * as API from './api'
import './Login.css';

export default function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);

    const isValid = React.useMemo(
        () => username.length > 0 && password.length > 0,
        [username, password]
    );

    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        
        setIsLoading(true);
        let response: Response | undefined;
        try {
            response = await API.authorize({ username, password });
        } catch {
            // todo
        } finally {
            setIsLoading(false);
        }

        if (response?.ok) {
            navigate("/dashboard");
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
            <button type="submit" disabled={isLoading || !isValid}>Login</button>
        </form>
      );
}
      
      
