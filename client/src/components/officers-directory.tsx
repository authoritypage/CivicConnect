import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, Shield, Building2, Scale } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Officer } from "@shared/schema";

const getOfficerIcon = (position: string) => {
  const pos = position.toLowerCase();
  if (pos.includes('mayor')) return User;
  if (pos.includes('police') || pos.includes('chief')) return Shield;
  if (pos.includes('manager')) return Building2;
  if (pos.includes('attorney') || pos.includes('da')) return Scale;
  return User;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-500';
    case 'under_review': return 'bg-yellow-500';
    case 'investigation': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'active': return 'Active';
    case 'under_review': return 'Under Review';
    case 'investigation': return 'Investigation';
    default: return 'Unknown';
  }
};

export default function OfficersDirectory() {
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedPosition, setSelectedPosition] = useState<string>("all");

  const { data: officers, isLoading } = useQuery<Officer[]>({
    queryKey: ["/api/officers"],
  });

  const filteredOfficers = officers?.filter(officer => {
    const cityMatch = selectedCity === "all" || officer.cityName === selectedCity;
    const positionMatch = selectedPosition === "all" || officer.position.toLowerCase().includes(selectedPosition.toLowerCase());
    return cityMatch && positionMatch;
  }) || [];

  const uniqueCities = [...new Set(officers?.map(o => o.cityName) || [])];
  const uniquePositions = ["Mayor", "Police Chief", "City Manager", "DA"];

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gov-text mb-2">Chief Officers Directory</h2>
            <p className="text-gov-text-secondary">Key municipal officials across Santa Barbara County</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gov-gray border border-gov-steel rounded-lg p-6 animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gov-steel rounded-lg flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gov-steel rounded mb-2"></div>
                  <div className="h-4 bg-gov-steel rounded mb-3"></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-8 bg-gov-steel rounded"></div>
                    <div className="h-8 bg-gov-steel rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gov-text mb-2">Chief Officers Directory</h2>
          <p className="text-gov-text-secondary">Key municipal officials across Santa Barbara County</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-48 bg-gov-steel border-gov-charcoal text-gov-text">
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent className="bg-gov-steel border-gov-charcoal">
              <SelectItem value="all">All Cities</SelectItem>
              {uniqueCities.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedPosition} onValueChange={setSelectedPosition}>
            <SelectTrigger className="w-48 bg-gov-steel border-gov-charcoal text-gov-text">
              <SelectValue placeholder="All Positions" />
            </SelectTrigger>
            <SelectContent className="bg-gov-steel border-gov-charcoal">
              <SelectItem value="all">All Positions</SelectItem>
              {uniquePositions.map(position => (
                <SelectItem key={position} value={position}>{position}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOfficers.map((officer) => {
          const IconComponent = getOfficerIcon(officer.position);
          return (
            <Card key={officer.id} className="bg-gov-gray border-gov-steel hover:border-gov-text-secondary transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gov-steel rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-8 h-8 text-gov-text-secondary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gov-text">{officer.name}</h3>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(officer.status)}`}></div>
                        <span className="text-xs text-gov-text-secondary">{getStatusText(officer.status)}</span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-gov-text-secondary text-sm mb-1">{officer.position}</p>
                      <p className="text-gov-text text-sm font-medium">{officer.cityName}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gov-text-secondary">Term:</span>
                        <p className="text-gov-text">{officer.term}</p>
                      </div>
                      <div>
                        <span className="text-gov-text-secondary">Cases:</span>
                        <p className={officer.activeCases > 0 ? 'text-gov-red' : 'text-gov-text'}>
                          {officer.activeCases}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
