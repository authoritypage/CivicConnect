import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import type { City } from "@shared/schema";

interface CityScrollerProps {
  onCitySelect?: (city: City) => void;
}

export default function CityScroller({ onCitySelect }: CityScrollerProps) {
  const { data: cities, isLoading } = useQuery<City[]>({
    queryKey: ["/api/cities"],
  });

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gov-text mb-2">Municipal Jurisdictions</h2>
          <p className="text-gov-text-secondary">Select a city to view detailed accountability data</p>
        </div>
        <div className="city-scroll overflow-x-auto pb-4">
          <div className="flex space-x-6 min-w-max">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gov-gray border border-gov-steel rounded-lg p-6 min-w-[280px] animate-pulse">
                <div className="w-12 h-12 bg-gov-steel rounded-lg mb-4"></div>
                <div className="h-6 bg-gov-steel rounded mb-2"></div>
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="h-8 bg-gov-steel rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gov-text mb-2">Municipal Jurisdictions</h2>
        <p className="text-gov-text-secondary">Select a city to view detailed accountability data</p>
      </div>
      
      <div className="city-scroll overflow-x-auto pb-4">
        <div className="flex space-x-6 min-w-max">
          {cities?.map((city) => (
            <Card 
              key={city.id} 
              className="bg-gov-gray border-gov-steel hover:border-gov-text-secondary transition-colors cursor-pointer min-w-[280px]"
              onClick={() => onCitySelect?.(city)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gov-steel rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 bg-gov-text-secondary rounded"></div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gov-text-secondary">Active</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gov-text mb-2">{city.name}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gov-text-secondary">Population:</span>
                    <p className="text-gov-text font-medium">{city.population.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gov-text-secondary">Officials:</span>
                    <p className="text-gov-text font-medium">{city.totalOfficials}</p>
                  </div>
                  <div>
                    <span className="text-gov-text-secondary">Cases:</span>
                    <p className={`font-medium ${city.activeCases > 0 ? 'text-gov-red' : 'text-gov-text'}`}>
                      {city.activeCases}
                    </p>
                  </div>
                  <div>
                    <span className="text-gov-text-secondary">Score:</span>
                    <p className="text-gov-text font-medium">{city.transparencyScore}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
