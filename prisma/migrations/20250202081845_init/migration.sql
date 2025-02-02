-- CreateTable
CREATE TABLE "Notification" (
    "notifid" TEXT NOT NULL,
    "pesan" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notifid")
);
