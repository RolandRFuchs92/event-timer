import { AccountDefaultValues } from "../schema";
import { getAccount } from "./action";
import { AccountForm } from "./form";

type AccountPageProps = {
  params: {
    accountId: string;
  };
};

export default async function AccountPage({ params }: AccountPageProps) {
  const account = await getAccount(params.accountId);

  return <AccountForm account={account.data!} />;
}
