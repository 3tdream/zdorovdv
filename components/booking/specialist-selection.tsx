"use client"

import { User, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useBookingStore } from "@/lib/stores/booking-store"
import { useLanguageStore } from "@/lib/use-language-store"
import { translations } from "@/lib/translations"
import { specialists } from "@/data/specialists"
import { cn } from "@/lib/utils"

export function SpecialistSelection() {
  const { selectedServiceId, selectedSpecialistId, setSpecialistId, nextStep, prevStep } = useBookingStore()
  const { language } = useLanguageStore()
  const t = translations[language]

  const available = selectedServiceId
    ? specialists.filter((s) => s.serviceIds.includes(selectedServiceId))
    : specialists

  return (
    <div>
      <h3 className="text-lg font-semibold mb-6">{t.booking.selectSpecialist}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {available.map((spec) => {
          const name = language === 'ru' ? spec.name : spec.nameEn
          const role = language === 'ru' ? spec.role : spec.roleEn
          const isSelected = selectedSpecialistId === spec.id

          return (
            <button
              key={spec.id}
              onClick={() => setSpecialistId(spec.id)}
              className={cn(
                "flex flex-col items-center text-center p-6 rounded-xl border transition-all",
                isSelected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border hover:border-primary/40 hover:shadow-sm"
              )}
            >
              <div className="relative mb-3">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary/60" />
                </div>
                <span className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                  {spec.experience} {language === 'ru' ? 'лет' : 'yrs'}
                </span>
              </div>

              <h4 className="font-semibold text-sm">{name}</h4>
              <p className="text-xs text-primary mt-0.5">{role}</p>

              <div className="flex gap-0.5 mt-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          {t.booking.back}
        </Button>
        <Button onClick={nextStep} disabled={!selectedSpecialistId}>
          {t.booking.next}
        </Button>
      </div>
    </div>
  )
}
