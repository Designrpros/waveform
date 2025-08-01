// src/app/for-artists/page.tsx
"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import styled from 'styled-components';
// Removed unused Link import
import { UploadCloud, FileText, Users, Lock, BarChart2, Zap } from 'lucide-react'; // New icons for artist features
import Link from 'next/link'; // Re-added Link as it's used by StyledLinkButton

// --- Reused & Adapted Styled Components for Consistency ---
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
  padding-top: 8rem;
  padding-bottom: 8rem;
`;

const HeroContent = styled.div`
  margin: 0 auto;
  max-width: 60rem;
  position: relative;
  z-index: 10;
`;

const HeroBackgroundGlow = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(212, 85, 52, 0.25), transparent 70%);
  transform: translate(-50%, -50%);
  filter: blur(120px);
  pointer-events: none;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: ${({ theme }) => theme.text};
  @media (min-width: 640px) {
    font-size: 5.5rem;
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
  font-size: 1.375rem;
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

// Base styled component, now a div
const StyledButtonBase = styled.div`
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
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.buttonHoverBg};
  }
`;

const PrimaryButton = styled(StyledButtonBase)`
  background: ${({ theme }) => theme.accentGradient};
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
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

// New styled components for "How It Works" section
const HowItWorksGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 4rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
`;

const StepCard = styled(StyledFeatureCard)`
  text-align: left;
  padding: 1.5rem;
`;

const StepNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  /* *** THIS IS THE FIX *** */
  /* Using the safe accentColor property */
  color: ${({ theme }) => theme.accentColor};
  margin-bottom: 0.5rem;
`;

const StepTitle = styled.h4`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.5rem;
`;

const StepDescription = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.subtleText};
  line-height: 1.5;
`;


// --- Helper Components ---
const FeatureCard = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <StyledFeatureCard>
    <FeatureIconWrapper>{icon}</FeatureIconWrapper>
    <FeatureTitle>{title}</FeatureTitle>
    <FeatureText>{children}</FeatureText>
  </StyledFeatureCard>
);

const ForArtistsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>For Artists - Waveform.ink</title>
        <meta name="description" content="Empower your sound with WaveForum. Upload, license, and distribute your music directly through Waveform.ink." />
      </Head>
      <Container>
        <HeroSection>
          <HeroBackgroundGlow />
          <HeroContent>
            <HeroTitle>
              Empower Your Sound
              <br />
              with <GradientText>WaveForum.</GradientText>
            </HeroTitle>
            <HeroSubtitle>
              Your direct portal to distribute music, gain unprecedented control, and connect with a passionate audience.
            </HeroSubtitle>
            <ButtonGroup>
              {/* Updated Link usage */}
              <Link href="#"> {/* Placeholder for the actual WaveForum upload portal link */}
                <PrimaryButton>Access WaveForum Portal</PrimaryButton>
              </Link>
            </ButtonGroup>
          </HeroContent>
        </HeroSection>

        <Section>
          <SectionTitle>Why Choose WaveForum?</SectionTitle>
          <SectionSubtitle>
            We believe in empowering creators by offering a platform where your music can thrive on its own terms.
          </SectionSubtitle>
          <FeatureGrid>
            <FeatureCard icon={<UploadCloud size={32} />} title="Direct Upload & Hosting">
              Upload your tracks directly to our secure cloud infrastructure. We handle the hosting and seamless distribution to Waveform app users.
            </FeatureCard>
            <FeatureCard icon={<FileText size={32} />} title="Flexible Licensing Options">
              You choose how your music is shared. Opt for Creative Commons licenses or select proprietary licensing for exclusive distribution.
            </FeatureCard>
            <FeatureCard icon={<Users size={32} />} title="Audience Engagement">
              Connect with listeners who specifically seek out independent and diverse music. Build a loyal fanbase without the noise of mainstream platforms.
            </FeatureCard>
            <FeatureCard icon={<Lock size={32} />} title="Full Control & Ownership">
              Maintain complete ownership and creative control over your work. Decide your licensing terms and how your music is presented.
            </FeatureCard>
            <FeatureCard icon={<BarChart2 size={32} />} title="Performance Insights">
              (Coming Soon) Track how your music is performing within the Waveform ecosystem with detailed analytics.
            </FeatureCard>
            <FeatureCard icon={<Zap size={32} />} title="Fast & Seamless Distribution">
              Get your music heard quickly. Our streamlined process ensures your tracks are available to listeners in no time.
            </FeatureCard>
          </FeatureGrid>
        </Section>

        <Section>
          <SectionTitle>How It Works</SectionTitle>
          <SectionSubtitle>
            Getting your music on Waveform.ink is a simple, step-by-step process.
          </SectionSubtitle>
          <HowItWorksGrid>
            <StepCard>
              <StepNumber>01</StepNumber>
              <StepTitle>Create Your Account</StepTitle>
              <StepDescription>
                Sign up for a free WaveForum artist account. It&apos;s quick, easy, and your first step towards broader distribution.
              </StepDescription>
            </StepCard>
            <StepCard>
              <StepNumber>02</StepNumber>
              <StepTitle>Upload Your Music</StepTitle>
              <StepDescription>
                Upload your high-quality audio files and provide all necessary metadata, including artist name, track title, album, genre, and artwork.
              </StepDescription>
            </StepCard>
            <StepCard>
              <StepNumber>03</StepNumber>
              <StepTitle>Choose Your License</StepTitle>
              <StepDescription>
                Select the licensing terms for each track &ndash; Creative Commons for open sharing or proprietary for exclusive control.
              </StepDescription>
            </StepCard>
            <StepCard> {/* Corrected closing tag */}
              <StepNumber>04</StepNumber>
              <StepTitle>Review & Publish</StepTitle>
              <StepDescription>
                Review your submission. Once approved by our team, your music will be live and available for streaming and download in the Waveform app.
              </StepDescription>
            </StepCard> {/* Corrected closing tag */}
          </HowItWorksGrid>
        </Section>

        <Section style={{ textAlign: 'center' }}>
          <SectionTitle>Ready to Share Your Sound?</SectionTitle>
          <SectionSubtitle>
            Join the growing community of independent artists on Waveform.ink.
          </SectionSubtitle>
          <ButtonGroup style={{ marginTop: '2rem' }}>
            {/* Updated Link usage */}
            <Link href="#"> {/* Placeholder for the actual WaveForum upload portal link */}
              <PrimaryButton>Access WaveForum Portal</PrimaryButton>
            </Link>
          </ButtonGroup>
        </Section>
      </Container>
    </>
  );
};

export default ForArtistsPage;