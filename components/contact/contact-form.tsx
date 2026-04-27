"use client"

import { useState } from "react"
import { Send, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useLanguageStore } from "@/lib/use-language-store"
import { translations } from "@/lib/translations"

export function ContactFormSection() {
  const { language } = useLanguageStore()
  const t = translations[language]
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    setSending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          message: formData.get('message'),
        }),
      })
      if (res.ok) {
        setSent(true)
        form.reset()
        setTimeout(() => setSent(false), 3000)
      }
    } catch {
      // silently fail
    } finally {
      setSending(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t.contact.sendMessage}</CardTitle>
      </CardHeader>
      <CardContent>
        {sent ? (
          <div className="flex flex-col items-center py-8 text-center">
            <CheckCircle className="w-12 h-12 text-primary mb-3" />
            <p className="font-medium">{t.contact.messageSent}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="name" placeholder={t.contact.messageName} required />
            <Input name="email" placeholder={t.contact.messageEmail} type="email" required />
            <Textarea name="message" placeholder={t.contact.messageText} rows={4} required />
            <Button type="submit" className="w-full gap-2" disabled={sending}>
              <Send className="w-4 h-4" />
              {sending ? '...' : t.contact.messageSend}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
