import { cn } from "@/lib/styles";
import Link from "next/link";

interface MenuItemTextOnlyProps extends React.ComponentProps<typeof Link> {
  icon: React.ReactNode;
  label: string;
  isWrapped?: boolean;
}

export function MenuItemTextOnly({
  icon,
  label,
  className,
  href,
  isWrapped = true,
  ...props
}: MenuItemTextOnlyProps) {
  const comp = (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base",
        className,
      )}
      {...props}
    >
      {icon}
      {label}
    </Link>
  );

  if (isWrapped) return <li>{comp}</li>;
  return comp;
}
