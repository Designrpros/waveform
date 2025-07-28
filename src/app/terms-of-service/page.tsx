"use client"

import type { NextPage } from 'next';
import Head from 'next/head';
import styled from 'styled-components';

// Reuse styled components from Privacy Policy page for consistency
const ContentContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 1.5rem;
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 4rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
  margin-bottom: 2rem;
  text-align: center;
`;

const Subtitle = styled.h2`
  font-size: 1.75rem;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

const Paragraph = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.subtleText};
  margin-bottom: 1rem;
`;

const List = styled.ul`
  list-style: disc;
  margin-left: 1.5rem;
  margin-bottom: 1rem;
`;

const ListItem = styled.li`
  font-size: 1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.subtleText};
  margin-bottom: 0.5rem;
`;

const TermsOfServicePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Terms of Service - Waveform.ink</title>
        <meta name="description" content="Waveform.ink's Terms of Service outlining the conditions for using its platform and applications." />
      </Head>
      <ContentContainer>
        <Title>Terms of Service</Title>
        <Paragraph>
          Last updated: July 27, 2025
        </Paragraph>
        <Paragraph>
          Please read these Terms of Service (&quot;Terms&quot;, &quot;Terms of Service&quot;) carefully before using the Waveform.ink platform, including the Waveform mobile application and the WaveForum artist portal (collectively, the &quot;Service&quot;) operated by Studio 51 (&quot;Us&quot;, &quot;We&quot;, or &quot;Our&quot;).
        </Paragraph>
        <Paragraph>
          Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and artists who access or use the Service.
        </Paragraph>
        <Paragraph>
          By accessing or using the Service You agree to be bound by these Terms. If You disagree with any part of the Terms then You may not access the Service.
        </Paragraph>

        <Subtitle>1. Usage Rights and Limitations</Subtitle>
        <Paragraph>
          Waveform.ink provides you with a personal, non-exclusive, non-transferable, limited license to use the Waveform mobile application for your personal, non-commercial entertainment use.
        </Paragraph>
        <List>
          <ListItem>You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service or its content without express written permission from Us or the respective rights holders.</ListItem>
          <ListItem>You must not transmit any worms or viruses or any code of a destructive nature.</ListItem>
          <ListItem>You agree not to use the Service in any way that violates applicable laws or regulations, including intellectual property laws.</ListItem>
        </List>

        <Subtitle>2. Content and Licensing</Subtitle>
        <Paragraph>
          The Service hosts and distributes music content directly. This content includes:
        </Paragraph>
        <List>
          <ListItem>
            **Creative Commons Licensed Content:** Music obtained from archives like the Free Music Archive or provided by artists under Creative Commons licenses. Your use of this content is subject to the specific terms of the applicable Creative Commons license, which will be displayed with the content. Downloads of such content within the Waveform app may be exportable for personal use or further creative endeavors, as permitted by the specific license.
          </ListItem>
          <ListItem>
            **Proprietary/Directly Licensed Content:** Music owned by Studio 51 or acquired through direct licensing agreements with artists. Downloads of this content within the Waveform app are for *in-app offline playback only* and are not exportable outside the app, respecting the proprietary nature of these licenses.
          </ListItem>
        </List>
        <Paragraph>
          Artists using WaveForum to upload content grant Studio 51 the necessary rights to host, distribute, and make their music available through the Waveform app, according to the licensing terms chosen by the artist during the upload process. Artists are solely responsible for ensuring they have the necessary rights to upload and license their content.
        </Paragraph>

        <Subtitle>3. Artist Portal (WaveForum)</Subtitle>
        <Paragraph>
          The WaveForum portal allows artists to upload their music for distribution through the Waveform app. Artists agree to provide accurate information and to abide by the content submission guidelines. Studio 51 reserves the right to remove any content that violates these terms or applicable laws.
        </Paragraph>

        <Subtitle>4. Premium Features and Payments</Subtitle>
        <Paragraph>
          Waveform.ink may offer certain premium features or services (e.g., offline downloads, unlimited library songs/playlists, artist services) available via in-app purchases or subscription models. These features are subject to additional terms and conditions provided at the time of purchase. All payments are processed via secure third-party payment gateways, and we do not handle or store your sensitive payment information directly.
        </Paragraph>

        <Subtitle>5. Intellectual Property</Subtitle>
        <Paragraph>
          The Service and its original content (excluding music content provided by artists or Creative Commons archives), features and functionality are and will remain the exclusive property of Studio 51. The Service is protected by copyright, trademark, and other laws of both Norway and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Studio 51.
        </Paragraph>
        <Paragraph>
          Music content provided by artists or sourced under Creative Commons licenses remains the intellectual property of its respective owners, subject to the terms of the chosen license.
        </Paragraph>

        <Subtitle>6. Disclaimers</Subtitle>
        <Paragraph>
          The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. The Company makes no warranties, expressed or implied, regarding the operation or availability of the Service, or the information, content, and materials included therein.
        </Paragraph>
        <Paragraph>
          Studio 51 does not guarantee the continuous availability or accuracy of all content. Content may be removed or become unavailable without notice.
        </Paragraph>

        <Subtitle>7. Limitation of Liability</Subtitle>
        <Paragraph>
          In no event shall the Company, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) Your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of Your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.
        </Paragraph>

        <Subtitle>8. Governing Law</Subtitle>
        <Paragraph>
          These Terms shall be governed and construed in accordance with the laws of Norway, without regard to its conflict of law provisions.
        </Paragraph>

        <Subtitle>9. Changes to Terms</Subtitle>
        <Paragraph>
          We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is material, We will try to provide at least 30 days&apos; notice prior to any new terms taking effect. What constitutes a material change will be determined at Our sole discretion.
        </Paragraph>
        <Paragraph>
          By continuing to access or use Our Service after those revisions become effective, You agree to be bound by the revised terms. If You do not agree to the new terms, in whole or in part, please stop using the website and the Service.
        </Paragraph>

        <Subtitle>10. Contact Us</Subtitle>
        <Paragraph>
          If you have any questions about these Terms of Service, You can contact us:
        </Paragraph>
        <List>
          <ListItem>By email: designr.pros@gmail.com</ListItem>
        </List>
      </ContentContainer>
    </>
  );
};

export default TermsOfServicePage;
