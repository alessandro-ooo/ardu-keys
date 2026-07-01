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

type FormInputs = {
  ports: string[];
  currentCOMPort: string;
  kbdInputs: JSONSettings;
};

type SettingsProps = {
  data: FormInputs;
};

const SettingsForm = ({ data }: SettingsProps) => {
  const [isConnectionEstablished, setIsConnectionEstablished] = useState(false);

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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 p-4">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <div className="flex flex-row gap-2 items-center">
            <h1 className="text-2xl text-white">Ardu-keys</h1>{" "}
            <Bulb status={isConnectionEstablished ? "green" : "red"} />
          </div>{" "}
          <p className="text-sm text-zinc-400">Configurazione tasti fisici</p>
        </div>

        <div>
          <Button variant="default">Modifica associazione</Button>
        </div>
      </div>

      <div className="flex flex-row gap-7 items-center justify-center">
        {Object.entries(data.kbdInputs).map(([key, value]) => (
          <div className="flex flex-col gap-2 items-center text-white">
            <KBD kbdName={value} digital={key} />
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
    </form>
  );
};

export default SettingsForm;
