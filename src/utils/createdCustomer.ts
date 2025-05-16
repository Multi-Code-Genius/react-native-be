import { UserRole } from "@prisma/client";
import { prisma } from "./prisma";

export const createCustomer = async ({
  name,
  mobile,
  userId,
  createdById,
}: {
  name: string;
  mobile: string;
  userId: string;
  createdById: string;
}) => {
  let customer = await prisma.customer.findUnique({
    where: {
      userId_createdById: {
        userId,
        createdById,
      },
    },
  });

  if (!customer) {
    customer = await prisma.customer.create({
      data: {
        name,
        mobile,
        userId,
        createdById,
        ownerId: createdById,
        totalSpent: 0,
      },
    });
  }

  return customer;
};

export const createUser = async ({
  name,
  mobile,
  role,
}: {
  name: string;
  mobile: string;
  role: UserRole;
}) => {
  let user = await prisma.user.findUnique({
    where: {
      mobileNumber: mobile,
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name,
        mobileNumber: mobile,
        role: role as UserRole,
      },
    });
  }

  return user;
};
