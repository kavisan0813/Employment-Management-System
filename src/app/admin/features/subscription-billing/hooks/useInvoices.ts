/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from "react";
import { Invoice, InvoiceStatus, InvoiceStats } from "../types/invoice.types";
import { InvoiceService } from "../services/invoice.service";

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<InvoiceStats | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | InvoiceStatus>("ALL");
  const [orgFilter, setOrgFilter] = useState("ALL");

  const refresh = useCallback(() => {
    setInvoices(InvoiceService.getAll());
    setStats(InvoiceService.getStats());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.organizationName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || inv.status === statusFilter;
    const matchesOrg = orgFilter === "ALL" || inv.organizationId === orgFilter;
    return matchesSearch && matchesStatus && matchesOrg;
  });

  const openDrawer = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedInvoice(null);
  };

  const handleMarkPaid = (id: string, method: string) => {
    InvoiceService.markAsPaid(id, method);
    refresh();
    closeDrawer();
  };

  const handleRefund = (id: string) => {
    InvoiceService.issueRefund(id);
    refresh();
    closeDrawer();
  };

  return {
    invoices,
    filteredInvoices,
    stats,
    selectedInvoice,
    isDrawerOpen,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    orgFilter,
    setOrgFilter,
    openDrawer,
    closeDrawer,
    handleMarkPaid,
    handleRefund,
    refresh,
  };
}
