// 📄 src/components/MenuFormModal.js
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "../styles/modal.css"; // Make sure you have this file

Modal.setAppElement("#root");

const MenuFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    image: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        name: "",
        category: "",
        description: "",
        price: "",
        image: "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Menu Modal"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <h2 className="text-xl font-bold mb-4 text-center">
        {initialData ? "Edit Menu" : "Add Menu"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Menu Name"
          className="border p-2 w-full rounded"
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className="border p-2 w-full rounded"
        >
          <option value="">Select Category</option>
          <option>Appetizers</option>
          <option>Main Courses</option>
          <option>Salads</option>
          <option>Desserts</option>
          <option>Wine Selection</option>
          <option>Signature Cocktails</option>
        </select>
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-2 w-full rounded"
        />
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          required
          placeholder="Price"
          className="border p-2 w-full rounded"
        />
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="border p-2 w-full rounded"
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {initialData ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default MenuFormModal;
