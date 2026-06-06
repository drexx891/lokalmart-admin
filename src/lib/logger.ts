import { prisma } from "@/lib/prisma";

export async function logAdminAction({
  adminId,
  action,
  targetTable,
  targetId,
  oldData,
  newData,
  ipAddress
}: {
  adminId: string;
  action: string;
  targetTable?: string;
  targetId?: string;
  oldData?: any;
  newData?: any;
  ipAddress?: string;
}) {
  try {
    await prisma.adminActivityLog.create({
      data: {
        adminId,
        action,
        targetTable,
        targetId,
        oldData: oldData ? JSON.stringify(oldData) : null,
        newData: newData ? JSON.stringify(newData) : null,
        ipAddress
      }
    });
  } catch (error) {
    console.error("Gagal mencatat log aktivitas admin", error);
  }
}
