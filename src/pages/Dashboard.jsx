import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function Dashboard({ session }) {
  const [transactions, setTransactions] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("transaction_date", { ascending: false });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setTransactions(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadTransactions = async () => {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("transaction_date", { ascending: false });

      if (!isMounted) {
        return;
      }

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setTransactions(data ?? []);
      setLoading(false);
    };

    void loadTransactions();

    return () => {
      isMounted = false;
    };
  }, []);

  async function addTransaction(e) {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedCategory = category.trim();
    const numericAmount = Number(amount);

    if (!trimmedTitle || !trimmedCategory || !date || Number.isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please fill in all fields with a positive amount.");
      return;
    }

    setLoading(true);
    setError("");

    const { error } = await supabase.from("transactions").insert([
      {
        user_id: session.user.id,
        title: trimmedTitle,
        amount: numericAmount,
        type,
        category: trimmedCategory,
        transaction_date: date,
      },
    ]);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setTitle("");
    setAmount("");
    setCategory("");
    setDate("");

    await fetchTransactions();
  }

  async function deleteTransaction(id) {
    setError("");

    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id);

    if (error) {
      setError(error.message);
      return;
    }

    await fetchTransactions();
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setError(error.message);
    }
  }

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="page-shell dashboard-shell">
      <header className="dashboard-hero">
        <div>
          <p className="eyebrow">Personal Finance Dashboard</p>
          <h1>Track your money with clarity.</h1>
          <p className="muted">Stay on top of income, spending, and savings goals in one calm workspace.</p>
        </div>
        <button className="ghost-button" onClick={logout}>Logout</button>
      </header>

      {error ? <p className="alert-box" role="alert">{error}</p> : null}

      <section className="summary-grid">
        <article className="stat-card positive">
          <span>Balance</span>
          <strong>₹{balance}</strong>
        </article>
        <article className="stat-card neutral">
          <span>Total Income</span>
          <strong>₹{totalIncome}</strong>
        </article>
        <article className="stat-card negative">
          <span>Total Expense</span>
          <strong>₹{totalExpense}</strong>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="panel">
          <p className="eyebrow">Add transaction</p>
          <h2>New entry</h2>
          <p className="muted">Record a new income or expense in a few clicks.</p>

          <form className="form-grid" onSubmit={addTransaction}>
            <div className="field-group">
              <label htmlFor="title">Title</label>
              <input id="title" className="input" type="text" placeholder="Salary, Groceries, Rent" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="field-group">
              <label htmlFor="amount">Amount</label>
              <input id="amount" className="input" type="number" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>

            <div className="field-group">
              <label htmlFor="type">Type</label>
              <select id="type" className="select" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div className="field-group">
              <label htmlFor="category">Category</label>
              <input id="category" className="input" type="text" placeholder="Food, Bills, Freelance" value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>

            <div className="field-group">
              <label htmlFor="date">Date</label>
              <input id="date" className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>

            <button className="primary-button" type="submit">Add Transaction</button>
          </form>
        </article>

        <article className="panel">
          <p className="eyebrow">Recent activity</p>
          <h2>Transaction history</h2>
          <p className="muted">Your latest entries appear here.</p>

          {loading ? <p className="empty-state">Loading transactions...</p> : null}

          {transactions.length === 0 && !loading ? (
            <p className="empty-state">No transactions yet. Add your first entry to get started.</p>
          ) : (
            <div className="transaction-table-wrap">
              <table className="transaction-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{transaction.transaction_date}</td>
                      <td>{transaction.title}</td>
                      <td>{transaction.category}</td>
                      <td><span className="badge">{transaction.type}</span></td>
                      <td>₹{transaction.amount}</td>
                      <td>
                        <button className="delete-button" onClick={() => deleteTransaction(transaction.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </section>
    </div>
  );
}

export default Dashboard;