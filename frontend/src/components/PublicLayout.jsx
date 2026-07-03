import Navbar from './Navbar';
import Footer from './Footer';

export default function PublicLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 pt-16">
            {/* Top Navigation Bar */}
            <Navbar />

            {/* Main Page Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Bottom Footer Section */}
            <Footer />
        </div>
    );
}

