import React, { useState } from "react";

export default function CreateTierModal({ creatorId, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Include creatorId in the payload
    const payload = { creatorId, name, price: parseFloat(price), description };

    console.log("Payload being sent to the backend:", payload); // Debugging log

    try {
      const response = await fetch(
        `https://arroyob-ducqdydbheaxd9as.eastus-01.azurewebsites.net/creators/${creatorId}/tier`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend error response:", errorData);
        setError(errorData.message || "Failed to create subscription tier");
        return;
      }

      onSuccess(); // Notify parent to refresh data
      onClose(); // Close modal
    } catch (err) {
      console.error("Error occurred during submission:", err);
      setError("An error occurred while creating the subscription tier.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          Create New Membership Tier
        </h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Tier Name
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-md px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={50}
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Price (Ksh. / month)
            </label>
            <input
              type="number"
              className="mt-1 w-full border rounded-md px-3 py-2"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min={0}
              step="any"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              className="mt-1 w-full border rounded-md px-3 py-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              maxLength={500}
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 rounded-md bg-gray-300 px-4 py-2 hover:bg-gray-400"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
