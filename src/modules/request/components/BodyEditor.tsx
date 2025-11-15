'use client'

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { RotateCcw, Copy, Check, AlignLeft, FileText, Sparkles, Code } from "lucide-react"
import { useRequestPlaygroundStore } from "../store/useRequestStore"
import { cn } from "@/lib/utils"


const MonacoEditor = dynamic(
  () => import("@monaco-editor/react"),
  { ssr: false }
)

const bodyEditorSchema = z.object({
  contentType: z.enum(['application/json', 'text/plain']),
  body: z.string().optional()
})
type BodyEditorFormData = z.infer<typeof bodyEditorSchema>

interface BodyEditorProps {
  initialData?: {
    contentType?: 'application/json' | 'text/plain';
    body?: string
  };
  onSubmit: (data: BodyEditorFormData) => void;
  className?: string
}



const BodyEditor: React.FC<BodyEditorProps> = ({
  initialData = { contentType: 'application/json', body: "" },
  onSubmit,
  className
}) => {

  const [copied, setCopied] = useState(false)
  const { tabs, activeTabId } = useRequestPlaygroundStore()

  const form = useForm<BodyEditorFormData>({
    resolver: zodResolver(bodyEditorSchema),
    defaultValues: {
      contentType: initialData.contentType || 'application/json',
      body: initialData.body || ''
    }
  })

  const contentType = form.watch('contentType');
  const bodyValue = form.watch('body')

  function handleEditorChange(value?: string) {
    form.setValue('body', value || '', { shouldValidate: true })
  }

  async function handleCopy() {
    if (bodyValue) {
      try {
        await navigator.clipboard.writeText(bodyValue)
        setCopied(true)
        setTimeout(() => setCopied(false), 1000)
      } catch (error) {
        console.log("Failed to copy", error)
      }
    }
  }

  function hanldeFormat() {
    if (contentType === 'application/json' && bodyValue) {
      try {
        const formatted = JSON.stringify(JSON.parse(bodyValue), null, 2)
        form.setValue('body', formatted)
      } catch (error) {
        console.log("Invalid JSON format")
      }
    }
  }

  function handleReset() {
    form.setValue('body', '')
  }

  const contentTypeOptions = [
    {
      value: "application/json",
      label: "application/json",
      icon: Code,
      description: "JSON data format"
    },
    {
      value: "text/plain",
      label: "text/plain",
      icon: FileText,
      description: "Plain text format"
    },
  ]



  return (
    <div className={cn("w-full", className)}>
      <Form {...form}>
        <div className="border border-zinc-700 rounded-lg overflow-hidden bg-zinc-900">

          {/* Header */}
          <section className="dark:bg-zinc-900  border-b border-zinc-900 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-15">
              <h3 className="text-sm font-medium text-zinc-200 ">Raw Request Body</h3>
              <div className="flex items-center gap-2 text-xs dark:text-zinc-400 text-zinc-200">
                <span className="">Content Type</span>
                <FormField
                  control={form.control}
                  name="contentType"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-[180px] h-7 bg-zinc-700 border-zinc-600 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-zinc-800 dark:text-zinc-400 text-zinc-200 border-zinc-600">
                          {
                            contentTypeOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value} className="text-xs hover:bg-zinc-700 focus:bg-zinc-700 focus:text-zinc-200">
                                <div className="flex items-center gap-2">
                                  <option.icon className="size-3 text-zinc-200" />
                                  <span>{option.label}</span>
                                </div>
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={hanldeFormat} className="h-7 px-2 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700" title="Format JSON">
                <AlignLeft className="size-4 text-zinc-200" />
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={handleCopy} className="h-7 px-2 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700" title="Copy content">
                {copied ? <Check className="size-4 text-green-400"/> : <Copy className="size-4 text-zinc-200"/>}
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={handleReset} className="h-7 px-2 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700" title="Format JSON">
                <RotateCcw className="size-4 text-zinc-200"/>
              </Button>
            </div>
          </section>

          {/* Editor */}
          <section className="relative h-80">
            <FormField
              control={form.control}
              name="body"
              render={({field})=>(
                <FormItem>
                  <FormControl>
                    <MonacoEditor
                      height="320px"
                      value={field.value}
                      language={contentType === 'application/json' ? "json" : "plaintext"}
                      theme="vs-dark"
                      options={{
                        automaticLayout: true,
                        minimap:{enabled: false},
                        scrollBeyondLastLine:false,
                        fontSize: 18,
                        lineNumbers:'on',
                        roundedSelection:false,
                        padding:{top:16, bottom:16},
                        scrollbar:{
                          vertical:'visible',
                          horizontal:'visible',
                          useShadows:false
                        }
                      }}
                      onChange={handleEditorChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </section>

          {/* Footer */}
          <section className="bg-zin-900 border-t border-zinc-700 px-4 py-3 flex items-center justify-between">
            <div className="text-xs text-zinc-300">
              Lines: {bodyValue?.split('\n').length || 0} &nbsp;
              Characters: {bodyValue?.length || 0}
            </div>
            <Button
              type="button"
              size="sm"
              className="bg-indigo-500 hover:bg-indigo-500 text-zinc-100 h-7"
              onClick={()=>form.handleSubmit(onSubmit)()}
            >
              Update Body
            </Button>
          </section>
        </div>
      </Form>
    </div>
  )
}

export default BodyEditor