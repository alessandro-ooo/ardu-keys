import { cn } from "@/lib/utils";

type KBDProps = {
  kbdName: string;
  digital: string;
  clickable: boolean;
  onClick?: (digital: string) => void;
};

const KBD = ({ kbdName, digital, clickable, onClick }: KBDProps) => {
  return (
    <button
      type="button"
      className={cn(
        "h-15 w-15 rounded-md bg-linear-to-tl from-zinc-800 to-zinc-700 flex pt-1 pl-1 pb-2 pr-2 text-xs",
        clickable && "cursor-pointer",
        // "active:h-13 active:w-13" <- "pressed" effect, TODO: gonna handle it with the board
      )}
      onClick={() => onClick && onClick(digital)}
    >
      <div className="bg-linear-to-r from-zinc-800 to-zinc-600 h-full w-full rounded-md pt-2 flex justify-center shadow-[inset_0_-3px_0_0_rgba(255,255,255,0.05),inset_0_1px_0_0_rgba(0,0,0,0.4)]">
        <div className="flex flex-col">
          <p className="font-semibold text-[13px]">{digital}</p>
          <p className="capitalize text-[10px]">{kbdName}</p>
        </div>
      </div>
    </button>
  );
};

export default KBD;
