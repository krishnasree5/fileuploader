import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createUser = async (userData) => {
  return await prisma.user.create({
    data: userData,
  });
};

export const getAllFolders = async (userId) => {
  return await prisma.folder.findMany({
    where: {
      createdBy: userId,
    },
    include: {
      File: true,
    },
  });
};

export const getFolder = async (folderId) => {
  return await prisma.folder.findUnique({
    where: {
      id: folderId,
    },
    include: {
      File: true,
    },
  });
};

export const createFolder = async (name, userId) => {
  return await prisma.folder.create({
    data: {
      name: name,
      createdBy: userId,
    },
  });
};

export const updateFolder = async (folderId, name) => {
  return await prisma.folder.update({
    where: {
      id: folderId,
    },
    data: {
      name: name,
    },
  });
};

export const deleteFolder = async (folderId) => {
  return await prisma.folder.delete({
    where: {
      id: folderId,
    },
  });
};

export const uploadFile = async (name, folderId, url) => {
  return await prisma.file.create({
    data: {
      name: name,
      folderId: folderId,
      url: url,
    },
    select: {
      id: true,
      name: true,
      url: true,
      folderId: true,
    },
  });
};

export const deleteFile = async (fileId) => {
  return await prisma.file.delete({
    where: {
      id: fileId,
    },
  });
};

export const updateFile = async (fileId, url) => {
  return await prisma.file.update({
    where: {
      id: fileId,
    },
    data: {
      url: url,
    },
  });
};

export const getFile = async (fileId) => {
  return await prisma.file.findUnique({
    where: { id: fileId },
    include: { folder: true },
  });
};

export const updateFileName = async (fileId, name) => {
  return await prisma.file.update({
    where: { id: fileId },
    data: { name },
  });
};

export const moveFile = async (fileId, newFolderId, newUrl) => {
  return await prisma.file.update({
    where: { id: fileId },
    data: { folderId: newFolderId, url: newUrl },
  });
};
