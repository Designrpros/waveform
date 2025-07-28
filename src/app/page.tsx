"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import styled from 'styled-components';
import { Music, Cloud, UploadCloud, Users, Sparkles, Globe } from 'lucide-react'; // New icons for conceptual content

// --- Styled Components (specific to this page) ---
const Section = styled.section`
  padding-top: 6rem;
  padding-bottom: 6rem;
  position: relative;
`;

const Container = styled.div`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  @media (min-width: 1024px) {
    max-width: 1024px;
  }
`;

const HeroSection = styled(Section)`
  text-align: center;
  padding-top: 8rem; /* More padding for main hero */
  padding-bottom: 8rem;
`;

const HeroContent = styled.div`
  margin: 0 auto;
  max-width: 60rem; /* Wider for more impactful text */
  position: relative;
  z-index: 10;
`;

const HeroBackgroundGlow = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 600px; /* Larger glow */
  height: 600px;
  background: radial-gradient(circle, rgba(212, 85, 52, 0.25), transparent 70%);
  transform: translate(-50%, -50%);
  filter: blur(120px); /* More blur */
  pointer-events: none;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem; /* Larger font */
  font-weight: 800;
  letter-spacing: -0.03em;
  color: ${({ theme }) => theme.text};
  @media (min-width: 640px) {
    font-size: 5.5rem; /* Even larger on desktop */
  }
`;

const GradientText = styled.span`
  background-image: ${({ theme }) => theme.accentGradient};
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const HeroSubtitle = styled.p`
  margin-top: 1.5rem;
  font-size: 1.375rem; /* Larger subtitle */
  color: ${({ theme }) => theme.subtleText};
  @media (min-width: 640px) {
    font-size: 1.5rem;
  }
`;

const ButtonGroup = styled.div`
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

const StyledButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.buttonBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  padding: 0.75rem 1.25rem;
  color: ${({ theme }) => theme.text};
  transition: background-color 0.2s;
  text-decoration: none;
  font-weight: 600;
  &:hover {
    background-color: ${({ theme }) => theme.buttonHoverBg};
  }
`;

const PrimaryButton = styled(StyledButton)`
  background: ${({ theme }) => theme.accentGradient};
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
`;

const SecondaryButton = styled(StyledButton)`
  background: transparent;
  border-color: ${({ theme }) => theme.borderColor};
  &:hover {
    background-color: ${({ theme }) => theme.buttonHoverBg};
  }
`;


const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  text-align: center;
  margin-bottom: 1rem;
  @media (min-width: 640px) {
    font-size: 3.5rem;
  }
`;

const SectionSubtitle = styled.p`
  margin-top: 1rem;
  color: ${({ theme }) => theme.subtleText};
  text-align: center;
  max-width: 48rem;
  margin-left: auto;
  margin-right: auto;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  margin-top: 4rem;
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const StyledFeatureCard = styled.div`
  border-radius: 1rem;
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  padding: 2rem;
  backdrop-filter: blur(10px);
  transition: background-color 0.3s ease;
  text-align: center;
`;

const FeatureIconWrapper = styled.div`
  margin-bottom: 1rem;
  display: flex;
  height: 4rem;
  width: 4rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: ${({ theme }) => theme.accentGradient};
  color: white;
  margin-left: auto;
  margin-right: auto;
`;

const FeatureTitle = styled.h3`
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

const FeatureText = styled.p`
  color: ${({ theme }) => theme.subtleText};
  line-height: 1.6;
`;

const ContentPathGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  margin-top: 4rem;
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr); /* Three columns for the three paths */
  }
`;

const PathCard = styled(StyledFeatureCard)`
  text-align: left;
  padding: 1.5rem;
`;

const PathTitle = styled.h3`
  font-size: 1.375rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.75rem;
`;

const PathDescription = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.subtleText};
  line-height: 1.5;
`;

const PathList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 1rem;
`;

const PathListItem = styled.li`
  color: ${({ theme }) => theme.subtleText};
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  &::before {
    content: '✓';
    color: #4CAF50; /* Green checkmark */
    font-weight: bold;
  }
`;

const FAQContainer = styled.div`
  margin: 0 auto;
  max-width: 48rem;
`;

const StyledFAQItem = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  padding: 1.5rem 0;
`;

const FAQButton = styled.button`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
`;

const FAQQuestion = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;

const FAQAnswer = styled.p`
  color: ${({ theme }) => theme.subtleText};
  line-height: 1.6;
