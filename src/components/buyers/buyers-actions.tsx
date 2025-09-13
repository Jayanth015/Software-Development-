'use client'

import { useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Download, Upload } from 'lucide-react'

export function BuyersActions() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isImporting, setIsImporting] = useState(false)

  const handleExport = () => {
    const params = new URLSearchParams(searchParams)
    const exportUrl = `/api/buyers/export?${params.toString()}`
    window.open(exportUrl, '_blank')
  }

  const handleImport = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/buyers/import', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      
      if (result.success) {
        alert(`Successfully imported ${result.imported} buyers`)
        router.refresh()
      } else {
        alert(`Import failed: ${result.errors.map((e: any) => `Row ${e.row}: ${e.message}`).join('\n')}`)
      }
    } catch (error) {
      alert('Import failed. Please try again.')
    } finally {
      setIsImporting(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="flex justify-between items-center">
      <div className="flex space-x-2">
        <Button onClick={handleExport} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
        <Button onClick={handleImport} variant="outline" disabled={isImporting}>
          <Upload className="h-4 w-4 mr-2" />
          {isImporting ? 'Importing...' : 'Import CSV'}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  )
}

