import type { ReactNode } from "react";
import {
  Dialog as ShadcnDialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "../ui/dialog";

type dialogProps = {
  title: string;
  description: string;
  isOpen?: boolean;
  content: ReactNode;
  setIsOpen: () => void;
};

const Dialog = ({
  isOpen,
  title,
  description,
  content,
  setIsOpen,
}: dialogProps) => {
  return (
    <ShadcnDialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogClose onClick={() => setIsOpen()} />
      <DialogContent>
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
