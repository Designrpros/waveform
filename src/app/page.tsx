"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import styled, { createGlobalStyle, ThemeProvider, DefaultTheme } from 'styled-components';
import { Play, Music, Cloud, ArrowDownToLine, Radio, ListMusic, Apple, MonitorPlay, Sun, Moon } from 'lucide-react';

// --- Type Definition for Styled Components Theme ---
declare module 'styled-components' {
  export interface DefaultTheme {
    body: string;
    text: string;
    subtleText: string;
    cardBg: string;
    headerBg: string;
    borderColor: string;
    buttonBg: string;
    buttonHoverBg: string;
    backgroundImage: string;
    imageOpacity: string;
    accentGradient: string;
  }
}

// --- Theme Definition ---
const lightTheme: DefaultTheme = {
  body: '#f0ecec',
  text: '#1F2937',
  subtleText: '#6B7280',
  cardBg: 'rgba(255, 255, 255, 0.6)',
  headerBg: 'rgba(240, 236, 236, 0.7)',
  borderColor: 'rgba(0, 0, 0, 0.1)',
  buttonBg: 'rgba(0, 0, 0, 0.05)',
  buttonHoverBg: 'rgba(0, 0, 0, 0.1)',
  backgroundImage: 'url(/assets/MusicCircleLight.png)',
  imageOpacity: '1.0',
  accentGradient: 'linear-gradient(to right, #d45534, #7a2e1a)', // New Red Gradient
};

const darkTheme: DefaultTheme = {
  body: '#383434',
  text: '#F9FAFB',
  subtleText: '#9CA3AF',
  cardBg: 'rgba(56, 52, 52, 0.6)',
  headerBg: 'rgba(56, 52, 52, 0.5)',
  borderColor: 'rgba(255, 255, 255, 0.1)',
  buttonBg: 'rgba(255, 255, 255, 0.05)',
  buttonHoverBg: 'rgba(255, 255, 255, 0.1)',
  backgroundImage: 'url(/assets/MusicCircle.png)',
  imageOpacity: '0.2',
  accentGradient: 'linear-gradient(to right, #d45534, #7a2e1a)', // New Red Gradient
};

// --- Global Styles ---
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    background-color: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: background-color 0.3s ease, color 0.3s ease;
  }
`;

// --- Styled Components ---

const PageWrapper = styled.div`
  min-height: 100vh;
  position: relative;
  
  /* Layer 1: MusicCircle background */
  &::before {
    content: '';
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background-image: ${({ theme }) => theme.backgroundImage};
    background-size: cover;
    background-position: center;
    opacity: ${({ theme }) => theme.imageOpacity};
    z-index: -2;
    transition: opacity 0.5s ease;
  }

  /* Layer 2: DessertTree background, covers the screen */
  &::after {
    content: '';
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background-image: url('/assets/DessertTree.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    opacity: 0.15;
    z-index: -1;
    pointer-events: none;
  }
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

const StyledHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: ${({ theme }) => theme.headerBg};
  backdrop-filter: blur(12px);
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  transition: background-color 0.3s ease;
`;

const HeaderContent = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  padding-bottom: 1rem;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LogoImage = styled.img`
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 0.5rem;
`;

const LogoText = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

const HeaderActions = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const ThemeToggleButton = styled.button`
    background: ${({ theme }) => theme.buttonBg};
    border: 1px solid ${({ theme }) => theme.borderColor};
    color: ${({ theme }) => theme.subtleText};
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: ${({ theme }) => theme.buttonHoverBg};
        color: ${({ theme }) => theme.text};
    }
`;

const DownloadButton = styled.a`
  border-radius: 9999px;
  background: ${({ theme }) => theme.accentGradient};
  padding: 0.5rem 1.5rem;
  font-weight: 600;
  color: white;
  transition: all 0.3s ease;
  text-decoration: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
`;

const Section = styled.section`
  padding-top: 6rem;
  padding-bottom: 6rem;
  position: relative;
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

const StyledFooter = styled.footer`
  border-top: 1px solid ${({ theme }) => theme.borderColor};
`;

const FooterContent = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 2rem;
  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

