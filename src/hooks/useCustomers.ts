import { useCallback, useEffect, useMemo, useState } from "react";

import {
  getCustomers,
  updateCustomerStatus,
} from "../api/customersApi";

import type { Customer } from "../api/customersApi";

interface CustomersCache {
  customers: Customer[];
  total: number;
}

let customersCache: CustomersCache | null = null;

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>(
    customersCache?.customers ?? [],
  );

  const [total, setTotal] = useState(
    customersCache?.total ?? 0,
  );

  const [isLoading, setIsLoading] = useState(
    customersCache === null,
  );

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [changingCustomerId, setChangingCustomerId] =
    useState<string | null>(null);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const loadCustomers = useCallback(
    async (forceRefresh = false) => {
      if (!forceRefresh && customersCache !== null) {
        setCustomers(customersCache.customers);
        setTotal(customersCache.total);
        setIsLoading(false);

        return;
      }

      try {
        setError("");

        if (forceRefresh) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        const response = await getCustomers(1, 20);

        const newCustomers = response.data ?? [];

        const newTotal =
          response.meta?.total ?? newCustomers.length;

        customersCache = {
          customers: newCustomers,
          total: newTotal,
        };

        setCustomers(newCustomers);
        setTotal(newTotal);
      } catch (error) {
        console.error(
          "Failed to load customers:",
          error,
        );

        setError(
          "Customerlarni yuklashda xatolik yuz berdi.",
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return customers;
    }

    return customers.filter((customer) => {
      const fullName =
        `${customer.firstName} ${customer.lastName}`.toLowerCase();

      return (
        fullName.includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phone.toLowerCase().includes(query)
      );
    });
  }, [customers, search]);

  const changeCustomerStatus = useCallback(
    async (customer: Customer) => {
      if (changingCustomerId) {
        return;
      }

      try {
        setError("");
        setChangingCustomerId(customer.id);

        const newStatus = !customer.isActive;

        const response = await updateCustomerStatus(
          customer.id,
          newStatus,
        );

        const updatedCustomer = response.data;

        const updatedCustomers = customers.map(
          (item) => {
            if (item.id !== customer.id) {
              return item;
            }

            return {
              ...item,
              ...updatedCustomer,
              isActive: updatedCustomer.isActive,
            };
          },
        );

        customersCache = {
          customers: updatedCustomers,
          total,
        };

        setCustomers(updatedCustomers);
      } catch (error) {
        console.error(
          "Failed to change customer status:",
          error,
        );

        setError(
          "Customer statusini o‘zgartirishda xatolik yuz berdi.",
        );
      } finally {
        setChangingCustomerId(null);
      }
    },
    [changingCustomerId, customers, total],
  );

  return {
    customers,
    filteredCustomers,
    total,
    search,
    isLoading,
    isRefreshing,
    changingCustomerId,
    error,

    setSearch,
    loadCustomers,
    changeCustomerStatus,
  };
}