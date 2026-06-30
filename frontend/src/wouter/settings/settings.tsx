import { useQuery } from "@tanstack/react-query";
import {
  ListCOMPorts,
  GetCurrentCOMPortName,
} from "../../../bindings/ardu-keys/services/COM/comservice";
import { GetSettings } from "../../../bindings/ardu-keys/services/settings/settingsservice";
import SettingsForm from "../../forms/settings";

const Settings = () => {
  const { data: ports, status: portsStatus } = useQuery({
    queryKey: ["ListCOMPorts"],
    queryFn: async () => {
      const ports = await ListCOMPorts();
      const currentCOMPort = await GetCurrentCOMPortName();

      const kbdInputs = await GetSettings();
      return { ports, currentCOMPort, kbdInputs };
    },
  });

  const hasFetched = portsStatus === "success";

  return (
    <div className="">
      {!hasFetched && <p>Loading...</p>}
      {hasFetched && <SettingsForm data={ports} />}
    </div>
  );
};

export default Settings;
