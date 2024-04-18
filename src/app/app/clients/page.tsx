import { getClients } from "./action";

export default async function ClientsPage() {
  const result = await getClients();
  return <pre>{JSON.stringify(result, null, 2)}</pre>;
}
