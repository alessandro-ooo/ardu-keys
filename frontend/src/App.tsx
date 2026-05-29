import "./App.css";
import { Route } from "wouter";
import Settings from "./wouter/settings/settings";

function App() {
  return (
    <>
      <Route path="/" component={Settings} />
    </>
  );
}

export default App;
