import { AccountsTable } from "./AccountTable";
import { getAccounts } from "./action";

export default async function MongoPage() {
  const data = await getAccounts();

  return <AccountsTable data={data} />;
}
