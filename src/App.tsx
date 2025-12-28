import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { InterfaceProvider } from './providers/InterfaceProvider';
import { WorkflowProvider } from './providers/WorkflowProvider';
import { MainLayout } from './components/Layout';
import {
  HomePage,
  ConfigurationPage,
  OutlinePage,
  BriefsPage,
  ConnectConfigPage,
  ConnectPage,
  TestYourselfPage,
  ExecutiveSummaryPage,
  NotFoundPage,
} from './pages';

function App() {
  return (
    <InterfaceProvider>
      <WorkflowProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="configuration" element={<ConfigurationPage />} />
              <Route path="outline" element={<OutlinePage />} />
              <Route path="briefs" element={<BriefsPage />} />
              <Route path="briefs/:index" element={<BriefsPage />} />
              <Route path="connect-configuration" element={<ConnectConfigPage />} />
              <Route path="connect" element={<ConnectPage />} />
              <Route path="test-yourself" element={<TestYourselfPage />} />
              <Route path="summary" element={<ExecutiveSummaryPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </WorkflowProvider>
    </InterfaceProvider>
  );
}

export default App;
