import Link from "next/link";
import {
  LineItemContainer,
  LineItemHeading,
  LineItemOuterContainer,
  LineItemSubheading,
} from "../line-item";

export default function Page() {
  return (
    <LineItemOuterContainer>
      <LineItemContainer>
        <LineItemHeading>
          <Link href="/chat">𝐹𝒶𝓈𝓉 Chat</Link>
        </LineItemHeading>
        <LineItemSubheading>Showcasing Tool Calls that Return Server Components</LineItemSubheading>
      </LineItemContainer>

      <LineItemContainer>
        <LineItemHeading>
          <Link href="/dict">𝒻𝒶𝓈𝓉 Dictionary</Link>
        </LineItemHeading>
        <LineItemSubheading>
          Showcasing JavaScript-Free Sreaming
        </LineItemSubheading>
      </LineItemContainer>
    </LineItemOuterContainer>
  );
}
