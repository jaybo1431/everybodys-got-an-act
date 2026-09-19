import { useState } from 'react';
import { SplashScreen } from './features/splash/SplashScreen';
import { HomeScreen } from './features/home/HomeScreen';
import { PlayFlow } from './features/play/PlayFlow';
import { PlaySessionProvider } from './state/PlaySessionContext';

type View = 'splash' | 'home' | 'play';

export default function App() {
  const [view, setView] = useState<View>('splash');

  if (view === 'splash') {
    return <SplashScreen onEnter={() => setView('home')} />;
  }

  if (view === 'home') {
    return <HomeScreen onPlayTogether={() => setView('play')} />;
  }

  // Fresh key each time we enter "Play Together" so leaving and
  // coming back starts a brand new GameSession.
  return (
    <PlaySessionProvider key="play-session">
      <PlayFlow />
    </PlaySessionProvider>
  );
}
