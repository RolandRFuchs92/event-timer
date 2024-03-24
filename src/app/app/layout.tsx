import DefaultLayout from "@/components/Layouts/DefaultLayout";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return <DefaultLayout>{children}</DefaultLayout>;
}
