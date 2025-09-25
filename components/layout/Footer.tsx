import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4">Inspiraproject</h3>
            <p className="text-gray-300 mb-4">
              Solusi digital terpercaya untuk transformasi bisnis Anda dengan website profesional dan modern.
            </p>
            <p className="text-gray-400 text-sm">
              © 2024 Inspiraproject. All rights reserved.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Layanan</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="#" className="hover:text-white transition-colors">Website Perusahaan</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">E-commerce</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Portfolio</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Landing Page</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="#" className="hover:text-white transition-colors">Bantuan</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Kontak</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

