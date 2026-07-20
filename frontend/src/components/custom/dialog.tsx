import type { ReactNode } from "react";
import {
  Dialog as ShadcnDialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

type dialogProps = {
  title: string;
  description: string;
  isOpen?: boolean;
  content: ReactNode;
};

const Dialog = ({ isOpen, title, description, content }: dialogProps) => {
  return (
    <ShadcnDialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        showCloseButton={false}
        className="bg-zinc-900 text-primary-foreground border border-zinc-300"
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </ShadcnDialog>
  );
};

export default Dialog;
