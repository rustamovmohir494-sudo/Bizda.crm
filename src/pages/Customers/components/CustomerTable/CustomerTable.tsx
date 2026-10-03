import CustomerStatusButton from "../CustomerStatusButton/CustomerStatusButton";

import type { Customer } from "../../../../api/customersApi";

import "./CustomerTable.css";

interface CustomerTableProps {
  customers: Customer[];
  changingCustomerId: string | null;
  onChangeStatus: (customer: Customer) => void;
}

export default function CustomerTable({
  customers,
  changingCustomerId,
  onChangeStatus,
}: CustomerTableProps) {
  function formatMoney(value: number) {
    return new Intl.NumberFormat("uz-UZ").format(value);
  }

  function getInitials(customer: Customer) {
    const firstName = customer.firstName?.[0] ?? "";
    const lastName = customer.lastName?.[0] ?? "";

    return `${firstName}${lastName}`.toUpperCase();
  }

  return (
    <div className="customer-table-wrapper">
      <table className="customer-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Contact</th>
            <th>Orders</th>
            <th>Total Spent</th>
            <th>Status</th>
            <th className="customer-action-header">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>
                <div className="customer-profile">
                  {customer.avatar ? (
                    <img
                      src={customer.avatar}
                      alt={`${customer.firstName} ${customer.lastName}`}
                      className="customer-avatar"
                    />
                  ) : (
                    <div className="customer-avatar customer-avatar-fallback">
                      {getInitials(customer)}
                    </div>
                  )}

                  <div className="customer-name">
                    <strong>
                      {customer.firstName}{" "}
                      {customer.lastName}
                    </strong>

                    <span>
                      ID: {customer.id.slice(0, 8)}...
                    </span>
                  </div>
                </div>
              </td>

              <td>
                <div className="customer-contact">
                  <span>{customer.email}</span>
                  <small>{customer.phone}</small>
                </div>
              </td>

              <td>
                <div className="customer-orders">
                  <strong>
                    {customer.totalOrders}
                  </strong>

                  <span>orders</span>
                </div>
              </td>

              <td>
                <div className="customer-spent">
                  <strong>
                    {formatMoney(customer.totalSpent)}
                  </strong>

                  <span>UZS</span>
                </div>
              </td>

              <td>
                <span
                  className={`customer-status ${
                    customer.isActive
                      ? "customer-status-active"
                      : "customer-status-inactive"
                  }`}
                >
                  <span className="customer-status-dot" />

                  {customer.isActive
                    ? "Active"
                    : "Inactive"}
                </span>
              </td>

              <td>
                <div className="customer-action">
                  <CustomerStatusButton
                    customer={customer}
                    isChanging={
                      changingCustomerId ===
                      customer.id
                    }
                    onChangeStatus={onChangeStatus}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}