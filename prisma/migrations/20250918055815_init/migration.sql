-- CreateTable
CREATE TABLE "public"."Ad" (
    "id" TEXT NOT NULL,
    "productData" BYTEA,
    "productImageUrl" TEXT,
    "adImageUrl" TEXT,
    "adVideoUrl" TEXT,
    "avatar" TEXT,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ad_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Ad" ADD CONSTRAINT "Ad_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
