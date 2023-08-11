-- CreateEnum
CREATE TYPE "MembershipType" AS ENUM ('admin', 'member');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('cookie', 'bearer');

-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('token', 'verification');

-- CreateEnum
CREATE TYPE "PermissionType" AS ENUM ('read', 'write');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "registeredAt" DOUBLE PRECISION,
    "registrationExpiresAt" DOUBLE PRECISION,
    "verificationExpiresAt" DOUBLE PRECISION,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "createdAt" DOUBLE PRECISION NOT NULL,
    "isAdmin" BOOLEAN NOT NULL,
    "invitationCode" TEXT NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memberships" (
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "type" "MembershipType" NOT NULL,

    CONSTRAINT "memberships_pkey" PRIMARY KEY ("userId","groupId")
);

-- CreateTable
CREATE TABLE "bookmarks" (
    "userId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,

    CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("userId","itemId")
);

-- CreateTable
CREATE TABLE "tokens" (
    "id" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "expiresAt" DOUBLE PRECISION NOT NULL,
    "ownerId" TEXT NOT NULL,
    "permissionId" TEXT,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requestsFromUser" (
    "id" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "email" TEXT,
    "expiresAt" DOUBLE PRECISION NOT NULL,
    "type" "RequestType" NOT NULL,
    "requestedFromId" TEXT NOT NULL,

    CONSTRAINT "requestsFromUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "type" "PermissionType" NOT NULL,
    "expiresAt" DOUBLE PRECISION NOT NULL,
    "grantsToId" TEXT NOT NULL,
    "targetTypeId" TEXT NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DOUBLE PRECISION NOT NULL,
    "updatedAt" DOUBLE PRECISION NOT NULL,
    "isPublic" BOOLEAN NOT NULL,
    "ownerId" TEXT,
    "typeId" TEXT,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attributes" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "parentItemTypeId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "valueString" TEXT,
    "valueNumber" DOUBLE PRECISION,
    "valueBoolean" BOOLEAN,
    "valueItemId" TEXT,
    "showOnSummary" BOOLEAN NOT NULL,

    CONSTRAINT "attributes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_name_key" ON "users"("name");

-- CreateIndex
CREATE INDEX "users_id_idx" ON "users"("id");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "groups_name_key" ON "groups"("name");

-- CreateIndex
CREATE UNIQUE INDEX "groups_invitationCode_key" ON "groups"("invitationCode");

-- CreateIndex
CREATE INDEX "groups_id_idx" ON "groups"("id");

-- CreateIndex
CREATE INDEX "groups_name_idx" ON "groups"("name");

-- CreateIndex
CREATE INDEX "memberships_userId_idx" ON "memberships"("userId");

-- CreateIndex
CREATE INDEX "memberships_groupId_idx" ON "memberships"("groupId");

-- CreateIndex
CREATE INDEX "bookmarks_userId_idx" ON "bookmarks"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_secret_key" ON "tokens"("secret");

-- CreateIndex
CREATE INDEX "tokens_id_idx" ON "tokens"("id");

-- CreateIndex
CREATE INDEX "tokens_secret_idx" ON "tokens"("secret");

-- CreateIndex
CREATE UNIQUE INDEX "requestsFromUser_secret_key" ON "requestsFromUser"("secret");

-- CreateIndex
CREATE INDEX "requestsFromUser_id_idx" ON "requestsFromUser"("id");

-- CreateIndex
CREATE INDEX "permissions_grantsToId_idx" ON "permissions"("grantsToId");

-- CreateIndex
CREATE INDEX "permissions_targetTypeId_idx" ON "permissions"("targetTypeId");

-- CreateIndex
CREATE INDEX "items_id_idx" ON "items"("id");

-- CreateIndex
CREATE INDEX "attributes_parentId_idx" ON "attributes"("parentId");

-- CreateIndex
CREATE INDEX "attributes_valueString_idx" ON "attributes"("valueString");

-- CreateIndex
CREATE INDEX "attributes_valueNumber_idx" ON "attributes"("valueNumber");

-- CreateIndex
CREATE INDEX "attributes_valueBoolean_idx" ON "attributes"("valueBoolean");

-- CreateIndex
CREATE INDEX "attributes_valueItemId_idx" ON "attributes"("valueItemId");

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requestsFromUser" ADD CONSTRAINT "requestsFromUser_requestedFromId_fkey" FOREIGN KEY ("requestedFromId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_grantsToId_fkey" FOREIGN KEY ("grantsToId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_targetTypeId_fkey" FOREIGN KEY ("targetTypeId") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attributes" ADD CONSTRAINT "attributes_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attributes" ADD CONSTRAINT "attributes_parentItemTypeId_fkey" FOREIGN KEY ("parentItemTypeId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attributes" ADD CONSTRAINT "attributes_valueItemId_fkey" FOREIGN KEY ("valueItemId") REFERENCES "items"("id") ON DELETE SET NULL ON UPDATE CASCADE;
