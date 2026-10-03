import { Users } from "lucide-react";

import CustomersHeader from "./components/CustomersHeader/CustomersHeader";
import CustomerSearch from "./components/CustomerSearch/CustomerSearch";
import CustomerTable from "./components/CustomerTable/CustomerTable";
import CustomersSkeleton from "./components/CustomersSkeleton/CustomersSkeleton";
import { useCustomers } from "../../hooks/useCustomers";

import "./Customers.css";

export default function Customers() {
  const {
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
  } = useCustomers();

  return (
    <div className="customers-page">
      <CustomersHeader
        isRefreshing={isRefreshing}
        onRefresh={() => loadCustomers(true)}
      />

      <CustomerSearch
        value={search}
        total={total}
        onChange={setSearch}
      />

      {error && (
        <div className="customers-error">
          {error}
        </div>
      )}

      <div className="customers-card">
        {isLoading ? (
          <CustomersSkeleton />
        ) : filteredCustomers.length === 0 ? (
          <div className="customers-empty">
            <div className="customers-empty-icon">
              <Users size={27} />
            </div>

            <h3>No customers found</h3>

            <p>
              There are no customers matching your search.
            </p>
          </div>
        ) : (
          <CustomerTable
            customers={filteredCustomers}
            changingCustomerId={changingCustomerId}
            onChangeStatus={changeCustomerStatus}
          />
        )}
      </div>
    </div>
  );
}