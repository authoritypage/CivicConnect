import { useQuery } from "@tanstack/react-query";
import { Building2, Users, AlertTriangle, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardStats {
  totalCities: number;
  totalOfficers: number;
  activeCases: number;
  transparencyScore: number;
}

export default function DashboardOverview() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gov-text mb-2">Santa Barbara County Overview</h2>
          <p className="text-gov-text-secondary">Comprehensive accountability tracking across all municipal jurisdictions</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gov-gray border border-gov-steel rounded-lg p-6 animate-pulse">
              <div className="w-12 h-12 bg-gov-steel rounded-lg mb-4"></div>
              <div className="h-8 bg-gov-steel rounded mb-2"></div>
              <div className="h-4 bg-gov-steel rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gov-text mb-2">Santa Barbara County Overview</h2>
        <p className="text-gov-text-secondary">Comprehensive accountability tracking across all municipal jurisdictions</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gov-gray border-gov-steel">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gov-steel rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-gov-text" />
              </div>
              <span className="text-2xl font-bold text-gov-text">{stats?.totalCities || 0}</span>
            </div>
            <h3 className="text-sm font-medium text-gov-text-secondary">Cities Monitored</h3>
          </CardContent>
        </Card>

        <Card className="bg-gov-gray border-gov-steel">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gov-steel rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-gov-text" />
              </div>
              <span className="text-2xl font-bold text-gov-text">{stats?.totalOfficers || 0}</span>
            </div>
            <h3 className="text-sm font-medium text-gov-text-secondary">Officials Tracked</h3>
          </CardContent>
        </Card>

        <Card className="bg-gov-gray border-gov-steel">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gov-steel rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-gov-red" />
              </div>
              <span className="text-2xl font-bold text-gov-red">{stats?.activeCases || 0}</span>
            </div>
            <h3 className="text-sm font-medium text-gov-text-secondary">Active Cases</h3>
          </CardContent>
        </Card>

        <Card className="bg-gov-gray border-gov-steel">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gov-steel rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-gov-text" />
              </div>
              <span className="text-2xl font-bold text-gov-text">{stats?.transparencyScore || 0}%</span>
            </div>
            <h3 className="text-sm font-medium text-gov-text-secondary">Transparency Score</h3>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
