import React from 'react';
import * as API from './api'
import './Login.css';

export default function Login() {
    const [username, setUsername] = React.useState<string>();
    const [password, setPassword] = React.useState<string>();

    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (username === undefined || password === undefined) {
            return;
        }
        
        const response = await API.authorize({ username, password });
        if (!response.ok) {
            // bad request
        }

      }

      return (
        <form onSubmit={handleLogin}>
            <label htmlFor="username">Username:</label>
            <input name="username" type="text" value={username} onChange={e => setUsername(e.target.value)} />
            <label htmlFor="password">Password:</label>
            <input name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="submit">Login</button>
        </form>
      );
}
      
      
