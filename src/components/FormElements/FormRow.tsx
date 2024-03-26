type FormRowProps = {
  children: React.ReactNode;
};

export function FormRow({ children }: FormRowProps) {
  return (
    <div className="mb-4.5 flex flex-col gap-6 xl:mb-0 xl:grid xl:grid-cols-2">
      {children}
    </div>
  );
}
