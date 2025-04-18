import { prisma } from "../utils/prisma";

export const markInactiveUsersOffline = async () => {
  const THRESHOLD = 30 * 1000;
  const cutoff = new Date(Date.now() - THRESHOLD);

  await prisma.user.updateMany({
    where: {
      lastSeen: { lt: cutoff },
      isOnline: true
    },
    data: {
      isOnline: false
    }
  });

  console.log("Inactive users marked offline");
};
