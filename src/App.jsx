import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import SectionPage from './pages/SectionPage'
import ArticlePage from './pages/ArticlePage'
import AboutPage from './pages/AboutPage'
import NewsletterPage from './pages/NewsletterPage'
import SearchPage from './pages/SearchPage'
import AdminPage from './pages/AdminPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="newsletter" element={<NewsletterPage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="admin" element={<AdminPage />} />
              <Route path="terms" element={<TermsPage />} />
              <Route path="privacy" element={<PrivacyPage />} />
              <Route path=":section" element={<SectionPage />} />
              <Route path=":section/:slug" element={<ArticlePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </HelmetProvider>
  )
}
