import { Toaster } from "@/components/ui/sonner";
import { Route } from "wouter";
import Settings from "./wouter/settings/settings";
import { Events } from "@wailsio/runtime";
import { toast } from "sonner";

function App() {
  Events.On("app:error", (event) => {
    console.log("FIRED");
    toast.error(event.data);
  });

  return (
    <div className="min-h-screen w-full bg-zinc-900">
      <Toaster />
      <Route path="/" component={Settings} />
    </div>
  );
}

export default App;
