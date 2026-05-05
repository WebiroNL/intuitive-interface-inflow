import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Button, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface PaymentLinkProps {
  recipientName?: string
  companyName?: string
  serviceDescription?: string
  monthlyAmount?: string
  discountText?: string
  contractStartDate?: string
  contractDuration?: string
  paymentUrl?: string
  isTest?: boolean
}

const PaymentLinkEmail = ({
  recipientName,
  companyName = 'klant',
  serviceDescription = '3 maanden Google Ads',
  monthlyAmount = '€500',
  discountText = '50% korting eerste 3 maanden',
  contractStartDate = '5 mei',
  contractDuration = '3 maanden',
  paymentUrl = '#',
  isTest = false,
}: PaymentLinkProps) => (
  <Html lang="nl" dir="ltr">
    <Head />
    <Preview>
      {isTest
        ? `[TEST] Betaalverzoek voor ${companyName}`
        : `Activeer je abonnement bij Webiro`}
    </Preview>
    <Body style={main}>
      <Container style={container}>
        {isTest && (
          <Section style={testBanner}>
            <Text style={testText}>
              TESTMODUS — Dit is een preview. De originele ontvanger zou {companyName} zijn.
            </Text>
          </Section>
        )}

        <Heading style={h1}>
          {recipientName ? `Hi ${recipientName},` : 'Hi,'}
        </Heading>

        <Text style={text}>
          Je abonnement bij Webiro staat klaar om geactiveerd te worden.
          Klik op de knop hieronder om je betaalmethode in te stellen via iDEAL.
          Stripe legt automatisch een SEPA mandaat vast voor de maandelijkse afschrijvingen.
        </Text>

        <Section style={summaryBox}>
          <Text style={summaryRow}><strong>Dienst:</strong> {serviceDescription}</Text>
          <Text style={summaryRow}><strong>Tarief:</strong> {monthlyAmount} per maand (ex. BTW)</Text>
          <Text style={summaryRow}><strong>Korting:</strong> {discountText}</Text>
          <Text style={summaryRow}><strong>Looptijd:</strong> {contractDuration}</Text>
          <Text style={summaryRow}><strong>Startdatum:</strong> {contractStartDate}</Text>
        </Section>

        <Section style={{ textAlign: 'center', margin: '32px 0' }}>
          <Button href={paymentUrl} style={button}>
            Abonnement activeren
          </Button>
        </Section>

        <Text style={smallText}>
          Werkt de knop niet? Kopieer deze link in je browser:<br />
          <a href={paymentUrl} style={link}>{paymentUrl}</a>
        </Text>

        <Hr style={hr} />

        <Text style={footerText}>
          Vragen? Reageer gewoon op deze mail.<br />
          Team Webiro
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: PaymentLinkEmail,
  subject: (d: Record<string, any>) =>
    d.isTest
      ? `[TEST] Betaalverzoek — ${d.companyName ?? 'klant'}`
      : `Activeer je abonnement bij Webiro`,
  displayName: 'Betaalverzoek (Stripe payment link)',
  previewData: {
    recipientName: 'Jordy',
    companyName: 'Royal Blue Spa',
    serviceDescription: '3 maanden Google Ads',
    monthlyAmount: '€500',
    discountText: '50% korting eerste 3 maanden',
    contractStartDate: '5 mei 2026',
    contractDuration: '3 maanden',
    paymentUrl: 'https://checkout.stripe.com/c/pay/cs_test_example',
    isTest: true,
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif' }
const container = { padding: '32px 24px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: '600', color: '#0a0a0a', margin: '0 0 16px' }
const text = { fontSize: '15px', color: '#333', lineHeight: '1.6', margin: '0 0 20px' }
const smallText = { fontSize: '12px', color: '#666', lineHeight: '1.5', margin: '20px 0 0', wordBreak: 'break-all' as const }
const footerText = { fontSize: '13px', color: '#888', margin: '20px 0 0', lineHeight: '1.5' }
const link = { color: '#3A4DEA', textDecoration: 'underline' }
const summaryBox = { backgroundColor: '#f7f8fb', borderRadius: '8px', padding: '16px 20px', margin: '24px 0', border: '1px solid #ececf2' }
const summaryRow = { fontSize: '14px', color: '#222', margin: '4px 0', lineHeight: '1.5' }
const button = { backgroundColor: '#3A4DEA', color: '#ffffff', padding: '14px 28px', borderRadius: '8px', fontSize: '15px', fontWeight: '600', textDecoration: 'none', display: 'inline-block' }
const hr = { borderColor: '#ececf2', margin: '32px 0 20px' }
const testBanner = { backgroundColor: '#fff8e1', border: '1px solid #ffd54f', borderRadius: '6px', padding: '10px 14px', margin: '0 0 24px' }
const testText = { fontSize: '12px', color: '#7a5a00', margin: '0', fontWeight: '600' as const }
