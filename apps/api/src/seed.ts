import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

interface JSONDocument {
  _id: string;
  name: string;
  filePath: string;
  fileSize: { $numberLong: string };
  fileType: string;
  status: string;
  organizationId: string;
  departmentId: string;
  createdAt: { $date: string };
  updatedAt: { $date: string };
  uploadedById: string;
  extractedData: {
    llmData: {
      invoice: any;
      vendor: any;
      payment: any;
      summary: any;
      customer: any;
      lineItems: any;
    };
  };
}

// Category mapping based on Sachkonto
const categoryMap: Record<string, string> = {
  '4400': 'Services',
  '4300': 'Materials',
  '4500': 'Shipping',
  '4600': 'Utilities',
  '4700': 'Office Supplies',
  'default': 'General'
};

function getCategory(sachkonto?: string): string {
  return sachkonto && categoryMap[sachkonto] ? categoryMap[sachkonto] : categoryMap['default'];
}

async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    // Read the JSON file
    const dataPath = path.join(__dirname, '../../../data/Analytics_Test_Data.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const documents: JSONDocument[] = JSON.parse(rawData);

    console.log(`📄 Found ${documents.length} documents to process`);

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await prisma.lineItem.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.invoice.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.vendor.deleteMany();
    await prisma.document.deleteMany();

    let processedCount = 0;
    let errorCount = 0;

    for (const doc of documents) {
      try {
        // Create document
        const document = await prisma.document.create({
          data: {
            id: doc._id,
            name: doc.name,
            filePath: doc.filePath,
            fileSize: BigInt(doc.fileSize.$numberLong),
            fileType: doc.fileType,
            status: doc.status,
            organizationId: doc.organizationId,
            departmentId: doc.departmentId,
            createdAt: new Date(doc.createdAt.$date),
            updatedAt: new Date(doc.updatedAt.$date),
            uploadedById: doc.uploadedById
          }
        });

        const llmData = doc.extractedData?.llmData;
        if (!llmData) continue;

        // Extract vendor data
        const vendorData = llmData.vendor?.value;
        const vendorName = vendorData?.vendorName?.value || 'Unknown Vendor';
        const vendorTaxId = vendorData?.vendorTaxId?.value || null;

        // Create or find vendor
        const vendor = await prisma.vendor.upsert({
          where: {
            name_taxId: {
              name: vendorName,
              taxId: vendorTaxId || ''
            }
          },
          update: {},
          create: {
            name: vendorName,
            partyNumber: vendorData?.vendorPartyNumber?.value || null,
            address: vendorData?.vendorAddress?.value || null,
            taxId: vendorTaxId
          }
        });

        // Extract customer data
        const customerData = llmData.customer?.value;
        const customerName = customerData?.customerName?.value || 'Unknown Customer';

        // Create or find customer
        let customer = await prisma.customer.findFirst({
          where: {
            name: customerName
          }
        });
        
        if (!customer) {
          customer = await prisma.customer.create({
            data: {
              name: customerName,
              address: customerData?.customerAddress?.value || null
            }
          });
        }

        // Extract invoice data
        const invoiceData = llmData.invoice?.value;
        const summaryData = llmData.summary?.value;
        const paymentData = llmData.payment?.value;

        const invoiceNumber = invoiceData?.invoiceId?.value || doc._id.substring(0, 8);
        const invoiceDate = invoiceData?.invoiceDate?.value 
          ? new Date(invoiceData.invoiceDate.value)
          : new Date(doc.createdAt.$date);

        // Create invoice
        const invoice = await prisma.invoice.create({
          data: {
            documentId: document.id,
            invoiceNumber,
            invoiceDate,
            deliveryDate: invoiceData?.deliveryDate?.value 
              ? new Date(invoiceData.deliveryDate.value)
              : null,
            dueDate: paymentData?.dueDate?.value 
              ? new Date(paymentData.dueDate.value)
              : null,
            subTotal: summaryData?.subTotal?.value || 0,
            totalTax: summaryData?.totalTax?.value || 0,
            invoiceTotal: summaryData?.invoiceTotal?.value || 0,
            currencySymbol: summaryData?.currencySymbol?.value || 'EUR',
            status: doc.status,
            vendorId: vendor.id,
            customerId: customer.id
          }
        });

        // Create payment info
        if (paymentData) {
          await prisma.payment.create({
            data: {
              invoiceId: invoice.id,
              bankAccountNumber: paymentData.bankAccountNumber?.value || null,
              bic: paymentData.BIC?.value || null,
              accountName: paymentData.accountName?.value || null,
              paymentTerms: paymentData.paymentTerms?.value || null,
              netDays: paymentData.netDays?.value || 0,
              discountPercentage: paymentData.discountPercentage?.value 
                ? parseFloat(paymentData.discountPercentage.value)
                : null,
              discountDays: paymentData.discountDays?.value || 0,
              discountDueDate: paymentData.discountDueDate?.value 
                ? new Date(paymentData.discountDueDate.value)
                : null,
              discountedTotal: paymentData.discountedTotal?.value 
                ? parseFloat(paymentData.discountedTotal.value)
                : null
            }
          });
        }

        // Create line items
        const lineItems = llmData.lineItems?.value?.items?.value || [];
        for (const item of lineItems) {
          const sachkonto = item.Sachkonto?.value || item.sachkonto?.value;
          const buSchluessel = item.BUSchluessel?.value || item.buSchluessel?.value;
          await prisma.lineItem.create({
            data: {
              invoiceId: invoice.id,
              srNo: item.srNo?.value || 0,
              description: item.description?.value || 'No description',
              quantity: item.quantity?.value || 0,
              unitPrice: item.unitPrice?.value || 0,
              totalPrice: item.totalPrice?.value || 0,
              sachkonto: sachkonto ? String(sachkonto) : null,
              buSchluessel: buSchluessel ? String(buSchluessel) : null,
              category: getCategory(sachkonto)
            }
          });
        }

        processedCount++;
        if (processedCount % 10 === 0) {
          console.log(`✅ Processed ${processedCount}/${documents.length} documents`);
        }
      } catch (error) {
        errorCount++;
        console.error(`❌ Error processing document ${doc._id}:`, error);
      }
    }

    console.log('\n✅ Seed completed!');
    console.log(`   Processed: ${processedCount}`);
    console.log(`   Errors: ${errorCount}`);

    // Print statistics
    const stats = await Promise.all([
      prisma.document.count(),
      prisma.invoice.count(),
      prisma.vendor.count(),
      prisma.customer.count(),
      prisma.lineItem.count()
    ]);

    console.log('\n📊 Database statistics:');
    console.log(`   Documents: ${stats[0]}`);
    console.log(`   Invoices: ${stats[1]}`);
    console.log(`   Vendors: ${stats[2]}`);
    console.log(`   Customers: ${stats[3]}`);
    console.log(`   Line Items: ${stats[4]}`);

  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
