"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react'; // FIX: Add useState and useEffect imports for this component
import styled from 'styled-components'; // Import styled-components without theme definitions or global styles
import { Play, Music, Cloud, ArrowDownToLine, Radio, ListMusic, Apple, MonitorPlay } from 'lucide-react';

// --- Styled Components (only those specific to this page) ---
// (All styled components definitions that were previously in this file should remain here)
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
`;

const HeroContent = styled.div`
  margin: 0 auto;
  max-width: 48rem;
  position: relative;
  z-index: 10;
`;

const HeroBackgroundGlow = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(212, 85, 52, 0.2), transparent 70%);
  transform: translate(-50%, -50%);
  filter: blur(100px);
  pointer-events: none;
`;

const HeroTitle = styled.h1`
  font-size: 2.75rem;
  font-weight: 800;
  letter-spacing: -0.025em;
  color: ${({ theme }) => theme.text};
  @media (min-width: 640px) {
    font-size: 4.5rem;
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
  font-size: 1.125rem;
  color: ${({ theme }) => theme.subtleText};
  @media (min-width: 640px) {
    font-size: 1.25rem;
  }
`;

const ButtonGroup = styled.div`
  margin-top: 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

const StyledAppStoreButton = styled.a`
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
  &:hover {
    background-color: ${({ theme }) => theme.buttonHoverBg};
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  @media (min-width: 640px) {
    font-size: 3rem;
  }
`;

const SectionSubtitle = styled.p`
  margin-top: 1rem;
  color: ${({ theme }) => theme.subtleText};
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 3rem;
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
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  transition: background-color 0.3s ease;
`;

const FeatureIconWrapper = styled.div`
  margin-bottom: 1rem;
  display: flex;
  height: 3rem;
  width: 3rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: ${({ theme }) => theme.accentGradient};
  color: white;
`;

const FeatureTitle = styled.h3`
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

const FeatureText = styled.p`
  color: ${({ theme }) => theme.subtleText};
`;

const ShowcaseContainer = styled.div`
    position: relative;
    margin-top: 3rem;
`;

const ShowcaseImage = styled.img`
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 1rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
    border: 1px solid ${({ theme }) => theme.borderColor};
`;

// Inside your styled components definitions
const ShowcaseImageMobile = styled.img`
    position: absolute; /* Keep absolute positioning for overlap */
    width: 30%; /* Even further reduced width for mobile overlap (was 40%) */
    bottom: -2rem; /* Retain smaller vertical offset for mobile overlap */
    right: -1rem; /* Retain smaller horizontal offset for mobile overlap */
    height: auto;
    border-radius: 1rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
    border: 1px solid ${({ theme }) => theme.borderColor};
    display: block; /* Ensure it's always visible */
    transition: all 0.3s ease; /* Smooth transition for size and position changes */

    @media (min-width: 1024px) {
        width: 25%; /* Original size for desktop overlap */
        bottom: -4rem; /* Original vertical offset for desktop overlap */
        right: -2rem; /* Original horizontal offset for desktop overlap */
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

const AppStoreButton = ({ platform }: { platform: 'iOS' | 'macOS' }) => (
  <StyledAppStoreButton href="#">
    {platform === 'iOS' ? <Apple className="h-6 w-6" /> : <MonitorPlay className="h-6 w-6" />}
    <div>
      <p style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Download on the</p>
      <p style={{ fontSize: '1.125rem', fontWeight: 600, lineHeight: '1.2' }}>{platform === 'iOS' ? 'App Store' : 'Mac App Store'}</p>
    </div>
  </StyledAppStoreButton>
);

const FeatureCard = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <StyledFeatureCard>
    <FeatureIconWrapper>{icon}</FeatureIconWrapper>
    <FeatureTitle>{title}</FeatureTitle>
    <FeatureText>{children}</FeatureText>
  </StyledFeatureCard>
);

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false); // useState is used here
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
const Home: NextPage = () => {
  // Removed ThemeProvider and GlobalStyle, as these are now in ThemeLayoutClient.tsx
  // The Container here is for page-specific content, not the wrapper.
  return (
    <>
      <Head>
        <title>WaveForm - Your Music, Your Way</title>
        <meta name="description" content="WaveForm brings your music library to life with offline downloads, iCloud sync, and a seamless native experience on iOS and macOS." />
        <link rel="icon" href="/assets/WaveForm.jpeg" />
      </Head>
      
      {/* Content directly inside the main tag provided by ThemeLayoutClient */}
      <Container>
        <HeroSection>
          <HeroBackgroundGlow />
          <HeroContent>
            <HeroTitle>
              Your Music, Your Way.
              <br />
              <GradientText>Finally.</GradientText>
            </HeroTitle>
            <HeroSubtitle>
              WaveForm brings your entire music library to life with offline downloads, iCloud sync, and a seamless native experience on iOS, macOS & Vision Pro.
            </HeroSubtitle>
            <ButtonGroup>
              <AppStoreButton platform="iOS" />
              <AppStoreButton platform="macOS" />
            </ButtonGroup>
          </HeroContent>
        </HeroSection>

        <Section id="features">
          <div style={{ textAlign: 'center' }}>
            <SectionTitle>All The Features You Need</SectionTitle>
            <SectionSubtitle>Seamlessly integrated for the best listening experience.</SectionSubtitle>
          </div>
          <FeatureGrid>
            <FeatureCard icon={<Music className="h-6 w-6" />} title="A Native Experience">
              Enjoy a vast library of music in a clean, fast, and native interface. No more web wrappers.
            </FeatureCard>
            <FeatureCard icon={<ArrowDownToLine className="h-6 w-6" />} title="Offline Downloads">
              Save your favorite songs, albums, and playlists directly to your device. Listen anywhere, anytime. (Premium Feature)
            </FeatureCard>
            <FeatureCard icon={<Cloud className="h-6 w-6" />} title="iCloud Sync">
              Your playlists and library are automatically synced across all your Apple devices.
            </FeatureCard>
            <FeatureCard icon={<ListMusic className="h-6 w-6" />} title="Advanced Playlist Management">
              Create and manage your playlists with ease. Add songs from anywhere and organize your library your way. (Limited in Free Version)
            </FeatureCard>
            <FeatureCard icon={<Radio className="h-6 w-6" />} title="Start Radio">
              Discover new music by starting a radio station from any song, artist, or album.
            </FeatureCard>
            <FeatureCard icon={<Play className="h-6 w-6" />} title="Background Playback">
              Full support for background audio and native system media controls on both iOS and macOS.
            </FeatureCard>
          </FeatureGrid>
        </Section>
        <Section>
          <div style={{ textAlign: 'center' }}>
              <SectionTitle>Beautiful on Every Device</SectionTitle>
              <SectionSubtitle>A consistent and delightful experience on iPhone, iPad, and Mac.</SectionSubtitle>
          </div>
          <ShowcaseContainer>
              <ShowcaseImage
                  src="/assets/Screenshot_macOS.png"
                  alt="WaveForm on macOS"
                  onError={(e) => e.currentTarget.src = 'https://placehold.co/1200x600/111827/FFFFFF?text=macOS+Screenshot+Not+Found'}
              />
              <ShowcaseImageMobile
                  src="/assets/Screenshot_iOS.png"
                  alt="WaveForm on iOS"
                  onError={(e) => e.currentTarget.src = 'https://placehold.co/300x600/111827/FFFFFF?text=iOS+Screenshot'}
              />
          </ShowcaseContainer>
        </Section>

        <Section id="faq">
        <FAQContainer>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <SectionTitle>Frequently Asked Questions</SectionTitle>
          </div>
          <FAQItem
            question="What is WaveForm?"
            answer="WaveForm is a native music player application designed for Apple platforms (iOS, macOS, and visionOS) that lets you stream and manage music from YouTube Music. It offers dynamic waveform visualization, extensive content discovery, and personalized playback features."
          />
          <FAQItem
            question="Which platforms does WaveForm support?"
            answer="Yes, WaveForm is designed to provide a consistent and native music experience across iOS, macOS, and visionOS."
          />
          <FAQItem
            question="How do I find new music?"
            answer="You can discover music through the powerful search bar, exploring trending charts, browse top genres and artists, or create personalized radio stations based on any song within the YouTube Music section of the app."
          />
          <FAQItem
            question="What are WaveForm's core playback features?"
            answer="WaveForm offers seamless music playback, dynamic waveform visualization, personalized radio stations, and robust library management including custom playlists, favorites, and offline downloads."
          />
          <FAQItem
            question="How do I create and manage my music library and playlists?"
            answer="You can build your personal music library by adding songs, albums, artists, or playlists to 'My Library.' You can also mark songs as 'Favorites' and organize your downloaded tracks. Note that the free version has limits on the number of songs and custom playlists."
          />
          <FAQItem
            question="Are there any limits on songs or playlists in the free version?"
            answer="Yes, the free version of WaveForm allows you to add up to 50 songs to 'My Library' and create up to 3 custom playlists. Upgrading to WaveForm Premium unlocks unlimited library songs and playlists."
          />
          <FAQItem
            question="Can I download music for offline listening?"
            answer="Yes, WaveForm Premium allows you to download your favorite songs for offline playback, ensuring your music is always available, even without an internet connection."
          />
          <FAQItem
            question="How do I upgrade to WaveForm Premium?"
            answer="You can upgrade to Premium through the 'Premium' section in the app's settings, or by attempting to use a premium-only feature like downloading songs or exceeding free tier limits. The app will guide you through the process."
          />
          <FAQItem
            question="Is my music data secure and how is it backed up?"
            answer="Absolutely. All your music library data and preferences are stored locally on your device. WaveForm leverages iCloud for secure data backup and seamless syncing across your devices, utilizing end-to-end encryption. WaveForm does not have direct access to your personal music data."
          />
          <FAQItem
            question="What should I do if I encounter an error or 'music service not initialized' message?"
            answer="First, ensure you have a stable internet connection. Try restarting the app. If the issue persists, ensure your device's date and time are set correctly. This type of message often indicates a temporary connectivity issue or an internal app initialization problem that a restart can resolve. If you continue to experience problems, please contact support."
          />
          <FAQItem
            question="Who developed WaveForm and how can I contact support?"
            answer="WaveForm was developed by Vegar Lee Berentsen, an indie developer passionate about creating innovative media experiences for Apple users. For support, feedback, or collaboration inquiries, please use the 'Contact Us' button in the Support section of the app's settings, or visit Designr.pro for more details."
          />
        </FAQContainer>
        </Section>
      </Container>
    </>
  );
};

export default Home;