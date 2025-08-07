-- CreateTable
CREATE TABLE "public"."Invoice" (
    "id" SERIAL NOT NULL,
    "invoiceNo" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "customer" TEXT NOT NULL,
    "salesperson" TEXT NOT NULL,
    "paymentType" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InvoiceProduct" (
    "id" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "item" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "totalCogs" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "InvoiceProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceNo_key" ON "public"."Invoice"("invoiceNo");

-- AddForeignKey
ALTER TABLE "public"."InvoiceProduct" ADD CONSTRAINT "InvoiceProduct_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