`;

const FAQChevron = styled.svg<{ $isOpen: boolean }>`
    width: 1.25rem;
    height: 1.25rem;
    color: ${({ theme }) => theme.subtleText};
    transition: transform 0.2s;
    transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
`;


// --- Helper Components ---

const FeatureCard = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <StyledFeatureCard>
    <FeatureIconWrapper>{icon}</FeatureIconWrapper>
    <FeatureTitle>{title}</FeatureTitle>
    <FeatureText>{children}</FeatureText>
  </StyledFeatureCard>
);

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <StyledFAQItem>
      <FAQButton onClick={() => setIsOpen(!isOpen)}>
        <FAQQuestion>{question}</FAQQuestion>
        <FAQChevron $isOpen={isOpen} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </FAQChevron>
      </FAQButton>
      {isOpen && (
        <div style={{ marginTop: '1rem' }}>
          <FAQAnswer>{answer}</FAQAnswer>
        </div>
      )}
    </StyledFAQItem>
  );
};


// --- Main Page Component ---
const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Waveform.ink - Your Music Ecosystem | Player & Artist Portal</title>
        <meta name="description" content="Waveform.ink is your gateway to a unique music experience. Discover independent music with the Waveform app and empower artists with the WaveForum upload portal. Self-hosted content, Creative Commons, and proprietary music, all in one place." />
        <link rel="icon" href="/assets/WaveForm.jpeg" />
      </Head>
      
      <Container>
        <HeroSection>
          <HeroBackgroundGlow />
          <HeroContent>
            <HeroTitle>
              The Future of Music
              <br />
              <GradientText>Discovery & Distribution.</GradientText>
            </HeroTitle>
            <HeroSubtitle>
              Waveform.ink is building a comprehensive ecosystem for artists and listeners. Discover unique music, empower creators, and control your sound.
            </HeroSubtitle>
            <ButtonGroup>
              <PrimaryButton href="/download">Explore Waveform App</PrimaryButton>
              <SecondaryButton href="#for-artists">Become an Artist</SecondaryButton>
            </ButtonGroup>
          </HeroContent>
        </HeroSection>

        <Section id="discover">
          <SectionTitle>Discover Music, Reimagined.</SectionTitle>
          <SectionSubtitle>
            Dive into a curated library of independent artists and Creative Commons masterpieces. Experience music without limits, directly in the Waveform app.
          </SectionSubtitle>
          <FeatureGrid>
            <FeatureCard icon={<Music size={32} />} title="Vast & Diverse Library">
              Access thousands of tracks from independent artists and Creative Commons archives, all legally hosted and served by us.
            </FeatureCard>
            <FeatureCard icon={<Sparkles size={32} />} title="Unique Soundscapes">
              Explore genres and artists often overlooked by mainstream platforms. Find your next favorite track here.
            </FeatureCard>
            <FeatureCard icon={<Globe size={32} />} title="Global Community">
              Connect with a growing community of music lovers and creators who value open access and artistic freedom.
            </FeatureCard>
          </FeatureGrid>
        </Section>

        <Section id="for-artists">
          <SectionTitle>Empower Your Sound with WaveForum.</SectionTitle>
          <SectionSubtitle>
            For artists, WaveForum is your direct portal to distribute music, gain control, and connect with a dedicated audience.
          </SectionSubtitle>
          <FeatureGrid>
            <FeatureCard icon={<UploadCloud size={32} />} title="Direct Upload & Hosting">
              Upload your music directly to our platform. We handle the hosting and distribution to Waveform app users.
            </FeatureCard>
            <FeatureCard icon={<Cloud size={32} />} title="Flexible Licensing Options">
              Choose between Creative Commons for maximum reach or proprietary licensing for exclusive control within our ecosystem.
            </FeatureCard>
            <FeatureCard icon={<Users size={32} />} title="Audience Engagement">
              Connect directly with listeners who appreciate independent and diverse music, fostering a loyal fanbase.
            </FeatureCard>
          </FeatureGrid>
        </Section>

        <Section id="content-strategy">
          <SectionTitle>Our Content Strategy: Three Paths to Your Audience.</SectionTitle>
          <SectionSubtitle>
            We embrace a multi-faceted approach to ensure your music reaches its full potential.
          </SectionSubtitle>
          <ContentPathGrid>
            <PathCard>
              <PathTitle>Path 1: Mainstream Distribution</PathTitle>
              <PathDescription>
                Our studio's music continues to leverage established platforms like Distrokid for broad reach on Spotify, Apple Music, and YouTube. This ensures wide audience access and established monetization.
              </PathDescription>
              <PathList>
                <PathListItem>Broadest audience reach</PathListItem>
                <PathListItem>Utilizes existing monetization</PathListItem>
                <PathListItem>Minimal internal overhead</PathListItem>
              </PathList>
            </PathCard>
            <PathCard>
              <PathTitle>Path 2: Self-Hosted Creative Commons</PathTitle>
              <PathDescription>
                Music acquired under Creative Commons licenses (e.g., FMA sourced or studio's own CC releases) is self-hosted. This enables full in-app playback, downloads, and potential user export.
              </PathDescription>
              <PathList>
                <PathListItem>Full in-app control & playback</PathListItem>
                <PathListItem>Enhanced discovery for niche content</PathListItem>
                <PathListItem>Offline access & potential export</PathListItem>
              </PathList>
            </PathCard>
            <PathCard>
              <PathTitle>Path 3: Self-Hosted Proprietary/Licensed</PathTitle>
              <PathDescription>
                Our studio's non-CC music and other directly licensed content is self-hosted. This offers exclusive control, in-app playback, and in-app-only downloads, respecting proprietary licenses.
              </PathDescription>
              <PathList>
                <PathListItem>Exclusive content control</PathListItem>
                <PathListItem>Expanded unique library</PathListItem>
                <PathListItem>In-app only downloads</PathListItem>
              </PathList>
            </PathCard>
          </ContentPathGrid>
        </Section>

        <Section id="about">
          <FAQContainer>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <SectionTitle>About Waveform.ink</SectionTitle>
              <SectionSubtitle>
                Building the next generation of music experiences.
              </SectionSubtitle>
            </div>
            <FAQItem
              question="What is Waveform.ink?"
              answer="Waveform.ink is the umbrella platform for our music ecosystem, comprising the Waveform app (a native music player for Apple platforms) and WaveForum (a web portal for artists to upload and manage their music for distribution through Waveform.ink)."
            />
            <FAQItem
              question="What is the Waveform App?"
              answer="The Waveform App is a native music player application designed for Apple platforms (iOS, macOS, and visionOS). It allows users to stream and manage music from our self-hosted library, offering features like dynamic waveform visualization, extensive content discovery, and personalized playback features. You can learn more and download it on our dedicated download page."
            />
            <FAQItem
              question="What is WaveForum?"
              answer="WaveForum is the artist portal where creators can directly upload their music to be hosted by Studio 51 and distributed through the Waveform app. It provides artists with control over their licensing (Creative Commons or proprietary) and direct access to our growing audience."
            />
            <FAQItem
              question="How can artists get their music on Waveform.ink?"
              answer="Artists can use the WaveForum portal to upload their tracks. We offer flexible licensing options, including Creative Commons for broader sharing or proprietary licenses for exclusive distribution within our ecosystem. Visit the 'For Artists' section for more details on getting started."
            />
            <FAQItem
              question="Is all music on Waveform.ink self-hosted?"
              answer="Our platform primarily focuses on self-hosting music under Creative Commons licenses (including content sourced from platforms like Free Music Archive, with proper adherence to their terms) and proprietary music directly licensed or owned by Studio 51. This ensures full control over the user experience and compliance."
            />
            <FAQItem
              question="How does Waveform.ink handle music licensing?"
              answer="We offer artists the choice between Creative Commons licenses (e.g., CC BY, CC BY-SA) for broader reusability and proprietary licenses. For Creative Commons content, we ensure all license terms are respected and displayed. For proprietary content, downloads within the app are for in-app offline playback only, with no external export."
            />
            <FAQItem
              question="Who developed Waveform.ink and how can I contact support?"
              answer="Waveform.ink is developed by Studio 51, with core development led by Vegar Lee Berentsen, passionate about creating innovative media experiences. For support, feedback, or collaboration inquiries, please use the 'Contact Us' button in the Support section of the app's settings (for app-specific issues), or email us directly at designr.pros@gmail.com for platform-related inquiries."
            />
          </FAQContainer>
        </Section>
      </Container>
    </>
  );
};

export default HomePage;
