'use client';

import React from 'react';
import { useAtom } from 'jotai';
import { resultAtom, statusAtom } from '@/lib/stores/evaluationStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { 
  FileText, 
  Download, 
  TrendingUp, 
  Brain, 
  Target, 
  DollarSign, 
  BookOpen, 
  Lightbulb,
  ExternalLink,
} from 'lucide-react';
import Button from '@/app/(user)/components/ui/Button';

/**
 * Research Topic Evaluation Results Component
 * Displays evaluation metrics, sparkline trends, and download links
 */

export function EvaluationResults() {
  const [result] = useAtom(resultAtom);
  const [status] = useAtom(statusAtom);

  if (status !== 'done' || !result) {
    return null;
  }

  const { evaluation, report } = result;

  // Metric configuration with icons and colors
  const metrics = [
    {
      key: 'novelty',
      title: 'Novelty',
      icon: Lightbulb,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      key: 'trends',
      title: 'Trends',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      key: 'methodological_complexity',
      title: 'Methodological Complexity',
      icon: Brain,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      key: 'research_gaps',
      title: 'Research Gaps',
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
    {
      key: 'grant_potential',
      title: 'Grant Potential',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
    },
    {
      key: 'literature_availability',
      title: 'Literature Availability',
      icon: BookOpen,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
    },
  ];



  const getScoreBadgeVariant = (score: number) => {
    if (score >= 7) return 'default';
    if (score >= 4) return 'secondary';
    return 'destructive';
  };

  const generateSparklineData = () => {
   
    return [];
  };

  const sparklineData = generateSparklineData();

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Overall Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">
            {evaluation.overall_summary}
          </p>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => {
          const metricData = evaluation[metric.key as keyof typeof evaluation] as any;
          const Icon = metric.icon;
          
          return (
            <Card key={metric.key} className={`${metric.borderColor} border-2`}>
              <CardHeader className={`${metric.bgColor} pb-3`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${metric.color}`} />
                    <CardTitle className="text-sm font-medium">
                      {metric.title}
                    </CardTitle>
                  </div>
                  <Badge variant={getScoreBadgeVariant(metricData.score)}>
                    {metricData.score}/10
                  </Badge>
                </div>
                <Progress 
                  value={metricData.score * 10} 
                  className="h-2"
                />
              </CardHeader>
              <CardContent className="pt-3">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {metricData.justification}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Trends Visualization - Temporarily disabled */}
      {/* This will be re-enabled when raw data is available */}

      {/* Reports Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Detailed Reports
          </CardTitle>
          <CardDescription>
            Download comprehensive analysis reports with charts, tables, and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button  variant="secondary">
              <a 
                href={report.htmlUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                View HTML Report
              </a>
            </Button>
            
            <Button  variant="secondary">
              <a 
                href={report.pdfUrl} 
                download
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </a>
            </Button>
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              Reports include detailed breakdowns of:
            </p>
            <ul className="text-sm text-gray-600 mt-1 space-y-1">
              <li>• Publication trends and citation analysis</li>
              <li>• Research methodology distribution</li>
              <li>• Funding opportunity analysis</li>
              <li>• Actionable recommendations</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Data Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Data Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              'OpenAlex', 'Semantic Scholar', 'CORE', 'Crossref', 
              'NIH RePORTER', 'CORDIS', 'Grants.gov'
            ].map((source) => (
              <Badge key={source} variant="outline" className="text-xs">
                {source}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Analysis generated using multiple academic databases and AI evaluation
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
