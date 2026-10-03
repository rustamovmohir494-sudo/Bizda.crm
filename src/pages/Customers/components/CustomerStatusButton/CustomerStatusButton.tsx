import {
  Lock,
  LockOpen,
} from "lucide-react";

import type { Customer } from "../../../../api/customersApi";

import "./CustomerStatusButton.css";

interface CustomerStatusButtonProps {
  customer: Customer;
  isChanging: boolean;
  onChangeStatus: (customer: Customer) => void;
}

export default function CustomerStatusButton({
  customer,
  isChanging,
  onChangeStatus,
}: CustomerStatusButtonProps) {
  return (
    <button
      type="button"
      className={`customer-lock-button ${
        customer.isActive
          ? "customer-lock-active"
          : "customer-lock-inactive"
      }`}
      onClick={() => onChangeStatus(customer)}
      disabled={isChanging}
      title={
        customer.isActive
          ? "Deactivate customer"
          : "Activate customer"
      }
      aria-label={
        customer.isActive
          ? "Deactivate customer"
          : "Activate customer"
      }
    >
      {isChanging ? (
        <span className="customer-lock-spinner" />
      ) : customer.isActive ? (
        <Lock size={17} />
      ) : (
        <LockOpen size={17} />
      )}
    </button>
  );
}