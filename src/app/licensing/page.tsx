// src/app/licensing/page.tsx
"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import styled from 'styled-components';
import Link from 'next/link';

// Reuse styled components for consistency
const ContentContainer = styled.div`
  max-width: 800px;
  margin: 4rem auto;
  padding: 2rem 1.5rem 4rem;
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  padding-bottom: 0.5rem;
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

const StyledLink = styled.a`
  color: ${({ theme }) => theme.accentColor};
  text-decoration: underline;
`;

const LicensingPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Licensing Guide - Waveform.ink</title>
        <meta name="description" content="Understanding the music licenses on the Waveform.ink platform." />
      </Head>
      <ContentContainer>
        <Title>Music Licensing Guide</Title>
        <Paragraph>
          At Waveform.ink, we are committed to respecting artist ownership while providing a rich library of music. All content on our platform falls under one of two main license categories, which are clearly indicated for each track and album.
        </Paragraph>

        <Subtitle>Proprietary License (All Rights Reserved)</Subtitle>
        <Paragraph>
          Most of the music uploaded directly by artists to the WaveForum portal is under a Proprietary License. This gives the artist full control over their work.
        </Paragraph>
        <List>
          <ListItem><strong>You Can:</strong> Stream this music for your personal, non-commercial enjoyment within the Waveform app.</ListItem>
          <ListItem><strong>You Can:</strong> Download tracks for offline playback *within the Waveform app* (if you are a Premium subscriber).</ListItem>
          <ListItem><strong>You Cannot:</strong> Export, share, reuse, remix, or redistribute this music in any way. All rights are reserved by the original artist.</ListItem>
        </List>

        <Subtitle>Creative Commons (CC) Licenses</Subtitle>
        <Paragraph>
          We are proud to host a large collection of music under Creative Commons licenses. This music, often sourced from archives like the Free Music Archive or released directly by artists, gives you more freedom. The specific freedoms depend on the type of CC license.
        </Paragraph>
        
        <h3>Attribution (BY)</h3>
        <Paragraph>
          This is a key component of all CC licenses we use. It means you must give **appropriate credit** to the original artist, provide a link to the license, and indicate if you made any changes.
        </Paragraph>
        
        <h3>ShareAlike (SA)</h3>
        <Paragraph>
          If you remix, transform, or build upon the material, you must distribute your contributions under the **same license** as the original.
        </Paragraph>
        
        <Paragraph>
          The specific CC licenses you will find on Waveform.ink are:
        </Paragraph>
        <List>
            <ListItem>
                <strong>CC BY 4.0:</strong> This license allows you to distribute, remix, adapt, and build upon the material in any medium or format, even commercially, as long as attribution is given to the creator.
            </ListItem>
            <ListItem>
                <strong>CC BY-SA 4.0:</strong> This license lets others remix, adapt, and build upon the work even for commercial purposes, as long as they credit the original creator and license their new creations under the identical terms.
            </ListItem>
        </List>
        <Paragraph>
          For full details on any license, you can click the license badge on any track or album page, or visit the official <StyledLink href="https://creativecommons.org/about/cclicenses/" target="_blank" rel="noopener noreferrer">Creative Commons website</StyledLink>.
        </Paragraph>
        
        <Subtitle>Your Responsibility</Subtitle>
        <Paragraph>
            By using our service, you agree to respect the license terms associated with each piece of music. For more detailed legal information, please see our <Link href="/terms-of-service" passHref><StyledLink>Terms of Service</StyledLink></Link>.
        </Paragraph>

      </ContentContainer>
    </>
  );
};

export default LicensingPage;