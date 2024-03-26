import { AccountDefaultValues } from "../schema";
import { getAccount } from "./action";
import { AccountForm } from "./form";

type AccountPageProps = {
  params: {
    accountId: string;
  };
};

export default async function AccountPage({ params }: AccountPageProps) {
  const account =
    params.accountId !== "null"
      ? await getAccount(params.accountId)
      : AccountDefaultValues;

  return <AccountForm account={account} />;
}
