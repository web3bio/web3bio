"use client";
import Link, { LinkProps } from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

interface ModalLinkProps extends LinkProps {
  className: string;
  title: string;
  skip?: number;
  children?: ReactNode;
  rel?: string;
  style?: Object;
}
export default function ModalLink(props: ModalLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = pathname.split("/");

  return (
    <Link
      {...props}
      onClick={(e) => {
        e.preventDefault();
        if (`/${params[params.length - 1]}` === props.href) return false;
        if (!!props.skip) return router.push(props.href.toString());
        if (pathname.includes("/profile"))
          return router.replace("/profile" + props.href);
        return router.push("/profile" + props.href, { scroll: false });
      }}
    >
      {props.children}
    </Link>
  );
}
