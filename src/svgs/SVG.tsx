import React from "react";

interface SVGProps {
  color?: string;
  viewBox: string;
  path: any;
  size?: number;
  onClick?: any;
}

const SVG = ({
  color = "white",
  viewBox,
  path,
  size = 24,
  onClick,
}: SVGProps) => (
  <svg
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
    width={size || "24"}
    height={size || "24"}
    viewBox={viewBox}
    fill={color || undefined}
  >
    {path}
  </svg>
);

export default SVG;
