import Image from "next/image";

export const CS_STORE_LOGO_SRC = "/cs-royal-boss-logo.jpg";

export function CS_StoreLogo({
  size = 36,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src={CS_STORE_LOGO_SRC}
      alt="Royal Boss"
      width={size}
      height={size}
      className={`rounded-md object-contain ${className}`}
      priority
    />
  );
}
