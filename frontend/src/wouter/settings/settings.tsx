import { useQuery } from "@tanstack/react-query";
import {
  ListCOMPorts,
  GetCurrentCOMPortName,
} from "../../../bindings/ardu-keys/services/COM/comservice";
import { GetSettings } from "../../../bindings/ardu-keys/services/settings/settingsservice";
import SettingsForm from "../../forms/settings";
import { toast } from "sonner";

const Settings = () => {
  const { data: ports, status: portsStatus } = useQuery({
    queryKey: ["ListCOMPorts"],
    queryFn: async () => {
      const ports = await ListCOMPorts().catch((error: Error) => {
        toast.error(error.message, { position: "top-center" });
        return [];
      });
      const currentCOMPort = await GetCurrentCOMPortName().catch(
        (error: Error) => {
          toast.error(error.message, {
            position: "top-center",
            className: "bg-red-500",
          });
          return "";
        },
      );

      /* 
        For future references, here is an explaination of why I had to use structuredClone:
        The issue is a weird interaction between what rhf expects and what wails provides.
        Basically when you init it creates a clone of the data and mutates it, however it only does this when there is an Object underlying the data and then it will deep clone (arrays/children instead of just toplevel)
        Wails when we return something from the bindings cast/create it as a class that has a Settings constructor not Object
        When rhf detects its !Object it uses the direct reference instead of copying which means it changes the values reset() uses directly
        structuredClone is basically just a deep clone of the object and its nested data and is a way to bypass this weird interaction. 

        - Atterpac (wails3 maintainer)
      */

      const kbdInputs = structuredClone(
        await GetSettings().catch((error: Error) => {
          toast.error(error.message, { position: "top-center" });
          return { D2: "0", D3: "0", D4: "0", D5: "0" };
        }),
      );
      return { ports, currentCOMPort, kbdInputs };
    },
  });

  const hasFetched = portsStatus === "success";

  console.log("fetc data", ports);

  return (
    <div className="">
      {!hasFetched && <p>Loading...</p>}
      {hasFetched && <SettingsForm data={ports} />}
    </div>
  );
};

export default Settings;
