import { Shield, Search } from "lucide-react";
import DashboardOverview from "@/components/dashboard-overview";
import CityScroller from "@/components/city-scroller";
import OfficersDirectory from "@/components/officers-directory";
import CasesAnalysis from "@/components/cases-analysis";
import AIChat from "@/components/ai-chat";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gov-black">
      {/* Header */}
      <header className="bg-gov-gray border-b border-gov-steel px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gov-steel rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-gov-text" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gov-text">SB County Accountability</h1>
              <p className="text-sm text-gov-text-secondary">Government Transparency Portal</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#dashboard" className="text-gov-text-secondary hover:text-gov-text transition-colors">Dashboard</a>
            <a href="#cities" className="text-gov-text-secondary hover:text-gov-text transition-colors">Cities</a>
            <a href="#officers" className="text-gov-text-secondary hover:text-gov-text transition-colors">Officers</a>
            <a href="#cases" className="text-gov-text-secondary hover:text-gov-text transition-colors">Cases</a>
            <a href="#search" className="text-gov-text-secondary hover:text-gov-text transition-colors">Search</a>
          </nav>

          <Button className="bg-gov-steel hover:bg-gray-600 text-gov-text border-gov-charcoal">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <DashboardOverview />
        <CityScroller />
        <OfficersDirectory />
        <CasesAnalysis />
        <AIChat />
      </main>

      {/* Footer */}
      <footer className="bg-gov-gray border-t border-gov-steel px-6 py-8 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gov-text mb-4">About</h3>
              <ul className="space-y-2 text-sm text-gov-text-secondary">
                <li><a href="#" className="hover:text-gov-text transition-colors">Mission</a></li>
                <li><a href="#" className="hover:text-gov-text transition-colors">Methodology</a></li>
                <li><a href="#" className="hover:text-gov-text transition-colors">Data Sources</a></li>
                <li><a href="#" className="hover:text-gov-text transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gov-text mb-4">Cities</h3>
              <ul className="space-y-2 text-sm text-gov-text-secondary">
                <li><a href="#" className="hover:text-gov-text transition-colors">Santa Barbara</a></li>
                <li><a href="#" className="hover:text-gov-text transition-colors">Santa Maria</a></li>
                <li><a href="#" className="hover:text-gov-text transition-colors">Lompoc</a></li>
                <li><a href="#" className="hover:text-gov-text transition-colors">All Cities</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gov-text mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gov-text-secondary">
                <li><a href="#" className="hover:text-gov-text transition-colors">Public Records</a></li>
                <li><a href="#" className="hover:text-gov-text transition-colors">FOIA Requests</a></li>
                <li><a href="#" className="hover:text-gov-text transition-colors">Whistleblower</a></li>
                <li><a href="#" className="hover:text-gov-text transition-colors">Legal Framework</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gov-text mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gov-text-secondary">
                <li><a href="#" className="hover:text-gov-text transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-gov-text transition-colors">Terms of Use</a></li>
                <li><a href="#" className="hover:text-gov-text transition-colors">Disclaimer</a></li>
                <li><a href="#" className="hover:text-gov-text transition-colors">Data Usage</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gov-steel mt-8 pt-8 text-center">
            <p className="text-gov-text-secondary text-sm">© 2023 Santa Barbara County Accountability Portal. Committed to government transparency.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
