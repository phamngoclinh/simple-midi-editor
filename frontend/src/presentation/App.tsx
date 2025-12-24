import { ModalProvider } from '../infrastructure/stores/modal/ModalContext';
import { StudioProvider } from '../infrastructure/stores/studio';
import NotificationManagement from './components/notification/NotificationManagement';
import Router from './routes/Router';

function App() {
  return (
    <ModalProvider>
      <StudioProvider>
        <Router />
      </StudioProvider>
      <NotificationManagement />
    </ModalProvider>
  );
}

export default App;
