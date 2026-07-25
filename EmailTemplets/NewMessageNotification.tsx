import {
  Html,
  Head,
  Font,
  Preview,
  Body,
  Container,
  Section,
  Row,
  Column,
  Text,
  Link,
  Hr,
} from "@react-email/components";

interface NewMessageNotificationProps {
  username: string;
  messagePreview: string;
  inboxLabel: string;
  dashboardUrl: string;
}

export default function NewMessageNotification({
  username,
  messagePreview,
  inboxLabel,
  dashboardUrl,
}: NewMessageNotificationProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>New Anonymous Message — Unsaid</title>
        <Font
          fontFamily="Roboto Mono"
          fallbackFontFamily="monospace"
          webFont={{
            url: "https://fonts.gstatic.com/s/robotomono/v23/L0xuDF4xlVMF-BfR8bXMIhJHg45mwgGEFl0_3vqPQ--5Ip2sSQ.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>New anonymous message received on Unsaid</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header with brand wordmark */}
          <Section style={headerStyle}>
            <Text style={wordmarkStyle}>UNSAID</Text>
            <div style={mintLineStyle} />
          </Section>

          {/* Badge */}
          <Section style={badgeSectionStyle}>
            <Text style={badgeStyle}>NEW ANONYMOUS MESSAGE</Text>
          </Section>

          {/* Greeting */}
          <Section style={{ padding: "0 32px" }}>
            <Text style={greetingStyle}>
              Hey {username},
            </Text>
            <Text style={subtextStyle}>
              You just received a new anonymous message in your{" "}
              <span style={inboxHighlightStyle}>{inboxLabel}</span> inbox.
            </Text>
          </Section>

          {/* Message preview card */}
          <Section style={previewSectionStyle}>
            <Section style={previewCardStyle}>
              <Row>
                <Column>
                  <Text style={previewLabelStyle}>MESSAGE PREVIEW</Text>
                </Column>
                <Column align="right">
                  <Text style={previewTimestampStyle}>JUST NOW</Text>
                </Column>
              </Row>
              <Hr style={previewDividerStyle} />
              <Text style={previewContentStyle}>
                &ldquo;{messagePreview}&rdquo;
              </Text>
            </Section>
          </Section>

          {/* CTA */}
          <Section style={ctaSectionStyle}>
            <Link href={dashboardUrl} style={ctaButtonStyle}>
              VIEW IN DASHBOARD
            </Link>
          </Section>

          {/* Divider */}
          <Hr style={footerDividerStyle} />

          {/* Footer */}
          <Section style={footerSectionStyle}>
            <Text style={footerTextStyle}>
              You received this email because you have notifications enabled on{" "}
              <Link href={dashboardUrl} style={footerLinkStyle}>
                Unsaid
              </Link>
              . You can disable email alerts anytime from your dashboard settings.
            </Text>
            <Text style={copyrightStyle}>
              © {new Date().getFullYear()} UNSAID. DESIGNED FOR CLARITY.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ——— Styles matching Unsaid's design system ———

const bodyStyle: React.CSSProperties = {
  backgroundColor: "#0a0a0a",
  margin: 0,
  padding: "40px 0",
  fontFamily: "'Roboto', Arial, sans-serif",
};

const containerStyle: React.CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#131313",
  border: "1px solid #313131",
  borderRadius: "20px",
  overflow: "hidden",
};

const headerStyle: React.CSSProperties = {
  padding: "40px 32px 0 32px",
};

const wordmarkStyle: React.CSSProperties = {
  fontFamily: "Impact, 'Arial Black', 'Helvetica Neue', sans-serif",
  fontSize: "36px",
  letterSpacing: "4px",
  color: "#ffffff",
  margin: 0,
  lineHeight: "1",
};

const mintLineStyle: React.CSSProperties = {
  height: "3px",
  width: "60px",
  backgroundColor: "#3cffd0",
  marginTop: "16px",
  borderRadius: "2px",
};

const badgeSectionStyle: React.CSSProperties = {
  padding: "24px 32px 0 32px",
};

const badgeStyle: React.CSSProperties = {
  display: "inline-block",
  fontFamily: "'Roboto Mono', 'Courier New', monospace",
  fontSize: "10px",
  fontWeight: 600,
  letterSpacing: "2px",
  color: "#131313",
  backgroundColor: "#3cffd0",
  padding: "6px 14px",
  borderRadius: "24px",
  margin: 0,
  textTransform: "uppercase" as const,
};

const greetingStyle: React.CSSProperties = {
  fontFamily: "'Roboto', Arial, sans-serif",
  fontSize: "20px",
  fontWeight: 700,
  color: "#ffffff",
  margin: "24px 0 8px 0",
  lineHeight: "1.4",
};

const subtextStyle: React.CSSProperties = {
  fontFamily: "'Roboto', Arial, sans-serif",
  fontSize: "14px",
  color: "#949494",
  margin: "0 0 24px 0",
  lineHeight: "1.6",
};

const inboxHighlightStyle: React.CSSProperties = {
  color: "#3cffd0",
  fontWeight: 600,
};

const previewSectionStyle: React.CSSProperties = {
  padding: "0 32px",
};

const previewCardStyle: React.CSSProperties = {
  backgroundColor: "#131313",
  border: "1px solid #313131",
  borderRadius: "2px",
  padding: "20px",
};

const previewLabelStyle: React.CSSProperties = {
  fontFamily: "'Roboto Mono', 'Courier New', monospace",
  fontSize: "10px",
  letterSpacing: "1.8px",
  color: "#3cffd0",
  margin: 0,
  textTransform: "uppercase" as const,
};

const previewTimestampStyle: React.CSSProperties = {
  fontFamily: "'Roboto Mono', 'Courier New', monospace",
  fontSize: "10px",
  letterSpacing: "1.8px",
  color: "#949494",
  margin: 0,
  textTransform: "uppercase" as const,
};

const previewDividerStyle: React.CSSProperties = {
  borderColor: "#313131",
  borderTop: "1px solid #313131",
  margin: "12px 0",
};

const previewContentStyle: React.CSSProperties = {
  fontFamily: "'Roboto', Arial, sans-serif",
  fontSize: "16px",
  color: "#ffffff",
  lineHeight: "1.7",
  margin: "8px 0 0 0",
  fontStyle: "italic",
};

const ctaSectionStyle: React.CSSProperties = {
  padding: "28px 32px 0 32px",
  textAlign: "center" as const,
};

const ctaButtonStyle: React.CSSProperties = {
  display: "inline-block",
  fontFamily: "'Roboto Mono', 'Courier New', monospace",
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "1.8px",
  color: "#000000",
  backgroundColor: "#3cffd0",
  padding: "14px 32px",
  borderRadius: "24px",
  textDecoration: "none",
  textTransform: "uppercase" as const,
};

const footerDividerStyle: React.CSSProperties = {
  borderColor: "#313131",
  borderTop: "1px solid #313131",
  margin: "32px 32px 0 32px",
};

const footerSectionStyle: React.CSSProperties = {
  padding: "20px 32px 32px 32px",
};

const footerTextStyle: React.CSSProperties = {
  fontFamily: "'Roboto', Arial, sans-serif",
  fontSize: "12px",
  color: "#949494",
  lineHeight: "1.6",
  margin: "0 0 12px 0",
};

const footerLinkStyle: React.CSSProperties = {
  color: "#3cffd0",
  textDecoration: "none",
};

const copyrightStyle: React.CSSProperties = {
  fontFamily: "'Roboto Mono', 'Courier New', monospace",
  fontSize: "10px",
  letterSpacing: "1.8px",
  color: "#949494",
  margin: 0,
  textTransform: "uppercase" as const,
};
