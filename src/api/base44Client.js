import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://epsmgeiqjuybbmggmkaf.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwc21nZWlxanV5YmJtZ2dta2FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyODM0MDEsImV4cCI6MjA4NTg1OTQwMX0.HKkOPbyL50EF2lPK4UZ-xOTUUWTBv3r1VEGTYyOnwfU";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const cleanNumber = (val) => {
  const num = parseFloat(val);
  return isNaN(num) ? 0 : num;
};

// Helper for JSON fields
const ensureArray = (val) => (Array.isArray(val) ? val : []);

export const base44 = {
  entities: {
    SICTransport: {
      list: async () => {
        const { data, error } = await supabase
          .from("db_sic_transport")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        return data;
      },
      create: async (formData) => {
        const payload = {
          place_name: formData.place_name,
          image: formData.image || "",
          description: formData.description || "",
          adult_price: cleanNumber(formData.adult_price),
          child_price: cleanNumber(formData.child_price),
          b2b_adult_price: cleanNumber(formData.b2b_adult_price),
          b2b_child_price: cleanNumber(formData.b2b_child_price),
        };
        const { data, error } = await supabase
          .from("db_sic_transport")
          .insert([payload])
          .select();
        if (error) throw error;
        return data[0];
      },
      update: async (id, formData) => {
        const payload = {
          place_name: formData.place_name,
          image: formData.image || "",
          description: formData.description || "",
          adult_price: cleanNumber(formData.adult_price),
          child_price: cleanNumber(formData.child_price),
          b2b_adult_price: cleanNumber(formData.b2b_adult_price),
          b2b_child_price: cleanNumber(formData.b2b_child_price),
        };
        const { data, error } = await supabase
          .from("db_sic_transport")
          .update(payload)
          .eq("id", id)
          .select();
        if (error) throw error;
        return data[0];
      },
      delete: async (id) => {
        const { error } = await supabase
          .from("db_sic_transport")
          .delete()
          .eq("id", id);
        if (error) throw error;
        return true;
      },
    },
    Hotel: {
      list: async () => {
        const { data, error } = await supabase
          .from("db_hotels")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        return data;
      },
      create: async (formData) => {
        const payload = {
          ...formData,
          rating: parseInt(formData.rating) || 5,
          price_per_night: cleanNumber(formData.price_per_night),
          extra_bed_price: cleanNumber(formData.extra_bed_price),
          b2b_price_per_night: cleanNumber(formData.b2b_price_per_night),
          b2b_extra_bed_price: cleanNumber(formData.b2b_extra_bed_price),
        };
        const { data, error } = await supabase
          .from("db_hotels")
          .insert([payload])
          .select();
        if (error) throw error;
        return data[0];
      },
      update: async (id, formData) => {
        const payload = {
          ...formData,
          rating: parseInt(formData.rating) || 5,
          price_per_night: cleanNumber(formData.price_per_night),
          extra_bed_price: cleanNumber(formData.extra_bed_price),
          b2b_price_per_night: cleanNumber(formData.b2b_price_per_night),
          b2b_extra_bed_price: cleanNumber(formData.b2b_extra_bed_price),
        };
        const { data, error } = await supabase
          .from("db_hotels")
          .update(payload)
          .eq("id", id)
          .select();
        if (error) throw error;
        return data[0];
      },
      delete: async (id) => {
        const { error } = await supabase
          .from("db_hotels")
          .delete()
          .eq("id", id);
        if (error) throw error;
        return true;
      },
    },
    Activity: {
      list: async () => {
        const { data, error } = await supabase
          .from("db_activities")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        return data;
      },
      create: async (formData) => {
        const payload = {
          ...formData,
          adult_price: cleanNumber(formData.adult_price),
          child_price: cleanNumber(formData.child_price),
          b2b_adult_price: cleanNumber(formData.b2b_adult_price),
          b2b_child_price: cleanNumber(formData.b2b_child_price),
        };
        const { data, error } = await supabase
          .from("db_activities")
          .insert([payload])
          .select();
        if (error) throw error;
        return data[0];
      },
      update: async (id, formData) => {
        const payload = {
          ...formData,
          adult_price: cleanNumber(formData.adult_price),
          child_price: cleanNumber(formData.child_price),
          b2b_adult_price: cleanNumber(formData.b2b_adult_price),
          b2b_child_price: cleanNumber(formData.b2b_child_price),
        };
        const { data, error } = await supabase
          .from("db_activities")
          .update(payload)
          .eq("id", id)
          .select();
        if (error) throw error;
        return data[0];
      },
      delete: async (id) => {
        const { error } = await supabase
          .from("db_activities")
          .delete()
          .eq("id", id);
        if (error) throw error;
        return true;
      },
    },
    Transportation: {
      list: async () => {
        const { data, error } = await supabase
          .from("db_transport")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        return data;
      },
      create: async (formData) => {
        const payload = {
          ...formData,
          price_7_seater: cleanNumber(formData.price_7_seater),
          price_14_seater: cleanNumber(formData.price_14_seater),
          price_22_seater: cleanNumber(formData.price_22_seater),
          price_35_seater: cleanNumber(formData.price_35_seater),
          price_50_seater: cleanNumber(formData.price_50_seater),
          b2b_price_7_seater: cleanNumber(formData.b2b_price_7_seater),
          b2b_price_14_seater: cleanNumber(formData.b2b_price_14_seater),
          b2b_price_22_seater: cleanNumber(formData.b2b_price_22_seater),
          b2b_price_35_seater: cleanNumber(formData.b2b_price_35_seater),
          b2b_price_50_seater: cleanNumber(formData.b2b_price_50_seater),
        };
        const { data, error } = await supabase
          .from("db_transport")
          .insert([payload])
          .select();
        if (error) throw error;
        return data[0];
      },
      update: async (id, formData) => {
        const payload = {
          ...formData,
          price_7_seater: cleanNumber(formData.price_7_seater),
          price_14_seater: cleanNumber(formData.price_14_seater),
          price_22_seater: cleanNumber(formData.price_22_seater),
          price_35_seater: cleanNumber(formData.price_35_seater),
          price_50_seater: cleanNumber(formData.price_50_seater),
          b2b_price_7_seater: cleanNumber(formData.b2b_price_7_seater),
          b2b_price_14_seater: cleanNumber(formData.b2b_price_14_seater),
          b2b_price_22_seater: cleanNumber(formData.b2b_price_22_seater),
          b2b_price_35_seater: cleanNumber(formData.b2b_price_35_seater),
          b2b_price_50_seater: cleanNumber(formData.b2b_price_50_seater),
        };
        const { data, error } = await supabase
          .from("db_transport")
          .update(payload)
          .eq("id", id)
          .select();
        if (error) throw error;
        return data[0];
      },
      delete: async (id) => {
        const { error } = await supabase
          .from("db_transport")
          .delete()
          .eq("id", id);
        if (error) throw error;
        return true;
      },
    },
    Visa: {
      list: async () => {
        const { data, error } = await supabase
          .from("db_visas")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        return data;
      },
      create: async (formData) => {
        const payload = {
          ...formData,
          adult_price: cleanNumber(formData.adult_price),
          child_price: cleanNumber(formData.child_price),
          b2b_adult_price: cleanNumber(formData.b2b_adult_price),
          b2b_child_price: cleanNumber(formData.b2b_child_price),
        };
        const { data, error } = await supabase
          .from("db_visas")
          .insert([payload])
          .select();
        if (error) throw error;
        return data[0];
      },
      update: async (id, formData) => {
        const payload = {
          ...formData,
          adult_price: cleanNumber(formData.adult_price),
          child_price: cleanNumber(formData.child_price),
          b2b_adult_price: cleanNumber(formData.b2b_adult_price),
          b2b_child_price: cleanNumber(formData.b2b_child_price),
        };
        const { data, error } = await supabase
          .from("db_visas")
          .update(payload)
          .eq("id", id)
          .select();
        if (error) throw error;
        return data[0];
      },
      delete: async (id) => {
        const { error } = await supabase.from("db_visas").delete().eq("id", id);
        if (error) throw error;
        return true;
      },
    },
    TravelPackage: {
      list: async () => {
        const { data, error } = await supabase
          .from("db_packages")
          .select("*")
          .order("created_date", { ascending: false });
        if (error) throw error;
        return data;
      },

      get: async (id) => {
        const { data, error } = await supabase
          .from("db_packages")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        return data;
      },

      create: async (formData) => {
        const payload = {
          ...formData,
          hotel_total: cleanNumber(formData.hotel_total),
          activities_total: cleanNumber(formData.activities_total),
          transport_total: cleanNumber(formData.transport_total),
          visa_total: cleanNumber(formData.visa_total),
          sic_transport_total: cleanNumber(formData.sic_transport_total),
          commission: cleanNumber(formData.commission),
          fixed_charges: cleanNumber(formData.fixed_charges),
          additional_amount: cleanNumber(formData.additional_amount),
          grand_total: cleanNumber(formData.grand_total),
          services: ensureArray(formData.services),
          selected_hotels: ensureArray(formData.selected_hotels),
          selected_activities: ensureArray(formData.selected_activities),
          selected_transport: ensureArray(formData.selected_transport),
          selected_visas: ensureArray(formData.selected_visas),
          selected_sic_transports: ensureArray(
            formData.selected_sic_transports,
          ),
        };
        const { data, error } = await supabase
          .from("db_packages")
          .insert([payload])
          .select();
        if (error) throw error;
        return data[0];
      },

      // 🔥 આ રહ્યું UPDATE ફંક્શન જે બાકી હતું
      update: async (id, formData) => {
        const payload = {
          ...formData,
          hotel_total: cleanNumber(formData.hotel_total),
          activities_total: cleanNumber(formData.activities_total),
          transport_total: cleanNumber(formData.transport_total),
          visa_total: cleanNumber(formData.visa_total),
          sic_transport_total: cleanNumber(formData.sic_transport_total),
          commission: cleanNumber(formData.commission),
          fixed_charges: cleanNumber(formData.fixed_charges),
          additional_amount: cleanNumber(formData.additional_amount),
          grand_total: cleanNumber(formData.grand_total),
          services: ensureArray(formData.services),
          selected_hotels: ensureArray(formData.selected_hotels),
          selected_activities: ensureArray(formData.selected_activities),
          selected_transport: ensureArray(formData.selected_transport),
          selected_visas: ensureArray(formData.selected_visas),
          selected_sic_transports: ensureArray(
            formData.selected_sic_transports,
          ),
        };
        const { data, error } = await supabase
          .from("db_packages")
          .update(payload)
          .eq("id", id)
          .select();
        if (error) throw error;
        return data[0];
      },

      delete: async (id) => {
        const { error } = await supabase
          .from("db_packages")
          .delete()
          .eq("id", id);
        if (error) throw error;
        return true;
      },
    },
  },
  integrations: {
    Core: {
      UploadFile: async ({ file }) => {
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
        const { data, error } = await supabase.storage
          .from("images")
          .upload(fileName, file);
        if (error) throw error;
        const { data: publicUrlData } = supabase.storage
          .from("images")
          .getPublicUrl(fileName);
        return { file_url: publicUrlData.publicUrl };
      },
    },
  },
};
