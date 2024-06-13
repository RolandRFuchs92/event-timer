import { enumToOptions } from "@/lib/helper";
import { AccountDefaultValues } from "../schema";
import { getAccount } from "./action";
import { AccountForm } from "./form";
import { RoleEnum } from "@prisma/client";

type AccountPageProps = {
  params: {
    accountId: string;
  };
};

export default async function AccountPage({ params }: AccountPageProps) {
  const account = await getAccount(params.accountId);
  const roleOptions = enumToOptions(RoleEnum);

  return <AccountForm
    account={account.data!}
    roleOptions={roleOptions}
  />;
}