const FooterLinks = styled.div`
    display: flex;
    gap: 1.5rem;
    margin-top: 1rem;
    @media (min-width: 640px) {
        margin-top: 0;
    }
`;

const FooterLink = styled.a`
    transition: color 0.2s;
    text-decoration: none;
    color: ${({ theme }) => theme.subtleText};
    &:hover {
        color: ${({ theme }) => theme.text};
    }
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
const Home: NextPage = () => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyle />
      <Head>
        <title>WaveForm - Your Music, Your Way</title>
        <meta name="description" content="WaveForm brings your music library to life with offline downloads, iCloud sync, and a seamless native experience on iOS and macOS." />
        <link rel="icon" href="/assets/WaveForm.jpeg" />
      </Head>
      
      <PageWrapper>
        <StyledHeader>
          <HeaderContent>
            <LogoContainer>
              <LogoImage src="/assets/WaveForm.jpeg" alt="WaveForm Logo" />
              <LogoText>WaveForm</LogoText>
            </LogoContainer>
            <HeaderActions>
                <ThemeToggleButton onClick={toggleTheme}>
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </ThemeToggleButton>
                <DownloadButton href="#">Download</DownloadButton>
            </HeaderActions>
          </HeaderContent>
        </StyledHeader>

        <main>
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
                  Save your favorite songs, albums, and playlists directly to your device. Listen anywhere, anytime.
                </FeatureCard>
                <FeatureCard icon={<Cloud className="h-6 w-6" />} title="iCloud Sync">
                  Your playlists and library are automatically synced across all your Apple devices.
                </FeatureCard>
                <FeatureCard icon={<ListMusic className="h-6 w-6" />} title="Advanced Playlist Management">
                  Create and manage your playlists with ease. Add songs from anywhere and organize your library your way.
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
                answer="WaveForm is a native music player application designed for Apple platforms (iOS, macOS, and visionOS) that provides a tailored listening experience. It offers dynamic waveform visualization, extensive content discovery, and personalized playback features."
              />
              <FAQItem
                question="Is WaveForm an official music app?"
                answer="No, WaveForm is an independently developed music application focused on providing a personalized and enhanced listening experience."
              />
              <FAQItem
                question="Do I need a premium music subscription?"
                answer="While WaveForm allows you to explore its music catalog, an active premium account is recommended for an ad-free and uninterrupted listening experience across its full range of available music."
              />
              <FAQItem
                question="How do I find music?"
                answer="You can find music by using the powerful search bar, exploring trending charts, or Browse top genres and artists within the app's discovery sections."
              />
              <FAQItem
                question="How does iCloud sync work?"
                answer="WaveForm uses Apple's Core Data with CloudKit to seamlessly sync your playlists and the list of songs in your library across all your Apple devices. Downloaded audio files are device-specific and can be downloaded on each device as needed."
              />
              <FAQItem
                question="Is my data private and secure?"
                answer="Yes, absolutely. WaveForm does not have its own servers; all your music library data and preferences are stored locally on your devices and synced securely through your private iCloud account. We never see your listening history or playlists. Anonymous analytics data may be collected to help improve the app's functionality and performance."
              />
              <FAQItem
                question="Does WaveForm support multiple platforms?"
                answer="Yes, WaveForm is available on iOS, macOS, and visionOS, providing a consistent and native music experience across all your Apple devices."
              />
              <FAQItem
                question="What are the main features of WaveForm?"
                answer="WaveForm offers a comprehensive suite of features including seamless music playback with dynamic waveform visualization, content discovery (trending music, genres, artists, albums, powerful search, and personalized radio stations), and robust library management (My Library, custom playlists, favorites, and offline downloads)."
              />
              <FAQItem
                question="How can I contact you for support or collaboration?"
                answer="You can reach out via the contact section on my website, Alcatelz.com, or check my CV on Designr.pro for more details."
              />
            </FAQContainer>
            </Section>
          </Container>
        </main>

        <StyledFooter>
          <FooterContent>
            <p>&copy; {new Date().getFullYear()} WaveForm. All rights reserved.</p>
            <FooterLinks>
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Terms of Service</FooterLink>
            </FooterLinks>
          </FooterContent>
        </StyledFooter>
      </PageWrapper>
    </ThemeProvider>
  );
};

export default Home;
