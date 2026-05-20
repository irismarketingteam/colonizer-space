import { Outlet } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'
import NewsletterPopup from '../newsletter/NewsletterPopup'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 pt-14">
        <Outlet />
      </main>
      <Footer />
      <NewsletterPopup />
    </div>
  )
}
