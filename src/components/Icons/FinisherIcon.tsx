import { cn } from "@/lib/styles";
import { SVGProps } from "react";
export function FinishersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      {...props}
      className={cn("fill-current", props.className)}
    >
      <line
        x1="256"
        y1="232"
        x2="256"
        y2="152"
        style={{
          fill: "none",
          stroke: "#000000",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "32px",
        }}
      />
      <line
        x1="256"
        y1="88"
        x2="256"
        y2="72"
        style={{
          fill: "none",
          stroke: "#000000",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "48px",
        }}
      />
      <line
        x1="132"
        y1="132"
        x2="120"
        y2="120"
        style={{
          fill: "none",
          stroke: "#000000",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "48px",
        }}
      />
      <circle
        cx="256"
        cy="272"
        r="32"
        style={{
          fill: "none",
          stroke: "#000000",
          strokeMiterlimit: "10",
          strokeWidth: "32px",
        }}
      />
      <path
        d="M256,96A176,176,0,1,0,432,272,176,176,0,0,0,256,96Z"
        style={{
          fill: "none",
          stroke: "#000000",
          strokeMiterlimit: "10",
          strokeWidth: "32px",
        }}
      />
    </svg>
  );
}
