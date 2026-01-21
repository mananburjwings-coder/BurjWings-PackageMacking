import { useState } from "react";

const EditHotelModal = ({ hotel, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: hotel.name || "",
    rating: hotel.rating || 1,
    location: hotel.location || "",
    price_per_night: hotel.price_per_night || 0,
    extra_bed_price: hotel.extra_bed_price || 0,
    b2b_price_per_night: hotel.b2b_price_per_night || 0,
    b2b_extra_bed_price: hotel.b2b_extra_bed_price || 0,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // 🔥 VERY IMPORTANT

    console.log("Updating hotel:", formData);

    // call parent update
    onUpdate(formData);

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="input"
        placeholder="Hotel Name"
      />

      <input
        name="rating"
        type="number"
        min={1}
        max={5}
        value={formData.rating}
        onChange={handleChange}
        className="input"
      />

      <input
        name="location"
        value={formData.location}
        onChange={handleChange}
        className="input"
      />

      <input
        name="price_per_night"
        type="number"
        value={formData.price_per_night}
        onChange={handleChange}
        className="input"
      />

      <input
        name="b2b_price_per_night"
        type="number"
        value={formData.b2b_price_per_night}
        onChange={handleChange}
        className="input"
      />

      {/* ✅ IMPORTANT */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium"
      >
        Update Hotel
      </button>

    </form>
  );
};

export default EditHotelModal;
