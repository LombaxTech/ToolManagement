import { useRouter } from "next/router";
import React, { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/tools");
  }, []);

  return <div>App</div>;
}
