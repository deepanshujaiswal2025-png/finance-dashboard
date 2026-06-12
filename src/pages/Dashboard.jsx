import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function Dashboard({ session }) {
  const [transactions, setTransactions] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  async function fetchTransactions() {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("transaction_date", { ascending: false });

    if (!error) {
      setTransactions(data);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function addTransaction(e) {
    e.preventDefault();

    const { error } = await supabase.from("transactions").insert([
      {
        user_id: session.user.id,
        title: title,
        amount: Number(amount),
        type: type,
        category: category,
        transaction_date: date,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    setTitle("");
    setAmount("");
    setCategory("");
    setDate("");

    fetchTransactions();
  }

  async function deleteTransaction(id) {
    await supabase
      .from("transactions")
      .delete()
      .eq("id", id);

    fetchTransactions();
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpense;

  return (
    <div>
      <h1>Personal Finance Dashboard</h1>

      <button onClick={logout}>Logout</button>

      <hr />

      <h2>Summary</h2>

      <p>Balance: ₹{balance}</p>
      <p>Total Income: ₹{totalIncome}</p>
      <p>Total Expense: ₹{totalExpense}</p>

      <hr />

      <h2>Add Transaction</h2>

      <form onSubmit={addTransaction}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <br />
        <br />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <br />
        <br />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <br />
        <br />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <br />
        <br />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <br />
        <br />

        <button type="submit">Add Transaction</button>
      </form>

      <hr />

      <h2>Transaction History</h2>

      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Date</th>
              <th>Title</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.transaction_date}</td>
                <td>{transaction.title}</td>
                <td>{transaction.category}</td>
                <td>{transaction.type}</td>
                <td>₹{transaction.amount}</td>
                <td>
                  <button
                    onClick={() =>
                      deleteTransaction(transaction.id)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;