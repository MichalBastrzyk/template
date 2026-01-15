import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { emailTailwindConfig } from "./tailwind.config";

export interface YourEmailProps {
  userName?: string;
  actionUrl: string;
  description?: string;
}

export function YourEmail({
  userName = "there",
  actionUrl,
  description,
}: YourEmailProps) {
  return (
    <Html>
      <Preview>Preview text shown in email inbox (max 100 chars)</Preview>
      <Tailwind config={emailTailwindConfig}>
        <Head />
        <Body className="mx-auto my-auto bg-background px-2 font-sans antialiased">
          <Container className="mx-auto my-16 max-w-120">
            {/* Header Section */}
            <Section className="mb-12">
              <Heading className="mx-0 mt-0 mb-4 p-0 text-left text-[26px] font-semibold tracking-tight text-foreground">
                Email heading
              </Heading>
            </Section>

            {/* Main Content */}
            <Section className="mb-10">
              <Text className="m-0 mb-4 text-[17px] leading-[1.6] text-foreground">
                Hi {userName},
              </Text>
              <Text className="m-0 mb-4 text-[17px] leading-[1.6] text-foreground">
                Your email content goes here. Use multiple Text components for
                paragraphs.
              </Text>
              {description && (
                <Text className="m-0 mb-4 text-[17px] leading-[1.6] text-foreground">
                  {description}
                </Text>
              )}
            </Section>

            {/* CTA Button (optional) */}
            <Section className="mb-10 text-center">
              <Button
                href={actionUrl}
                className="inline-block w-full rounded-lg bg-primary px-6 py-4 text-center text-base font-medium text-primary-foreground no-underline sm:w-auto"
              >
                Action button text
              </Button>
            </Section>

            {/* Fallback Link (if button is used) */}
            <Section className="mb-10">
              <Text className="m-0 mb-2 text-[13px] leading-[1.6] text-muted-foreground">
                Button not working? Copy this link into your browser:
              </Text>
              <Link
                href={actionUrl}
                className="text-[13px] break-all text-primary underline"
              >
                {actionUrl}
              </Link>
            </Section>

            {/* Additional Information (optional) */}
            <Section className="mb-0">
              <Text className="m-0 text-[13px] leading-[1.6] text-muted-foreground">
                Additional context or security notice goes here.
              </Text>
            </Section>

            {/* Footer */}
            <Section className="mt-16 border-t border-border pt-6">
              <Text className="m-0 text-center text-[12px] leading-normal text-muted-foreground/60">
                Automated message — no replies please.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default YourEmail;

YourEmail.PreviewProps = {
  userName: "Alex",
  actionUrl: "https://example.com/action",
  description: "Optional additional context",
} satisfies YourEmailProps;
