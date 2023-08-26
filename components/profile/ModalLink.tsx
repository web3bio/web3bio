"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function ModalLink(props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = pathname.split("/");
  
  return (
    <Link
      {...props}
      onClick={(e) => {
        e.preventDefault();
        if (`/${params[params.length - 1]}` === props.href) return false;
        if (props.skip) return router.push(props.href);
        if (pathname.includes("/profile"))
          return router.replace("/profile" + props.href);
        return router.push("/profile" + props.href,{scroll:false});
      }}
    >
      {props.children}
    </Link>
  );
}
