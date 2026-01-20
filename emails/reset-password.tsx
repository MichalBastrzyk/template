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

export interface ResetPasswordProps {
  userName?: string;
  resetUrl: string;
  expiresIn?: string;
}

export function ResetPasswordTemplate({
  userName = "there",
  resetUrl,
  expiresIn = "1 hour",
}: ResetPasswordProps) {
  return (
    <Html>
      <Preview>Reset your password</Preview>
      <Tailwind config={emailTailwindConfig}>
        <Head />
        <Body className="mx-auto my-auto bg-background px-2 font-sans antialiased">
          <Container className="mx-auto my-16 max-w-120">
            {/* Header Section */}
            <Section className="mb-12">
              <Heading className="mx-0 mt-0 mb-4 p-0 text-left text-[26px] font-semibold tracking-tight text-foreground">
                Reset your password
              </Heading>
            </Section>

            {/* Main Content */}
            <Section className="mb-10">
              <Text className="m-0 mb-4 text-[17px] leading-[1.6] text-foreground">
                Hi {userName},
              </Text>
              <Text className="m-0 mb-4 text-[17px] leading-[1.6] text-foreground">
                We received a request to reset your password. Click the button
                below to create a new password. Link expires in{" "}
                <strong>{expiresIn}</strong>.
              </Text>
            </Section>

            {/* CTA Button */}
            <Section className="mb-10">
              <table
                className="w-full"
                align="center"
                role="presentation"
                cellPadding="0"
                cellSpacing="0"
              >
                <tbody>
                  <tr>
                    <td className="text-center">
                      <Button
                        href={resetUrl}
                        className="inline-block w-full max-w-full rounded-lg bg-primary px-6 py-4 text-center text-base font-medium text-primary-foreground no-underline sm:w-auto"
                        style={{
                          minWidth: "160px",
                          boxSizing: "border-box",
                          maxWidth: "100%",
                        }}
                      >
                        Reset password
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* Fallback Link */}
            <Section className="mb-10">
              <Text className="m-0 mb-2 text-[13px] leading-[1.6] text-muted-foreground">
                Button not working? Copy this link into your browser:
              </Text>
              <Link
                href={resetUrl}
                className="text-[13px] break-all text-primary underline"
              >
                {resetUrl}
              </Link>
            </Section>

            {/* Security Notice */}
            <Section className="mb-0">
              <Text className="m-0 text-[13px] leading-[1.6] text-muted-foreground">
                Didn&apos;t request a password reset? You can safely ignore this
                email.
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

export default ResetPasswordTemplate;

ResetPasswordTemplate.PreviewProps = {
  userName: "Alex",
  resetUrl: "https://example.com/auth/reset-password?token=abc123xyz789",
  expiresIn: "1 hour",
} satisfies ResetPasswordProps;
