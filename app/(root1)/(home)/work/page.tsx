import {
  LineItemOuterContainer,
  LineItemContainer,
  LineItemHeading,
  LineItemSubheading,
  LineItemDescription,
} from "../line-item";

export default function Page() {
  return (
    <LineItemOuterContainer>
      <LineItemContainer>
        <LineItemHeading>Vercel</LineItemHeading>
        <LineItemSubheading>2024 - Present</LineItemSubheading>
        <LineItemDescription>Core Maintainer of Next.js</LineItemDescription>
      </LineItemContainer>

      <LineItemContainer>
        <LineItemHeading>Faire</LineItemHeading>
        <LineItemSubheading>2020 - 2024</LineItemSubheading>
        <LineItemDescription>
          Progressed from Junior to Staff Engineer in 4 years
        </LineItemDescription>
      </LineItemContainer>
    </LineItemOuterContainer>
  );
}
