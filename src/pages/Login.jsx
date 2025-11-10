import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>
      <input className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
      <input type="password" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
      <button className="btn-primary w-full">Login</button>
    </div>
  );
}





