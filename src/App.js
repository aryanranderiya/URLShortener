import "./App.css";

function Input({ placeholder_text }) {
  return <input type="text" placeholder={placeholder_text}></input>;
}

function Form() {
  return (
    <>
      <h1>URL Shortener</h1>
      <form className="form">
        <Input placeholder_text="Enter long URL to shorten" />
        <Input placeholder_text="Enter short url code" />
      </form>
    </>
  );
}

function App() {
  return (
    <>
      <Form />
    </>
  );
}

export default App;
