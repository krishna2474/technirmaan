import React from "react";

const CancellationAndRefund = () => {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        Cancellation and Refund Policy
      </h1>
      <p className="text-lg mb-4">Effective Date: [Insert Date]</p>

      <h2 className="text-xl font-semibold mb-4">
        1. Event Cancellation by TechNirmaan
      </h2>
      <p className="mb-4">
        TechNirmaan reserves the right to cancel any event in case of unforeseen
        circumstances or low registration. In such cases, full refunds will be
        issued to registered participants.
      </p>

      <h2 className="text-xl font-semibold mb-4">
        2. Participant Cancellations
      </h2>
      <p className="mb-4">
        Participants may cancel their event registration by [insert number] days
        before the event. A full refund will be provided minus any applicable
        transaction fees.
      </p>

      <h2 className="text-xl font-semibold mb-4">3. Non-Refundable Payments</h2>
      <p className="mb-4">
        Payments made after the cancellation deadline are non-refundable.
      </p>

      <h2 className="text-xl font-semibold mb-4">4. Refund Process</h2>
      <p className="mb-4">
        Refunds will be processed to the original payment method within [insert
        number] business days.
      </p>

      <h2 className="text-xl font-semibold mb-4">5. Contact for Refunds</h2>
      <p className="mb-4">
        To request a cancellation or refund, please contact us at [insert
        email].
      </p>
    </div>
  );
};

export default CancellationAndRefund;
