// src/api/base44Client.js

// ================= INITIAL DATA =================
const INITIAL_DATA = {
    db_hotels: [
        {
            id: "h1",
            name: "Burj Al Arab Jumeirah",
            image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
            rating: 5,
            location: "Jumeirah St, Dubai",
            price_per_night: 4500,
            b2b_price_per_night: 4000,
            extra_bed_price: 500,
            b2b_extra_bed_price: 400
        },
        {
            id: "h2",
            name: "Atlantis, The Palm",
            image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
            rating: 5,
            location: "Palm Jumeirah, Dubai",
            price_per_night: 1800,
            b2b_price_per_night: 1600,
            extra_bed_price: 300,
            b2b_extra_bed_price: 250
        }
    ],
db_sic_transport: [
        {
            id: "sic1",
            place_name: "Dubai City Tour",
            description: "Guided tour of major landmarks.",
            adult_price: 150,
            child_price: 100,
            b2b_adult_price: 120,
            b2b_child_price: 80
        }
    ],
    db_activities: [
        {
            id: "a1",
            name: "Premium Desert Safari",
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
            description: "Dune bashing, camel riding, and BBQ dinner under the stars.",
            adult_price: 250,
            child_price: 150,
            b2b_adult_price: 200,
            b2b_child_price: 120
        },
        {
            id: "a2",
            name: "Burj Khalifa At The Top",
            image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
            description: "Visit the 124th floor of the world's tallest building.",
            adult_price: 175,
            child_price: 135,
            b2b_adult_price: 160,
            b2b_child_price: 120
        }
    ],

    db_transport: [
        {
            id: "t1",
            name: "Private Luxury SUV",
            image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800",
            description: "Comfortable SUV for city transfers and tours.",
            price_7_seater: 500,
            price_14_seater: 800,
            b2b_price_7_seater: 450,
            b2b_price_14_seater: 750
        }
    ],

    db_visas: [
        {
            id: "v1",
            country: "UAE 30 Days Tourist Visa",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
            adult_price: 350,
            child_price: 350,
            b2b_adult_price: 310,
            b2b_child_price: 310
        },
        {
            id: "v2",
            country: "UAE 60 Days Tourist Visa",
            image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800",
            adult_price: 850,
            child_price: 450,
            b2b_adult_price: 610,
            b2b_child_price: 510
        }
    ],

    db_packages: [
        {
            id: "pkg_01",
            name: "Demo Traveler",
            phone: "+91 0000000000",
            destination: "Dubai, UAE",
            arrival_date: new Date().toISOString(),
            departure_date: new Date(Date.now() + 432000000).toISOString(),
            adults: 2,
            children: 0,
            branch: "Dubai",
            status: "confirmed",
            currency: "AED",
            grand_total: 5500,
            services: ["Hotel", "Visa", "Transportation"],
            created_date: new Date().toISOString()
        }
    ]
};

// ================= STORAGE HELPERS =================
const getStorageData = (key) => {
    const data = localStorage.getItem(key);
    if (!data) {
        localStorage.setItem(key, JSON.stringify(INITIAL_DATA[key] || []));
        return INITIAL_DATA[key] || [];
    }
    return JSON.parse(data);
};

const setStorageData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

// ================= BASE44 CLIENT =================
export const base44 = {
  entities: {
    SICTransport: {
      list: async () => getStorageData("db_sic_transport"),

      create: async (data) => {
        const items = getStorageData("db_sic_transport");
        const newItem = { ...data, id: Date.now().toString() };
        items.push(newItem);
        setStorageData("db_sic_transport", items);
        return newItem;
      },

      update: async (id, data) => {
        const items = getStorageData("db_sic_transport").map((item) =>
          item.id === id ? { ...item, ...data } : item,
        );
        setStorageData("db_sic_transport", items);
        return data;
      },

      delete: async (id) => {
        const items = getStorageData("db_sic_transport").filter(
          (i) => i.id !== id,
        );
        setStorageData("db_sic_transport", items);
      },
    },
    TravelPackage: {
      list: async () =>
        getStorageData("db_packages").sort(
          (a, b) => new Date(b.created_date) - new Date(a.created_date),
        ),

      filter: async ({ id }) =>
        getStorageData("db_packages").filter((p) => p.id === id),

      create: async (data) => {
        const items = getStorageData("db_packages");
        const newItem = {
          ...data,
          id: Math.random().toString(36).slice(2, 9),
          created_date: new Date().toISOString(),
        };
        items.push(newItem);
        setStorageData("db_packages", items);
        return newItem;
      },

      delete: async (id) => {
        const items = getStorageData("db_packages").filter((p) => p.id !== id);
        setStorageData("db_packages", items);
      },
    },

    Hotel: {
      list: async () => getStorageData("db_hotels"),

      create: async (data) => {
        const items = getStorageData("db_hotels");
        const newItem = { ...data, id: Date.now().toString() };
        items.push(newItem);
        setStorageData("db_hotels", items);
        return newItem;
      },

      update: async (id, data) => {
        const items = getStorageData("db_hotels").map((item) =>
          item.id === id ? { ...item, ...data } : item,
        );
        setStorageData("db_hotels", items);
        return data;
      },

      delete: async (id) => {
        const items = getStorageData("db_hotels").filter((i) => i.id !== id);
        setStorageData("db_hotels", items);
      },
    },

    Activity: {
      list: async () => getStorageData("db_activities"),

      create: async (data) => {
        const items = getStorageData("db_activities");
        const newItem = { ...data, id: Date.now().toString() };
        items.push(newItem);
        setStorageData("db_activities", items);
        return newItem;
      },

      update: async (id, data) => {
        const items = getStorageData("db_activities").map((item) =>
          item.id === id ? { ...item, ...data } : item,
        );
        setStorageData("db_activities", items);
        return data;
      },

      delete: async (id) => {
        const items = getStorageData("db_activities").filter(
          (i) => i.id !== id,
        );
        setStorageData("db_activities", items);
      },
    },

    Transportation: {
      list: async () => getStorageData("db_transport"),

      create: async (data) => {
        const items = getStorageData("db_transport");
        const newItem = { ...data, id: Date.now().toString() };
        items.push(newItem);
        setStorageData("db_transport", items);
        return newItem;
      },

      update: async (id, data) => {
        const items = getStorageData("db_transport").map((item) =>
          item.id === id ? { ...item, ...data } : item,
        );
        setStorageData("db_transport", items);
        return data;
      },

      delete: async (id) => {
        const items = getStorageData("db_transport").filter((i) => i.id !== id);
        setStorageData("db_transport", items);
      },
    },

    Visa: {
      list: async () => getStorageData("db_visas"),

      create: async (data) => {
        const items = getStorageData("db_visas");
        const newItem = { ...data, id: Date.now().toString() };
        items.push(newItem);
        setStorageData("db_visas", items);
        return newItem;
      },

      update: async (id, data) => {
        const items = getStorageData("db_visas").map((item) =>
          item.id === id ? { ...item, ...data } : item,
        );
        setStorageData("db_visas", items);
        return data;
      },

      delete: async (id) => {
        const items = getStorageData("db_visas").filter((i) => i.id !== id);
        setStorageData("db_visas", items);
      },
    },
  },

  // ================= CLOUDINARY INTEGRATION =================
  integrations: {
    Core: {
      UploadFile: async ({ file }) => {
        const CLOUD_NAME = "dpqecvo3y";
        const UPLOAD_PRESET = "Package-making";

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          },
        );

        const data = await res.json();

        return {
          file_url: data.secure_url,
        };
      },
    },
  },
};
