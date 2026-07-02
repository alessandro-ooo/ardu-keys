import { useForm, type SubmitHandler, type Path } from "react-hook-form";
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
  const [editingKey, setEditingKey] = useState<keyof JSONSettings | null>(null);
  const [isConnectionEstablished, setIsConnectionEstablished] = useState(false);

  const showDialog = editingKey !== null;

  const kbdEntries = Object.entries(data.kbdInputs) as Array<
    [keyof JSONSettings, string]
  >;

  Events.On("com:isConnectionEstablished", (event) => {
    setIsConnectionEstablished(event.data);
  });

  const { register, handleSubmit, getValues, setValue } = useForm<FormInputs>({
    defaultValues: { ...data },
  });

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
                variant="default"
                onClick={() => {
                  setIsEditing(false);
                  setEditingKey(null);
                }}
              >
                Salva modifiche
              </Button>

              <Button
                variant="default"
                onClick={() => {
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

      <div className="flex flex-row gap-7 items-center justify-center">
        {kbdEntries.map(([key, value]) => (
          <div className="flex flex-col gap-2 items-center text-white">
            <KBD
              kbdName={value}
              digital={key}
              clickable={isEditing}
              onClick={(digital) =>
                setEditingKey(digital as keyof JSONSettings)
              }
            />
          </div>
        ))}
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
        setIsOpen={() => {
          setEditingKey(null);
        }}
        isOpen={showDialog}
        title="Settings"
        description={`Configura il tasto ${editingKey}`}
        content={
          editingKey ? (
            <div className="flex flex-col gap-4">
              <input
                {...register(`kbdInputs.${editingKey}` as Path<FormInputs>)}
              />
            </div>
          ) : null
        }
      />
    </form>
  );
};

export default SettingsForm;
