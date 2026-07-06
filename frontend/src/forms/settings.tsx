import { useForm, type SubmitHandler } from "react-hook-form";
import {
  CloseConnection,
  ConnectToCOM,
} from "../../bindings/ardu-keys/services/COM/comservice";
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
  const [isConnectionEstablished, setIsConnectionEstablished] = useState(false);

  const showDialog = editingKey !== null;

  Events.On("com:isConnectionEstablished", (event) => {
    setIsConnectionEstablished(event.data);
  });

  const { register, handleSubmit, getValues, setValue, reset, watch } =
    useForm<FormInputs>({
      defaultValues: { ...data },
    });

  console.log(watch());

  const onSubmit: SubmitHandler<FormInputs> = () => {
    const selectedPort = getValues("ports");

    CloseConnection();
    setValue("currentCOMPort", selectedPort.toString());
    ConnectToCOM(selectedPort.toString());
  };

  console.log("Current COM port:", data.currentCOMPort);
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
              <Button
                type="button"
                variant="default"
                onClick={() => {
                  setIsEditing(false);
                  setEditingKey(null);
                }}
              >
                Salva modifiche
              </Button>

              <Button
                type="button"
                variant="default"
                onClick={() => {
                  reset(data);
                  setIsEditing(false);
                  setEditingKey(null);
                  console.log("hi");
                }}
              >
                Annulla modifiche
              </Button>
            </div>
          )}
        </div>
      </div>

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

      <div className="border border-zinc-700 w-full hidden" />

      <select {...register("ports")} className="hidden">
        {data.ports.map((port, index) => (
          <option key={index} value={port}>
            {port}
          </option>
        ))}
      </select>
      <input type="submit" className="hidden" />

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
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
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
