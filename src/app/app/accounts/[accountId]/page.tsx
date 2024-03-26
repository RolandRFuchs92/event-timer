import { AccountForm } from "./form";

type AccountPageProps = {
  params: {
    accountId: string;
  };
};

export default async function AccountPage({ params }: AccountPageProps) {
  return <AccountForm />;
}
