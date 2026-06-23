/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from "react";
import { Payment, PaymentStatus, PaymentStats } from "../types/payment.types";
import { PaymentService } from "../services/payment.service";

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | PaymentStatus>(
    "ALL",
  );
  const [methodFilter, setMethodFilter] = useState("ALL");

  const refresh = useCallback(() => {
    setPayments(PaymentService.getAll());
    setStats(PaymentService.getStats());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filteredPayments = payments.filter((pay) => {
    const matchesSearch =
      pay.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pay.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pay.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || pay.status === statusFilter;
    const matchesMethod = methodFilter === "ALL" || pay.method === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const openDrawer = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedPayment(null);
  };

  const handleRetry = (id: string) => {
    PaymentService.retryPayment(id);
    refresh();
    closeDrawer();
  };

  const handleRefund = (id: string) => {
    PaymentService.issueRefund(id);
    refresh();
    closeDrawer();
  };

  return {
    payments,
    filteredPayments,
    stats,
    selectedPayment,
    isDrawerOpen,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    methodFilter,
    setMethodFilter,
    openDrawer,
    closeDrawer,
    handleRetry,
    handleRefund,
    refresh,
  };
}
