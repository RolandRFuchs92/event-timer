import { SigninForm } from "./SignInForm";

export default function SignIn() {
  return (
    <div className="flex h-screen w-screen items-center justify-center overflow-hidden dark:bg-boxdark-2 dark:text-bodydark">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="w-full border-stroke dark:border-strokedark  xl:border-l-2">
          <SigninForm />
        </div>
      </div>
    </div>
  );
}
