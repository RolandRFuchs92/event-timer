import { ClientForm } from "./ClientForm";
import { getAccountOptions, getClient } from "./actions";

type ClientFormPageProps = {
  params: {
    clientId: string;
  };
};

export default async function ClientFormPage({ params }: ClientFormPageProps) {
  const clientId = params.clientId;
  const accountOptions = await getAccountOptions();
  const client = await getClient(clientId);
  return <ClientForm accountOptions={accountOptions} client={client} />;
}
