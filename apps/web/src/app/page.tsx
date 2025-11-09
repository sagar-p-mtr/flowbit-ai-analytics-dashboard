"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { BarChart, LineChart, PieChart, DollarSign, FileText, Upload, TrendingUp, MessageSquare, Search, Send, Download } from "lucide-react"
import axios from "axios"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar, Line, Pie } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend)

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001/api'

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null)
  const [invoiceTrends, setInvoiceTrends] = useState<any[]>([])
  const [topVendors, setTopVendors] = useState<any[]>([])
  const [categorySpend, setCategorySpend] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [chatQuery, setChatQuery] = useState('')
  const [chatHistory, setChatHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, trendsRes, vendorsRes, categoryRes, invoicesRes] = await Promise.all([
        axios.get(`${API_BASE}/stats`),
        axios.get(`${API_BASE}/invoice-trends`),
        axios.get(`${API_BASE}/vendors/top10`),
        axios.get(`${API_BASE}/category-spend`),
        axios.get(`${API_BASE}/invoices?limit=50`)
      ])

      setStats(statsRes.data)
      setInvoiceTrends(trendsRes.data)
      setTopVendors(vendorsRes.data)
      setCategorySpend(categoryRes.data)
      setInvoices(invoicesRes.data.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  const handleSearch = async () => {
    try {
      const res = await axios.get(`${API_BASE}/invoices?search=${searchQuery}`)
      setInvoices(res.data.data)
    } catch (error) {
      console.error('Error searching invoices:', error)
    }
  }

  const handleChatQuery = async () => {
    if (!chatQuery.trim()) return

    setLoading(true)
    try {
      const res = await axios.post(`${API_BASE}/chat-with-data`, { query: chatQuery })
      setChatHistory([...chatHistory, {
        query: chatQuery,
        response: res.data
      }])
      setChatQuery('')
    } catch (error: any) {
      setChatHistory([...chatHistory, {
        query: chatQuery,
        response: { error: error.response?.data?.error || 'Failed to process query' }
      }])
    } finally {
      setLoading(false)
    }
  }

  // CSV Export functionality
  const exportToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      alert('No data to export')
      return
    }

    // Get headers from first object
    const headers = Object.keys(data[0])
    
    // Convert data to CSV format
    const csvContent = [
      headers.join(','), // Header row
      ...data.map(row => 
        headers.map(header => {
          const value = row[header]
          // Handle nested objects
          if (typeof value === 'object' && value !== null) {
            return JSON.stringify(value).replace(/"/g, '""')
          }
          // Escape quotes and wrap in quotes if contains comma
          const stringValue = String(value)
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`
          }
          return stringValue
        }).join(',')
      )
    ].join('\n')

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportInvoices = () => {
    const exportData = invoices.map(inv => ({
      'Invoice Number': inv.invoiceNumber,
      'Vendor': inv.vendor?.name || 'N/A',
      'Customer': inv.customer?.name || 'N/A',
      'Amount (EUR)': inv.invoiceTotal,
      'Date': new Date(inv.invoiceDate).toLocaleDateString(),
      'Status': inv.status
    }))
    exportToCSV(exportData, 'invoices')
  }

  const exportChatResults = (results: any[]) => {
    if (!results || results.length === 0) return
    exportToCSV(results, 'chat_query_results')
  }

  // Chart data configurations
  const trendChartData = {
    labels: invoiceTrends.map(t => t.month),
    datasets: [
      {
        label: 'Invoice Count',
        data: invoiceTrends.map(t => t.count),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        yAxisID: 'y',
      },
      {
        label: 'Total Value (EUR)',
        data: invoiceTrends.map(t => t.total),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        yAxisID: 'y1',
      },
    ],
  }

  const vendorChartData = {
    labels: topVendors.map(v => v.name),
    datasets: [{
      label: 'Spend (EUR)',
      data: topVendors.map(v => v.totalSpend),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(234, 179, 8, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(20, 184, 166, 0.8)',
        'rgba(251, 146, 60, 0.8)',
        'rgba(14, 165, 233, 0.8)',
        'rgba(132, 204, 22, 0.8)',
      ],
    }],
  }

  const categoryPieData = {
    labels: categorySpend.map(c => c.category),
    datasets: [{
      label: 'Spend by Category',
      data: categorySpend.map(c => c.total),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(234, 179, 8, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(168, 85, 247, 0.8)',
      ],
    }],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Tabs defaultValue="dashboard" className="w-full">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-80 bg-white border-r min-h-screen p-6">
            <h1 className="text-2xl font-bold mb-8 text-blue-600">Flowbit AI</h1>
            <TabsList className="flex flex-col h-auto space-y-2 w-full">
              <TabsTrigger value="dashboard" className="w-full justify-start">
                <BarChart className="mr-2 h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="chat" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat with Data
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <div className="text-sm text-gray-500">
                <p className="mb-2">Chat with Your Data</p>
                <p className="text-xs">Ask questions about your invoices and analytics</p>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-8">
            <h2 className="text-3xl font-bold mb-6">Analytics Dashboard</h2>
            
            <TabsContent value="dashboard" className="mt-0">
              <div className="space-y-4">
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Spend (YTD)</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        €{stats ? stats.totalSpend.toFixed(2) : '0.00'}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {stats ? stats.totalInvoices : 0}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Documents Uploaded</CardTitle>
                      <Upload className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {stats ? stats.documentsUploaded : 0}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Avg Invoice Value</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        €{stats ? stats.averageInvoiceValue.toFixed(2) : '0.00'}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
                <Card>
                  <CardHeader>
                    <CardTitle>Invoice Volume & Value Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {invoiceTrends.length > 0 && (
                      <Line 
                        data={trendChartData}
                        options={{
                          responsive: true,
                          interaction: {
                            mode: 'index',
                            intersect: false,
                          },
                          scales: {
                            y: {
                              type: 'linear',
                              display: true,
                              position: 'left',
                            },
                            y1: {
                              type: 'linear',
                              display: true,
                              position: 'right',
                              grid: {
                                drawOnChartArea: false,
                              },
                            },
                          },
                        }}
                      />
                    )}
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Top 10 Vendors by Spend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {topVendors.length > 0 && (
                        <Bar 
                          data={vendorChartData}
                          options={{
                            indexAxis: 'y',
                            responsive: true,
                            plugins: {
                              legend: {
                                display: false,
                              },
                            },
                          }}
                        />
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Spend by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {categorySpend.length > 0 && (
                        <Pie 
                          data={categoryPieData}
                          options={{
                            responsive: true,
                            plugins: {
                              legend: {
                                position: 'bottom',
                              },
                            },
                          }}
                        />
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Invoices Table */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Recent Invoices</CardTitle>
                      <Button onClick={exportInvoices} variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                      </Button>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Input 
                        placeholder="Search invoices..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      />
                      <Button onClick={handleSearch}>
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Invoice #</th>
                            <th className="text-left p-2">Date</th>
                            <th className="text-left p-2">Vendor</th>
                            <th className="text-right p-2">Amount</th>
                            <th className="text-left p-2">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoices.map((inv) => (
                            <tr key={inv.id} className="border-b hover:bg-gray-50">
                              <td className="p-2">{inv.invoiceNumber}</td>
                              <td className="p-2">{new Date(inv.invoiceDate).toLocaleDateString()}</td>
                              <td className="p-2">{inv.vendorName}</td>
                              <td className="text-right p-2">€{inv.amount.toFixed(2)}</td>
                              <td className="p-2">
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                                  {inv.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="chat" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Chat with Your Data</CardTitle>
                  <p className="text-sm text-muted-foreground">Ask questions about your invoices and analytics</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Chat History */}
                    <div className="h-96 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-lg">
                      {chatHistory.length === 0 ? (
                        <div className="text-center text-gray-500 mt-20">
                          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Start asking questions about your data!</p>
                          <p className="text-sm mt-2">Example: "What's the total spend in the last 90 days?"</p>
                        </div>
                      ) : (
                        chatHistory.map((chat, idx) => (
                          <div key={idx} className="space-y-2">
                            <div className="bg-blue-100 p-3 rounded-lg">
                              <p className="font-semibold">You:</p>
                              <p>{chat.query}</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <p className="font-semibold">AI:</p>
                              {chat.response.error ? (
                                <p className="text-red-600">{chat.response.error}</p>
                              ) : (
                                <div>
                                  {chat.response.sql && (
                                    <div className="mb-2">
                                      <p className="text-sm text-gray-600">Generated SQL:</p>
                                      <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">{chat.response.sql}</pre>
                                    </div>
                                  )}
                                  {chat.response.data && (
                                    <div>
                                      <p className="text-sm text-gray-600">Results:</p>
                                      <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-40">
                                        {JSON.stringify(chat.response.data, null, 2)}
                                      </pre>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Chat Input */}
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Ask a question..." 
                        value={chatQuery}
                        onChange={(e) => setChatQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleChatQuery()}
                        disabled={loading}
                      />
                      <Button onClick={handleChatQuery} disabled={loading}>
                        {loading ? 'Processing...' : <Send className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  )
}
