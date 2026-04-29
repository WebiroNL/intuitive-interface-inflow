/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Webiro'

const PlaceholderEmail = () => (
  <Html lang="nl" dir="ltr">
    <Head />
    <Preview>Bericht van {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Hallo</Heading>
        <Text style={text}>Dit is een placeholder template.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: PlaceholderEmail,
  subject: 'Bericht van Webiro',
  displayName: 'Placeholder',
  previewData: {},
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '20px 25px' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#000000', margin: '0 0 20px' }
const text = { fontSize: '14px', color: '#55575d', lineHeight: '1.5', margin: '0 0 25px' }
