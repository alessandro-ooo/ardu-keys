import { Route } from "wouter";
import Settings from "./wouter/settings/settings";

function App() {
  return (
    <div className="min-h-screen w-full bg-zinc-900">
      <Route path="/" component={Settings} />
    </div>
  );
}

export default App;
