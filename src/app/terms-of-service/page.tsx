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
        <title>Terms of Service - WaveForm</title>
        <meta name="description" content="WaveForm&apos;s Terms of Service outlining the conditions for using the application." />
      </Head>
      <ContentContainer>
        <Title>Terms of Service</Title>
        <Paragraph>
          Last updated: July 24, 2025
        </Paragraph>
        <Paragraph>
          Please read these Terms of Service (&quot;Terms&quot;, &quot;Terms of Service&quot;) carefully before using the WaveForm mobile application (the &quot;Service&quot;) operated by Vegar Lee Berentsen (&quot;Us&quot;, &quot;We&quot;, or &quot;Our&quot;).
        </Paragraph>
        <Paragraph>
          Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and others who access or use the Service.
        </Paragraph>
        <Paragraph>
          By accessing or using the Service You agree to be bound by these Terms. If You disagree with any part of the Terms then You may not access the Service.
        </Paragraph>

        <Subtitle>1. Usage Rights and Limitations</Subtitle>
        <Paragraph>
          WaveForm provides you with a personal, non-exclusive, non-transferable, limited license to use the application for your personal, non-commercial entertainment use.
        </Paragraph>
        <List>
          <ListItem>You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service without express written permission from Us.</ListItem>
          <ListItem>You must not transmit any worms or viruses or any code of a destructive nature.</ListItem>
          <ListItem>You agree not to use the Service in any way that violates applicable laws or regulations.</ListItem>
        </List>

        <Subtitle>2. Content and Third-Party Services</Subtitle>
        <Paragraph>
          The Service enables you to access music content from YouTube Music. WaveForm does not host or own this content. All content accessed through the Service is the property of its respective owners. Your use of such content is subject to the terms and conditions and privacy policies of the third-party providers (e.g., YouTube/Google).
        </Paragraph>
        <Paragraph>
          WaveForm is an independent application and is not endorsed by, directly affiliated with, authorized, or sponsored by Google or YouTube LLC.
        </Paragraph>

        <Subtitle>3. Premium Features</Subtitle>
        <Paragraph>
          WaveForm may offer certain premium features (e.g., offline downloads, unlimited library songs/playlists) available via in-app purchases. These features are subject to additional terms and conditions provided at the time of purchase through Apple&apos;s App Store (StoreKit). All payments are processed by Apple, and we do not handle or store your payment information.
        </Paragraph>

        <Subtitle>4. Intellectual Property</Subtitle>
        <Paragraph>
          The Service and its original content (excluding content provided by third parties), features and functionality are and will remain the exclusive property of Vegar Lee Berentsen. The Service is protected by copyright, trademark, and other laws of both Norway and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of WaveForm.
        </Paragraph>

        <Subtitle>5. Disclaimers</Subtitle>
        <Paragraph>
          The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. The Company makes no warranties, expressed or implied, regarding the operation or availability of the Service, or the information, content, and materials included therein.
        </Paragraph>
        <Paragraph>
          WaveForm does not guarantee the availability or accuracy of content from third-party services. Content may be removed or become unavailable without notice.
        </Paragraph>

        <Subtitle>6. Limitation of Liability</Subtitle>
        <Paragraph>
          In no event shall the Company, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) Your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of Your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.
        </Paragraph>

        <Subtitle>7. Governing Law</Subtitle>
        <Paragraph>
          These Terms shall be governed and construed in accordance with the laws of Norway, without regard to its conflict of law provisions.
        </Paragraph>

        <Subtitle>8. Changes to Terms</Subtitle>
        <Paragraph>
          We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is material, We will try to provide at least 30 days&apos; notice prior to any new terms taking effect. What constitutes a material change will be determined at Our sole discretion.
        </Paragraph>
        <Paragraph>
          By continuing to access or use Our Service after those revisions become effective, You agree to be bound by the revised terms. If You do not agree to the new terms, in whole or in part, please stop using the website and the Service.
        </Paragraph>

        <Subtitle>9. Contact Us</Subtitle>
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