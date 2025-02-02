-- CreateTable
CREATE TABLE "User" (
    "userID" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userID")
);

-- CreateTable
CREATE TABLE "Message" (
    "messagesID" SERIAL NOT NULL,
    "sender" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "groupID" TEXT,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("messagesID")
);

-- CreateTable
CREATE TABLE "Notification" (
    "notifID" TEXT NOT NULL,
    "pesan" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notifID")
);

-- CreateTable
CREATE TABLE "Group" (
    "groupID" TEXT NOT NULL,
    "namaGroup" TEXT NOT NULL,
    "deskripsi" TEXT,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("groupID")
);

-- CreateTable
CREATE TABLE "GroupMember" (
    "memberID" TEXT NOT NULL,
    "groupID" TEXT NOT NULL,
    "userID" TEXT NOT NULL,

    CONSTRAINT "GroupMember_pkey" PRIMARY KEY ("memberID")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "GroupMember_groupID_userID_key" ON "GroupMember"("groupID", "userID");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_groupID_fkey" FOREIGN KEY ("groupID") REFERENCES "Group"("groupID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_groupID_fkey" FOREIGN KEY ("groupID") REFERENCES "Group"("groupID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE CASCADE ON UPDATE CASCADE;
