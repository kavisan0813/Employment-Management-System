/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ReportTemplate {
  id: string;
  name: string;
  module: string;
  description: string;
}


export interface ReportExport {
  id: string;
  reportName: string;
  exportType: "PDF" | "Excel" | "CSV";
  generatedAt: string;
  size: string;
  status: "Completed" | "Pending" | "Failed";
  downloadUrl: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface ReportsState {
  templates: ReportTemplate[];
  exports: ReportExport[];
}
