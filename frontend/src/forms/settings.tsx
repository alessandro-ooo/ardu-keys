import { useForm, type SubmitHandler } from "react-hook-form";
import {
  CloseConnection,
  ConnectToCOM,
} from "../../bindings/ardu-keys/services/COM/comservice";

type FormInputs = {
  ports: string[];
  currentCOMPort: string;
};

type SettingsProps = {
  data: FormInputs;
};

const SettingsForm = ({ data }: SettingsProps) => {
  const { register, handleSubmit, getValues } = useForm<FormInputs>({
    defaultValues: { ...data },
  });

  const onSubmit: SubmitHandler<FormInputs> = () => {
    const selectedPort = getValues("ports");

    CloseConnection();
    ConnectToCOM(selectedPort.toString());
  };

  console.log("Current COM port:", data.currentCOMPort);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <select {...register("ports")}>
        {data.ports.map((port, index) => (
          <option key={index} value={port}>
            {port}
          </option>
        ))}
      </select>
      <input type="submit" />
    </form>
  );
};

export default SettingsForm;
