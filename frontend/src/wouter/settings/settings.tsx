import { useQuery } from "@tanstack/react-query";
import {
  ListCOMPorts,
  GetCurrentCOMPortName,
} from "../../../bindings/ardu-keys/services/COM/comservice";
import SettingsForm from "../../forms/settings";

const Settings = () => {
  const { data: ports, status: portsStatus } = useQuery({
    queryKey: ["ListCOMPorts"],
    queryFn: async () => {
      const ports = await ListCOMPorts();
      const currentCOMPort = await GetCurrentCOMPortName();
      return { ports, currentCOMPort };
    },
  });

  const hasFetched = portsStatus === "success";

  return (
    <div>
      {!hasFetched && <p>Loading...</p>}
      {hasFetched && <SettingsForm data={ports} />}
    </div>
  );
};

export default Settings;
