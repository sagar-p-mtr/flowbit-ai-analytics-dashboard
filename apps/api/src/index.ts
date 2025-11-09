import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// GET /stats - Overview statistics
app.get('/api/stats', async (req: Request, res: Response) => {
  try {
    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);

    const [totalSpend, totalInvoices, documentsCount, avgInvoice] = await Promise.all([
      prisma.invoice.aggregate({
        where: {
          invoiceDate: { gte: yearStart }
        },
        _sum: { invoiceTotal: true }
      }),
      prisma.invoice.count({
        where: {
          invoiceDate: { gte: yearStart }
        }
      }),
      prisma.document.count(),
      prisma.invoice.aggregate({
        _avg: { invoiceTotal: true }
      })
    ]);

    res.json({
      totalSpend: Math.abs(totalSpend._sum.invoiceTotal || 0),
      totalInvoices,
      documentsUploaded: documentsCount,
      averageInvoiceValue: Math.abs(avgInvoice._avg.invoiceTotal || 0)
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// GET /invoice-trends - Monthly invoice trends
app.get('/api/invoice-trends', async (req: Request, res: Response) => {
  try {
    const invoices = await prisma.invoice.findMany({
      select: {
        invoiceDate: true,
        invoiceTotal: true
      },
      orderBy: {
        invoiceDate: 'asc'
      }
    });

    const monthlyData = invoices.reduce((acc: any, invoice) => {
      const date = new Date(invoice.invoiceDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = { count: 0, total: 0 };
      }
      acc[monthKey].count += 1;
      acc[monthKey].total += Math.abs(invoice.invoiceTotal);
      
      return acc;
    }, {});

    const result = Object.entries(monthlyData).map(([month, data]: [string, any]) => ({
      month,
      count: data.count,
      total: data.total
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching invoice trends:', error);
    res.status(500).json({ error: 'Failed to fetch invoice trends' });
  }
});

// GET /vendors/top10 - Top 10 vendors by spend
app.get('/api/vendors/top10', async (req: Request, res: Response) => {
  try {
    const vendors = await prisma.vendor.findMany({
      include: {
        invoices: {
          select: {
            invoiceTotal: true
          }
        }
      }
    });

    const vendorSpend = vendors.map(vendor => ({
      id: vendor.id,
      name: vendor.name,
      totalSpend: vendor.invoices.reduce((sum, inv) => sum + Math.abs(inv.invoiceTotal), 0)
    }))
    .sort((a, b) => b.totalSpend - a.totalSpend)
    .slice(0, 10);

    res.json(vendorSpend);
  } catch (error) {
    console.error('Error fetching top vendors:', error);
    res.status(500).json({ error: 'Failed to fetch top vendors' });
  }
});

// GET /category-spend - Spend by category
app.get('/api/category-spend', async (req: Request, res: Response) => {
  try {
    const lineItems = await prisma.lineItem.findMany({
      select: {
        category: true,
        totalPrice: true
      }
    });

    const categoryData = lineItems.reduce((acc: any, item) => {
      if (!acc[item.category]) {
        acc[item.category] = 0;
      }
      acc[item.category] += Math.abs(item.totalPrice);
      return acc;
    }, {});

    const result = Object.entries(categoryData).map(([category, total]) => ({
      category,
      total
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching category spend:', error);
    res.status(500).json({ error: 'Failed to fetch category spend' });
  }
});

// GET /cash-outflow - Cash outflow forecast
app.get('/api/cash-outflow', async (req: Request, res: Response) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        payment: true
      },
      where: {
        status: {
          in: ['processed', 'pending']
        }
      }
    });

    const outflowData = invoices.reduce((acc: any, invoice) => {
      const dueDate = invoice.dueDate || invoice.invoiceDate;
      const dateKey = new Date(dueDate).toISOString().split('T')[0];
      
      if (!acc[dateKey]) {
        acc[dateKey] = 0;
      }
      acc[dateKey] += Math.abs(invoice.invoiceTotal);
      
      return acc;
    }, {});

    const result = Object.entries(outflowData)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date));

    res.json(result);
  } catch (error) {
    console.error('Error fetching cash outflow:', error);
    res.status(500).json({ error: 'Failed to fetch cash outflow' });
  }
});

// GET /invoices - List invoices with filters
app.get('/api/invoices', async (req: Request, res: Response) => {
  try {
    const { search, status, limit = '100', offset = '0' } = req.query;

    const where: any = {};
    
    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search as string, mode: 'insensitive' } },
        { vendor: { name: { contains: search as string, mode: 'insensitive' } } }
      ];
    }
    
    if (status) {
      where.status = status;
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          vendor: true,
          customer: true
        },
        orderBy: {
          invoiceDate: 'desc'
        },
        take: parseInt(limit as string),
        skip: parseInt(offset as string)
      }),
      prisma.invoice.count({ where })
    ]);

    res.json({
      data: invoices.map(inv => ({
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        invoiceDate: inv.invoiceDate,
        vendorName: inv.vendor.name,
        amount: Math.abs(inv.invoiceTotal),
        status: inv.status,
        dueDate: inv.dueDate
      })),
      total,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string)
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// POST /chat-with-data - Chat with data via Vanna AI or pattern matching
app.post('/api/chat-with-data', async (req: Request, res: Response) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const vannaUrl = process.env.VANNA_API_BASE_URL;
    
    // Try Vanna AI first if configured
    if (vannaUrl) {
      try {
        const response = await axios.post(`${vannaUrl}/query`, { query }, {
          timeout: 5000
        });
        return res.json(response.data);
      } catch (vannaError) {
        console.log('⚠️  Vanna AI not available, using pattern matching fallback');
      }
    }

    // Fallback: Pattern matching for common queries
    const queryLower = query.toLowerCase();
    let sql = '';
    let data: any[] = [];

    if (queryLower.includes('total') && (queryLower.includes('vendor') || queryLower.includes('supplier'))) {
      // Total by vendor
      const result = await prisma.$queryRaw`
        SELECT v.name as vendor, 
               COUNT(i.id)::int as invoice_count, 
               SUM(i."invoiceTotal")::float as total_amount
        FROM "Invoice" i
        JOIN "Vendor" v ON i."vendorId" = v.id
        GROUP BY v.name
        ORDER BY total_amount DESC
      `;
      sql = 'SELECT vendor, COUNT(*), SUM(invoiceTotal) FROM Invoice JOIN Vendor GROUP BY vendor';
      data = result as any[];
    } else if (queryLower.includes('top') && (queryLower.includes('vendor') || queryLower.includes('supplier'))) {
      // Top vendors
      const limit = queryLower.match(/\d+/)?.[0] || '10';
      const result = await prisma.$queryRaw`
        SELECT v.name as vendor, 
               SUM(i."invoiceTotal")::float as total_spend,
               COUNT(i.id)::int as invoice_count
        FROM "Invoice" i
        JOIN "Vendor" v ON i."vendorId" = v.id
        GROUP BY v.name
        ORDER BY total_spend DESC
        LIMIT ${parseInt(limit)}
      `;
      sql = `SELECT vendor, SUM(invoiceTotal) FROM Invoice JOIN Vendor GROUP BY vendor LIMIT ${limit}`;
      data = result as any[];
    } else if (queryLower.includes('expensive') || queryLower.includes('highest') || queryLower.includes('largest')) {
      // Most expensive invoices
      const limit = queryLower.match(/\d+/)?.[0] || '10';
      const result = await prisma.invoice.findMany({
        take: parseInt(limit),
        orderBy: { invoiceTotal: 'desc' },
        include: {
          vendor: { select: { name: true } },
          customer: { select: { name: true } }
        }
      });
      sql = `SELECT * FROM Invoice ORDER BY invoiceTotal DESC LIMIT ${limit}`;
      data = result.map((inv: any) => ({
        invoice_number: inv.invoiceNumber,
        vendor: inv.vendor?.name,
        customer: inv.customer?.name,
        amount: inv.invoiceTotal,
        date: inv.invoiceDate
      }));
    } else if (queryLower.includes('category') || queryLower.includes('categories')) {
      // Spending by category
      const result = await prisma.$queryRaw`
        SELECT category, 
               COUNT(*)::int as item_count, 
               SUM("totalPrice")::float as total_amount
        FROM "LineItem"
        WHERE category IS NOT NULL
        GROUP BY category
        ORDER BY total_amount DESC
      `;
      sql = 'SELECT category, SUM(totalPrice) FROM LineItem GROUP BY category';
      data = result as any[];
    } else if (queryLower.includes('month') || queryLower.includes('monthly')) {
      // Invoices by month
      const result = await prisma.$queryRaw`
        SELECT DATE_TRUNC('month', "invoiceDate") as month,
               COUNT(*)::int as invoice_count,
               SUM("invoiceTotal")::float as total_amount
        FROM "Invoice"
        GROUP BY month
        ORDER BY month DESC
      `;
      sql = 'SELECT month, COUNT(*), SUM(invoiceTotal) FROM Invoice GROUP BY month';
      data = result as any[];
    } else if (queryLower.includes('90 days') || queryLower.includes('last 90')) {
      // Last 90 days
      const result = await prisma.$queryRaw`
        SELECT SUM("invoiceTotal")::float as total_spend,
               COUNT(*)::int as invoice_count
        FROM "Invoice"
        WHERE "invoiceDate" >= NOW() - INTERVAL '90 days'
      `;
      sql = 'SELECT SUM(invoiceTotal) FROM Invoice WHERE invoiceDate >= NOW() - INTERVAL 90 days';
      data = result as any[];
    } else {
      // Default: Recent invoices
      const result = await prisma.invoice.findMany({
        take: 20,
        orderBy: { invoiceDate: 'desc' },
        include: {
          vendor: { select: { name: true } }
        }
      });
      sql = 'SELECT * FROM Invoice ORDER BY invoiceDate DESC LIMIT 20';
      data = result.map((inv: any) => ({
        invoice_number: inv.invoiceNumber,
        vendor: inv.vendor?.name,
        amount: inv.invoiceTotal,
        date: inv.invoiceDate,
        status: inv.status
      }));
    }

    res.json({ 
      sql: sql,
      data: data 
    });
  } catch (error: any) {
    console.error('Error in chat-with-data:', error.message);
    res.status(500).json({ 
      error: 'Failed to process query',
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ API Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
