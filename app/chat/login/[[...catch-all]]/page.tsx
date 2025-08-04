import { SignIn, ClerkProvider } from "@clerk/nextjs";

export default function Page() {
  return (
    <ClerkProvider afterSignOutUrl="/chat">
      <div className="flex justify-center items-center min-h-[70vh]">
        <SignIn forceRedirectUrl="/chat" signUpForceRedirectUrl="/chat" />
      </div>
    </ClerkProvider>
  );
}
