import { useForm, type SubmitHandler } from "react-hook-form";
import {
  CloseConnection,
  ConnectToCOM,
} from "../../bindings/ardu-keys/services/COM/comservice";
import { SaveSettings } from "../../bindings/ardu-keys/services/settings/settingsservice";
import type { JSONSettings } from "bindings/ardu-keys/services/settings/models";
import KBD from "@/components/custom/kbd";
import { Button } from "@/components/ui/button";
import { Events } from "@wailsio/runtime";
import { useState } from "react";
import Bulb from "@/components/custom/bulb";
import Dialog from "@/components/custom/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { availableKeys } from "@/lib/keys.ts";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type FormInputs = {
  ports: string[];
  currentCOMPort: string;
  kbdInputs: JSONSettings;
};

type SettingsProps = {
  data: FormInputs;
};
const SettingsForm = ({ data }: SettingsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingKey, setEditingKey] = useState<
    "kbdInputs.D2" | "kbdInputs.D3" | "kbdInputs.D4" | "kbdInputs.D5" | null
  >(null);

  const [isConnectionEstablished, setIsConnectionEstablished] =
    useState<boolean>(false);

  const showDialog = editingKey !== null;

  Events.On("com:isConnectionEstablished", (event) => {
    const newStatus = event.data;
    setIsConnectionEstablished(newStatus);
  });

  const { handleSubmit, getValues, setValue, reset } = useForm<FormInputs>({
    defaultValues: { ...data },
  });

  const saveSettings = useMutation({
    mutationFn: async (data: string) => {
      await SaveSettings(data).catch((error: Error) => {
        toast.error(error.message, { position: "top-center" });
      });
    },
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsEditing(false);
    setEditingKey(null);
    const selectedPort = getValues("currentCOMPort");

    CloseConnection();
    await ConnectToCOM(selectedPort).catch((error: Error) => {
      toast.error(error.message, {
        position: "top-center",
      });
    });

    saveSettings.mutateAsync(JSON.stringify(data.kbdInputs));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-16 p-4"
    >
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <div className="flex flex-row gap-2 items-center">
            <h1 className="text-2xl text-white">Ardu-keys</h1>{" "}
            <Bulb status={isConnectionEstablished ? "green" : "red"} />
          </div>{" "}
          <p className="text-sm text-zinc-400">Configurazione tasti fisici</p>
        </div>

        <div>
          {!isEditing && (
            <Button variant="default" onClick={() => setIsEditing(true)}>
              Modifica associazione
            </Button>
          )}

          {isEditing && (
            <div className="flex flex-row gap-2">
              <Button type="submit" variant="default">
                Salva modifiche
              </Button>

              <Button
                type="button"
                variant="default"
                onClick={() => {
                  toast.info("Hai annullato le modifiche.", {
                    position: "top-center",
                  });
                  reset(data);
                  setIsEditing(false);
                  setEditingKey(null);
                }}
              >
                Annulla modifiche
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-row gap-7 items-center justify-center">
          <KBD
            digital={"D2"}
            kbdName={getValues("kbdInputs.D2")}
            clickable={isEditing}
            onClick={() => setEditingKey("kbdInputs.D2")}
          />
          <KBD
            digital={"D3"}
            kbdName={getValues("kbdInputs.D3")}
            clickable={isEditing}
            onClick={() => setEditingKey("kbdInputs.D3")}
          />
          <KBD
            digital={"D4"}
            kbdName={getValues("kbdInputs.D4")}
            clickable={isEditing}
            onClick={() => setEditingKey("kbdInputs.D4")}
          />
          <KBD
            digital={"D5"}
            kbdName={getValues("kbdInputs.D5")}
            clickable={isEditing}
            onClick={() => setEditingKey("kbdInputs.D5")}
          />
        </div>

        <div className="flex flex-row gap-2 w-full items-center justify-center text-white">
          <p>COM:</p> {!isEditing && <p>{getValues("currentCOMPort")}</p>}
          {isEditing && (
            <Select
              onValueChange={(value) => {
                console.log("vale:", value);
                setValue("currentCOMPort", value);
              }}
            >
              <SelectTrigger className="w-45">
                <SelectValue placeholder="COM" />
              </SelectTrigger>
              <SelectContent className="max-h-52 h-52 text-white">
                {data.ports.map((port, index) => (
                  <SelectItem className="text-white" key={index} value={port}>
                    {port}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <Dialog
        isOpen={showDialog}
        title="Settings"
        description={`Configura il tasto ${editingKey}`}
        content={
          editingKey ? (
            <div className="flex flex-col gap-4">
              <Select
                onValueChange={(value) =>
                  setValue(editingKey, value, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
                defaultValue={getValues(editingKey)}
              >
                <SelectTrigger className="w-45">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent className="max-h-52 h-52">
                  {availableKeys.map((key, index) => (
                    <SelectItem key={index} value={key}>
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex flex-row gap-2">
                <Button variant="default" onClick={() => setEditingKey(null)}>
                  Chiudi
                </Button>
              </div>
            </div>
          ) : null
        }
      />
    </form>
  );
};

export default SettingsForm;
