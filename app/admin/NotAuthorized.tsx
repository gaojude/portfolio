"use client";
import React from "react";
import { useRouter } from "next/navigation";

const NotAuthorized = () => {
  const [countdown, setCountdown] = React.useState(5);
  const { push } = useRouter();

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    if (countdown === 0) {
      push("/");
    }
  }, [countdown, push]);

  return (
    <div>
      <h1 className="content-center">You are not authorized.</h1>
      <p>Redirecting to home page in {countdown} second</p>
    </div>
  );
};

export default NotAuthorized;
