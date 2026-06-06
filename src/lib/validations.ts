import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const addProductSchema = z.object({
  name: z.string().min(3, "Nama produk minimal 3 karakter"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  price: z.number().positive("Harga harus lebih dari 0"),
  stock: z.number().int().nonnegative("Stok tidak boleh negatif"),
  minOrder: z.number().int().positive("Min order harus lebih dari 0"),
  unit: z.string().min(1, "Satuan wajib diisi"),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  imageUrl: z.string().url("URL gambar tidak valid").optional().or(z.literal("")),
});
