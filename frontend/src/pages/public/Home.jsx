import HeroSection from './HeroSection';
import ProfilSection from './ProfilSection';
import ProgramSection from './ProgramSection';
import GaleriSection from './GaleriSection';
import BeritaSection from './BeritaSection';
import PpdbSection from './PpdbSection';
import KontakSection from './KontakSection';

export default function Home() {
    return (
        <div className="flex flex-col">
            <HeroSection />
            <ProfilSection />
            <ProgramSection />
            <GaleriSection />
            <BeritaSection />
            <PpdbSection />
            <KontakSection />
        </div>
    );
}
