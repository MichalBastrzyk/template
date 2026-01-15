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

export interface TodoItem {
  title: string;
  completed: boolean;
}

export interface TodosEmailProps {
  senderName?: string;
  recipientName?: string;
  todos: TodoItem[];
  listUrl?: string;
}

export function TodosEmail({
  senderName = "Someone",
  recipientName = "there",
  todos,
  listUrl,
}: TodosEmailProps) {
  const doneTodos = todos.filter((todo) => todo.completed);
  const pendingTodos = todos.filter((todo) => !todo.completed);

  return (
    <Html>
      <Preview>{senderName} shared their todo list with you</Preview>
      <Tailwind config={emailTailwindConfig}>
        <Head />
        <Body className="mx-auto my-auto bg-background px-2 font-sans antialiased">
          <Container className="mx-auto my-16 max-w-120">
            <Section className="mb-12">
              <Heading className="mx-0 mt-0 mb-4 p-0 text-left text-[26px] font-semibold tracking-tight text-foreground">
                {senderName} shared a list with you
              </Heading>
            </Section>

            <Section className="mb-10">
              <Text className="m-0 mb-4 text-[17px] leading-[1.6] text-foreground">
                Hi {recipientName},
              </Text>
              <Text className="m-0 mb-4 text-[17px] leading-[1.6] text-foreground">
                <strong>{senderName}</strong> wants to share their todo list
                with you. Here&apos;s what they&apos;ve been working on:
              </Text>
            </Section>

            {doneTodos.length > 0 && (
              <Section className="mb-8 rounded-lg border border-border bg-secondary/30 px-6 py-5">
                <Heading className="mx-0 mt-0 mb-4 p-0 text-left text-[20px] font-semibold tracking-tight text-foreground">
                  ✓ Done
                </Heading>
                {doneTodos.map((todo, index) => (
                  <Text
                    key={index}
                    className="m-0 mb-3 text-[15px] leading-[1.6] text-muted-foreground last:mb-0"
                  >
                    {todo.title}
                  </Text>
                ))}
              </Section>
            )}

            {pendingTodos.length > 0 && (
              <Section className="mb-8 rounded-lg border border-border bg-secondary/30 px-6 py-5">
                <Heading className="mx-0 mt-0 mb-4 p-0 text-left text-[20px] font-semibold tracking-tight text-foreground">
                  Todo
                </Heading>
                {pendingTodos.map((todo, index) => (
                  <Text
                    key={index}
                    className="m-0 mb-3 text-[15px] leading-[1.6] text-foreground last:mb-0"
                  >
                    {todo.title}
                  </Text>
                ))}
              </Section>
            )}

            {doneTodos.length === 0 && pendingTodos.length === 0 && (
              <Section className="mb-10 rounded-lg border border-border bg-secondary/30 px-6 py-8 text-center">
                <Text className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
                  The list is empty
                </Text>
              </Section>
            )}

            {listUrl && (
              <>
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
                            href={listUrl}
                            className="inline-block w-full max-w-full rounded-lg bg-primary px-6 py-4 text-center text-base font-medium text-primary-foreground no-underline sm:w-auto"
                            style={{
                              minWidth: "160px",
                              boxSizing: "border-box",
                              maxWidth: "100%",
                            }}
                          >
                            View list online
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Section>

                <Section className="mb-10">
                  <Text className="m-0 mb-2 text-[13px] leading-[1.6] text-muted-foreground">
                    Button not working? Copy this link into your browser:
                  </Text>
                  <Link
                    href={listUrl}
                    className="text-[13px] break-all text-primary underline"
                  >
                    {listUrl}
                  </Link>
                </Section>
              </>
            )}

            <Section className="mb-0">
              <Text className="m-0 text-[13px] leading-[1.6] text-muted-foreground">
                Keep up the great work!
              </Text>
            </Section>

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

export default TodosEmail;

TodosEmail.PreviewProps = {
  senderName: "Alex",
  recipientName: "Jordan",
  todos: [
    { title: "Complete project proposal", completed: true },
    { title: "Review design mockups", completed: true },
    { title: "Set up development environment", completed: false },
    { title: "Write documentation", completed: false },
  ],
  listUrl: "https://example.com/lists/shared-abc123",
} satisfies TodosEmailProps;
