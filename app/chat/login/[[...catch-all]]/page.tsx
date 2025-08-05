import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <SignIn forceRedirectUrl="/chat" signUpForceRedirectUrl="/chat" />
    </div>
  );
}
