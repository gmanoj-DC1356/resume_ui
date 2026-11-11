import { queryClient } from '@/api/queryClient';
import { AuthProvider } from '@/auth/AuthContext';
import { AppRoutes } from '@/routes/AppRoutes';
import { store } from '@/store/store';
import { QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  )
}

export default App
