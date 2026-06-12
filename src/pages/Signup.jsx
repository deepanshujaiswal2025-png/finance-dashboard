import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup(e) {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert(
        "Signup successful! Check your email if confirmation is enabled."
      );
    }
  }

  return (
    <div className="page-shell">
      <main className="auth-shell">
        <section className="auth-visual">
          <div>
            <p className="eyebrow">Get started</p>
            <h1 className="hero-title">Start building your money habits.</h1>
            <p className="hero-copy">Create your account and keep every transaction, budget, and savings goal in one calm dashboard.</p>
          </div>

          <div className="feature-list">
            <article className="feature-chip">
              <strong>Track income & spending</strong>
              <span>See what changed and why.</span>
            </article>
            <article className="feature-chip">
              <strong>Set savings targets</strong>
              <span>Keep your future plans front and center.</span>
            </article>
            <article className="feature-chip">
              <strong>Stay organized</strong>
              <span>Everything updates in one place.</span>
            </article>
          </div>
        </section>

        <section className="auth-card">
          <p className="eyebrow">Create account</p>
          <h1>Sign Up</h1>
          <p className="muted">Create your account to unlock the dashboard.</p>

          <form className="form-grid" onSubmit={handleSignup}>
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
                placeholder="Choose a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="primary-button" type="submit">Sign Up</button>
          </form>

          <p className="switch-text">
            Already have an account? <Link className="link-button" to="/login">Login</Link>
          </p>
        </section>
      </main>
    </div>
  );
}

export default Signup;