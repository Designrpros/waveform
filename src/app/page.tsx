// src/app/page.tsx
"use client";

import type { NextPage } from 'next';
import { useState } from 'react';
import styled from 'styled-components';
import { Music, UploadCloud, Users, Sparkles, Globe, FileText } from 'lucide-react';
import Link from 'next/link';

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
  font-size: 3.5rem;
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

const SecondaryButton = styled(StyledButtonBase)`
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
      <Container>
        <HeroSection>
          <HeroBackgroundGlow />
          <HeroContent>
            <HeroTitle>
              WaveForum
              <br />
              <GradientText>A Voice For Independent Music.</GradientText>
            </HeroTitle>
            <HeroSubtitle>
              WaveForum is a community-driven ecosystem for artists and listeners. Discover unique music, empower creators, and control your sound.
            </HeroSubtitle>
            <ButtonGroup>
              <Link href="/discover">
                <PrimaryButton>Explore Music</PrimaryButton>
              </Link>
              <Link href="/for-artists">
                <SecondaryButton>Become an Artist</SecondaryButton>
              </Link>
            </ButtonGroup>
          </HeroContent>
        </HeroSection>

        <Section id="discover">
          <SectionTitle>Discover Music, Reimagined.</SectionTitle>
          <SectionSubtitle>
            Dive into a curated library of independent artists and Creative Commons masterpieces. Experience music without limits, directly in the WaveForum app.
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
          <SectionTitle>Empower Your Sound.</SectionTitle>
          <SectionSubtitle>
            For artists, WaveForum is your direct portal to distribute music, gain control, and connect with a dedicated audience.
          </SectionSubtitle>
          <FeatureGrid>
            <FeatureCard icon={<UploadCloud size={32} />} title="Direct Upload & Hosting">
              Upload your music directly to our platform. We handle the hosting and distribution to WaveForum app users.
            </FeatureCard>
            <FeatureCard icon={<FileText size={32} />} title="Flexible Licensing Options">
              You choose how your music is shared. Opt for Creative Commons licenses or select proprietary licensing for exclusive distribution.
            </FeatureCard>
            <FeatureCard icon={<Users size={32} />} title="Audience Engagement">
              Connect directly with listeners who appreciate independent and diverse music, fostering a loyal fanbase.
            </FeatureCard>
          </FeatureGrid>
        </Section>

        <Section id="about">
          <FAQContainer>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <SectionTitle>About WaveForum</SectionTitle>
              <SectionSubtitle>
                Building the next generation of music experiences.
              </SectionSubtitle>
            </div>
            <FAQItem
              question="What is WaveForum?"
              answer="WaveForum is a music ecosystem comprising a native music player app for Apple platforms and a web portal for artists to upload and manage their music for distribution."
            />
            <FAQItem
              question="How can artists get their music on WaveForum?"
              answer="Artists can use the WaveForum portal to upload their tracks. We offer flexible licensing options, including Creative Commons for broader sharing or proprietary licenses for exclusive distribution within our ecosystem. All music is reviewed by our admin team for quality control."
            />
            <FAQItem
              question="Is all music on WaveForum self-hosted?"
              answer="Yes, our platform primarily focuses on self-hosting music under Creative Commons licenses (including content sourced from platforms like Free Music Archive) and proprietary music directly licensed or owned by Studio 51."
            />
            <FAQItem
              question="Who developed WaveForum?"
              answer="WaveForum is developed and maintained by Studio 51, a collective passionate about creating innovative media experiences. For support or inquiries, please email us directly at designr.pros@gmail.com."
            />
          </FAQContainer>
        </Section>
      </Container>
    </>
  );
};

export default HomePage;
