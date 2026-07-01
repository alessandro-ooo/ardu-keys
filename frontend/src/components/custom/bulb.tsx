import { cn } from "@/lib/utils";

type bulbProps = {
  status: "green" | "red" | "yellow";
};

const Bulb = ({ status }: bulbProps) => {
  return (
    <div
      className={cn(
        "h-2 w-2 rounded-full",
        status === "green" &&
          "bg-green-500 shadow-[0_0_10px_2px_rgba(0,255,0,0.5)]",
        status === "red" &&
          "bg-red-500 shadow-[0_0_10px_2px_rgba(255,0,0,0.5)]",
        status === "yellow" &&
          "bg-yellow-500 shadow-[0_0_10px_2px_rgba(255,255,0,0.5)]",
      )}
    />
  );
};

export default Bulb;
