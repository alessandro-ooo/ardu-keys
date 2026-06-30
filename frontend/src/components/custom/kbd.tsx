import { Button } from "../ui/button";
import { Kbd } from "../ui/kbd";

type KBDProps = {
  kbdName: string;
};

const KBD = ({ kbdName }: KBDProps) => {
  return (
    <Button variant="outline">
      <Kbd className="bg-inherit">
        <p className="capitalize">{kbdName}</p>
      </Kbd>
    </Button>
  );
};

export default KBD;
