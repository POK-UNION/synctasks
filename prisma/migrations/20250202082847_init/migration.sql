-- CreateTable
CREATE TABLE "Group" (
    "groupID" TEXT NOT NULL,
    "namaGroup" TEXT NOT NULL,
    "deskripsi" TEXT,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("groupID")
);

-- CreateTable
CREATE TABLE "GroupMember" (
    "id" TEXT NOT NULL,
    "groupID" TEXT NOT NULL,
    "userID" TEXT NOT NULL,

    CONSTRAINT "GroupMember_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_groupID_fkey" FOREIGN KEY ("groupID") REFERENCES "Group"("groupID") ON DELETE CASCADE ON UPDATE CASCADE;
