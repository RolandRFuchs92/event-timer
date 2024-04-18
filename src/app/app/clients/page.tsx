import { ClientTable } from "./ClientTable";
import { getClients } from "./action";

export default async function ClientsPage() {
  const result = await getClients();
  return <ClientTable data={result} />;
}
