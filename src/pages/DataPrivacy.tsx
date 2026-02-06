import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Shield,
  Plus,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  Lock,
} from 'lucide-react';
import {
  useListarConsents,
  useListarPoliticas,
  useListarRegistrosAuditoria,
  useListarSolicitudes,
  useListarFrameworks,
  useListarPIAs,
  useListarBreaches,
  useObtenerDashboard,
} from '@/features/dataprivacy/hooks/useDataPrivacy';

export const DataPrivacyPage = () => {
  const [activeTab, setActiveTab] = useState('consents');
  const [busqueda, setBusqueda] = useState('');

  // Queries
  const { data: consents } = useListarConsents();
  const { data: policies } = useListarPoliticas();
  const { data: auditLogs } = useListarRegistrosAuditoria();
  const { data: solicitudes } = useListarSolicitudes();
  const { data: frameworks } = useListarFrameworks();
  const { data: pias } = useListarPIAs();
  const { data: breaches } = useListarBreaches();
  const { data: dashboard } = useObtenerDashboard();

  // Data extraction
  const consentsData = (consents as any)?.data?.consents || [];
  const policiesData = (policies as any)?.data?.politicas || [];
  const auditLogsData = (auditLogs as any)?.data?.logs || [];
  const solicitudesData = (solicitudes as any)?.data?.solicitudes || [];
  const frameworksData = (frameworks as any)?.data?.frameworks || [];
  const piasData = (pias as any)?.data?.pias || [];
  const breachesData = (breaches as any)?.data?.breaches || [];
  const dashboardData = (dashboard as any)?.data || {
    totalConsents: 0,
    acceptanceRate: 0,
    pendingRequests: 0,
    openBreaches: 0,
    complianceScore: 0,
  };

  // Stats
  const solicitudesPendientes = solicitudesData.filter((s: any) => s.status === 'pending_user_action').length;
  const brechesAbiertas = breachesData.filter((b: any) => b.status === 'under_investigation').length;
  const piasAprobadas = piasData.filter((p: any) => p.status === 'approved').length;

  const getConsentStatus = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'revoked':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRequestStatus = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-800';
      case 'partially_compliant':
        return 'bg-yellow-100 text-yellow-800';
      case 'non_compliant':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBreachSeverity = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 rounded-lg">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Data Privacy & Compliance</h1>
              <p className="text-blue-100 mt-1">GDPR, CCPA, and multi-framework compliance management</p>
            </div>
          </div>
          <Button className="bg-white text-blue-600 hover:bg-blue-50">
            <Plus className="w-4 h-4 mr-2" />
            New Policy
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Consent Rate</p>
                <p className="text-2xl font-bold text-blue-600">{dashboardData.acceptanceRate || 0}%</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg opacity-20">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Pending Requests</p>
                <p className="text-2xl font-bold text-yellow-600">{solicitudesPendientes}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg opacity-20">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Open Breaches</p>
                <p className="text-2xl font-bold text-red-600">{brechesAbiertas}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg opacity-20">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Compliance Score</p>
                <p className="text-2xl font-bold text-green-600">{dashboardData.complianceScore || 0}%</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg opacity-20">
                <Lock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">PIAs Approved</p>
                <p className="text-2xl font-bold text-purple-600">{piasAprobadas}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg opacity-20">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="consents">Consents</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="pia">Assessments</TabsTrigger>
          <TabsTrigger value="breaches">Breaches</TabsTrigger>
        </TabsList>

        {/* CONSENTS TAB */}
        <TabsContent value="consents" className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Search consents..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline">Filter</Button>
          </div>

          {consentsData.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No consents recorded yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {consentsData.map((c: any) => (
                <Card key={c.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{c.consentType}</h3>
                        <p className="text-xs text-gray-500 mt-1">User: {c.userId}</p>
                      </div>
                      <Badge className={getConsentStatus(c.status)}>
                        {c.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
                      <span>Basis: {c.legalBasis}</span>
                      <span>{new Date(c.consentedAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* RETENTION TAB */}
        <TabsContent value="retention" className="space-y-4">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            New Retention Policy
          </Button>

          {policiesData.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No retention policies defined</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {policiesData.map((p: any) => (
                <Card key={p.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{p.dataCategory}</h3>
                        <p className="text-xs text-gray-500 mt-1">{p.description}</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        {p.retentionPeriod} {p.retentionUnit}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">
                      Next Review: {new Date(p.nextReviewDate).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* AUDIT LOGS TAB */}
        <TabsContent value="audit" className="space-y-4">
          {auditLogsData.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No audit logs available</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {auditLogsData.slice(0, 10).map((log: any) => (
                <Card key={log.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{log.eventType}</p>
                        <p className="text-xs text-gray-500 mt-1">{log.description}</p>
                      </div>
                      <Badge className={log.severity === 'critical' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                        {log.severity}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>User: {log.userId}</span>
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* REQUESTS TAB */}
        <TabsContent value="requests" className="space-y-4">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            New Data Request
          </Button>

          {solicitudesData.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No data subject requests</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {solicitudesData.map((s: any) => (
                <Card key={s.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{s.requestType}</h3>
                        <p className="text-xs text-gray-500 mt-1">{s.description}</p>
                      </div>
                      <Badge className={getRequestStatus(s.status)}>
                        {s.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-gray-600">
                      <span>Priority: {s.priority}</span>
                      <span>Deadline: {new Date(s.deadline).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* COMPLIANCE TAB */}
        <TabsContent value="compliance" className="space-y-4">
          {frameworksData.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No compliance frameworks configured</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {frameworksData.map((f: any) => (
                <Card key={f.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 uppercase">{f.framework}</h3>
                        <p className="text-xs text-gray-500 mt-1">{f.requirements?.length || 0} requirements tracked</p>
                      </div>
                      <Badge className={getComplianceColor(f.status)}>
                        {f.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">
                      Last Audit: {f.lastAuditDate ? new Date(f.lastAuditDate).toLocaleDateString() : 'Never'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* PRIVACY IMPACT ASSESSMENTS TAB */}
        <TabsContent value="pia" className="space-y-4">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            New Assessment
          </Button>

          {piasData.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No privacy impact assessments</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {piasData.map((p: any) => (
                <Card key={p.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{p.projectName}</h3>
                        <p className="text-xs text-gray-500 mt-1">{p.projectDescription}</p>
                      </div>
                      <Badge className={
                        p.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                        p.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }>
                        {p.riskLevel} risk
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-600">Status: {p.status}</span>
                      <Badge className="bg-blue-100 text-blue-800">{p.risks?.length || 0} risks</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* BREACHES TAB */}
        <TabsContent value="breaches" className="space-y-4">
          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="w-4 h-4 mr-2" />
            Report Breach
          </Button>

          {breachesData.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-green-600 font-semibold">No breaches reported</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {breachesData.map((b: any) => (
                <Card key={b.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{b.description}</h3>
                        <p className="text-xs text-gray-500 mt-1">Root Cause: {b.rootCause}</p>
                      </div>
                      <Badge className={getBreachSeverity(b.severity)}>
                        {b.severity}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-gray-600">
                      <span>Records: {b.affectedRecords}</span>
                      <span>Users: {b.affectedUsers}</span>
                      <span>Status: {b.status}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
