import { useQuery } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Case } from "@shared/schema";

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'bg-red-600 hover:bg-red-700';
    case 'high': return 'bg-yellow-600 hover:bg-yellow-700';
    case 'medium': return 'bg-green-600 hover:bg-green-700';
    case 'low': return 'bg-gray-600 hover:bg-gray-700';
    default: return 'bg-gray-600 hover:bg-gray-700';
  }
};

const getSeverityClass = (severity: string) => {
  switch (severity) {
    case 'critical': return 'severity-critical';
    case 'high': return 'severity-high';
    case 'medium': return 'severity-medium';
    case 'low': return 'severity-low';
    default: return 'severity-low';
  }
};

export default function CasesAnalysis() {
  const { data: cases, isLoading } = useQuery<Case[]>({
    queryKey: ["/api/cases"],
  });

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gov-text mb-2">Active Cases Analysis</h2>
            <p className="text-gov-text-secondary">Ongoing investigations and accountability reviews</p>
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gov-gray border border-gov-steel rounded-lg p-6 animate-pulse">
              <div className="h-6 bg-gov-steel rounded mb-3"></div>
              <div className="h-4 bg-gov-steel rounded mb-4"></div>
              <div className="flex space-x-6">
                <div className="h-4 bg-gov-steel rounded w-24"></div>
                <div className="h-4 bg-gov-steel rounded w-32"></div>
                <div className="h-4 bg-gov-steel rounded w-28"></div>
                <div className="h-4 bg-gov-steel rounded w-24"></div>
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
          <h2 className="text-2xl font-bold text-gov-text mb-2">Active Cases Analysis</h2>
          <p className="text-gov-text-secondary">Ongoing investigations and accountability reviews</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            <span className="text-gov-text-secondary">Critical</span>
            <div className="w-3 h-3 bg-yellow-500 rounded-full ml-4"></div>
            <span className="text-gov-text-secondary">High</span>
            <div className="w-3 h-3 bg-green-500 rounded-full ml-4"></div>
            <span className="text-gov-text-secondary">Medium</span>
            <div className="w-3 h-3 bg-gray-500 rounded-full ml-4"></div>
            <span className="text-gov-text-secondary">Low</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {cases?.map((case_) => (
          <Card key={case_.id} className={`bg-gov-gray border-gov-steel ${getSeverityClass(case_.severity)}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gov-text">{case_.title}</h3>
                    <Badge className={`text-white text-xs ${getSeverityColor(case_.severity)}`}>
                      {case_.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-gov-text-secondary text-sm mb-3">{case_.description}</p>
                  <div className="flex items-center space-x-6 text-sm">
                    <div>
                      <span className="text-gov-text-secondary">City:</span>
                      <span className="text-gov-text font-medium ml-1">{case_.cityName}</span>
                    </div>
                    <div>
                      <span className="text-gov-text-secondary">Officer:</span>
                      <span className="text-gov-text font-medium ml-1">{case_.officerName}</span>
                    </div>
                    <div>
                      <span className="text-gov-text-secondary">Status:</span>
                      <span className="text-gov-text font-medium ml-1">{case_.status}</span>
                    </div>
                    <div>
                      <span className="text-gov-text-secondary">Date:</span>
                      <span className="text-gov-text font-medium ml-1">
                        {new Date(case_.dateReported).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-gov-text-secondary hover:text-gov-text"
                  >
                    <Eye className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
