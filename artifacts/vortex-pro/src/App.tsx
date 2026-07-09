import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import { AppProvider, useAppState } from './context/AppContext';
import { LandingPage } from './components/LandingPage';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { SosOverlay } from './components/SosOverlay';
import { AiAssistant } from './components/AiAssistant';

import Dashboard from './pages/Dashboard';
import Forecast from './pages/Forecast';
import Map from './pages/Map';

const queryClient = new QueryClient();

function AppLayout() {
  const { isUnlocked } = useAppState();

  return (
    <div className="min-h-[100dvh] w-full bg-slate-50 flex overflow-hidden font-sans">
      <LandingPage />
      
      {/* App Shell */}
      <div className={`flex w-full h-full transition-opacity duration-1000 ${isUnlocked ? 'opacity-100' : 'opacity-0'}`}>
        <Sidebar />
        
        <main className="flex-1 relative flex flex-col min-w-0 pb-16 md:pb-0">
          <Switch>
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/forecast" component={Forecast} />
            <Route path="/map" component={Map} />
            <Route path="/" component={Dashboard} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>

      <MobileNav />
      <AiAssistant />
      <SosOverlay />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <AppLayout />
          </WouterRouter>
        </AppProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
