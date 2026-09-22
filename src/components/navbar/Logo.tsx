import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/">
      <Image src="/images/ct-logo.svg" alt="logo" width={50} height={100} />
    </Link>
  );
}
