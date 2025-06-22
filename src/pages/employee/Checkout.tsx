import React from 'react';
import { useParams } from 'react-router-dom';

function EmployeeCheckout() {
  const { mealId } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <p>Processing checkout for meal: {mealId}</p>
    </div>
  );
}

export default EmployeeCheckout;