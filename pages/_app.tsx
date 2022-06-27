import '../styles/globals.css'
import type { AppProps } from 'next/app'
import AppProvider from '../provider/AppProvider';
import ConfirmDeleteModal from '../components/confirmDeleteModal';
function MyApp({ Component, pageProps }: AppProps) {
  return (
      <AppProvider>
        <div className="w-full h-full min-h-screen bg-[#f5f6fa]">
          <Component {...pageProps} />
        </div>
        
      </AppProvider>
    );
}

export default MyApp
