import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    }
  }

  return (
    <div className="page-shell">
      <main className="auth-shell">
        <section className="auth-visual">
          <div>
            <p className="eyebrow">Finance dashboard</p>
            <h1 className="hero-title">Your money, made simple.</h1>
            <p className="hero-copy">Track income, expenses, and goals in one focused workspace built for personal finance clarity.</p>
          </div>

          <div className="feature-list">
            <article className="feature-chip">
              <strong>Budget visibility</strong>
              <span>See each month at a glance.</span>
            </article>
            <article className="feature-chip">
              <strong>Fast updates</strong>
              <span>Capture transactions in seconds.</span>
            </article>
            <article className="feature-chip">
              <strong>Daily confidence</strong>
              <span>Stay on top of savings and spending.</span>
            </article>
          </div>
        </section>

        <section className="auth-card">
          <p className="eyebrow">Welcome back</p>
          <h1>Login</h1>
          <p className="muted">Sign in to continue managing your finances.</p>

          <form className="form-grid" onSubmit={handleLogin}>
            <div className="field-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                className="input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                className="input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="primary-button" type="submit">Login</button>
          </form>

          <p className="switch-text">
            Don't have an account? <Link className="link-button" to="/signup">Create one</Link>
          </p>
        </section>
      </main>
    </div>
  );
}

export default Login;