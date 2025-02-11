import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllFolders = async (userId) => {
  const { Folder } = await prisma.user.findUnique({
    where: { id: userId },
    select: { Folder: true },
  });
  return Folder;
};

export const getFolder = async (folderId) => {
  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
  });
  // console.log(folder);

  return folder;
};

export const createFolder = async (folderName, userId) => {
  await prisma.folder.create({ data: { name: folderName, createdBy: userId } });
};

export const updateFolder = async (folderId, folderName) => {
  await prisma.folder.update({
    data: { name: folderName },
    where: { id: folderId },
  });
};

export const deleteFolder = async (folderId) => {
  await prisma.folder.delete({ where: { id: folderId } });
};

export const uploadFile = async (fileName, folderId, uploadPath) => {
  await prisma.file.create({
    data: { name: fileName, folderId: folderId, url: uploadPath },
  });
};
