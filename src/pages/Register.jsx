import { useState } from 'react';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const passwordsMatch = form.password && form.password.length >= 6 && form.password === form.confirm;

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Register</h1>
      <input className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} />
      <input className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3" placeholder="Email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} />
      <input type="password" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3" placeholder="Password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} />
      <input type="password" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3" placeholder="Confirm Password" value={form.confirm} onChange={(e)=>setForm({...form, confirm:e.target.value})} />
      {!passwordsMatch && form.confirm && <p className="text-sm text-rose-400">Passwords must match and be at least 6 characters</p>}
      <button className="btn-primary w-full" disabled={!passwordsMatch}>Create Account</button>
    </div>
  );
}


