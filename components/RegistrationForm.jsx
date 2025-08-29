"use client"

import { useState, useTransition, useOptimistic, useEffect, useRef } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { gsap } from "gsap"

// Mock server action for form submission
async function submitRegistration(prevState, formData) {
  const name = formData.get("name")
  const email = formData.get("email")

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Basic validation
  if (!name || name.length < 2) {
    return { success: false, error: "Name must be at least 2 characters" }
  }

  if (!email || !email.includes("@")) {
    return { success: false, error: "Please enter a valid email" }
  }

  return {
    success: true,
    message: "Pendaftaran berhasil!",
    participant: { name, email, id: Date.now() },
  }
}

function SubmitButton() {
  const { pending } = useFormStatus()
  const buttonRef = useRef(null)

  useEffect(() => {
    if (pending) {
      gsap.to(buttonRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: -1,
      })
    } else {
      gsap.killTweensOf(buttonRef.current)
      gsap.set(buttonRef.current, { scale: 1 })
    }
  }, [pending])

  return (
    <Button
      ref={buttonRef}
      type="submit"
      disabled={pending}
      className="w-full py-3 text-lg transition-all duration-300 hover:scale-105 transform-gpu"
      style={{
        background: "linear-gradient(45deg, #ff6b6b, #ee5a24)",
        boxShadow: "0 10px 25px rgba(238, 90, 36, 0.4)",
      }}
    >
      {pending ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          <span>Mengirimkan...</span>
        </div>
      ) : (
        "Daftar Sekarang"
      )}
    </Button>
  )
}

export default function RegistrationForm() {
  const [participants, setParticipants] = useState([])
  const [optimisticParticipants, addOptimisticParticipant] = useOptimistic(participants, (state, newParticipant) => [
    ...state,
    newParticipant,
  ])
  const [isPending, startTransition] = useTransition()
  const [formState, setFormState] = useState({ success: null, error: null, message: null })
  const formRef = useRef(null)
  const participantsRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      {
        y: 100,
        opacity: 0,
        rotationX: -15,
      },
      {
        y: 0,
        opacity: 1,
        rotationX: 0,
        duration: 1.5,
        ease: "back.out(1.7)",
      },
    )

    // Floating animation
    gsap.to(formRef.current, {
      y: -5,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    })
  }, [])

  useEffect(() => {
    if (participantsRef.current && optimisticParticipants.length > 0) {
      const lastParticipant = participantsRef.current.lastElementChild
      if (lastParticipant) {
        gsap.fromTo(
          lastParticipant,
          {
            scale: 0,
            rotation: 180,
            opacity: 0,
          },
          {
            scale: 1,
            rotation: 0,
            opacity: 1,
            duration: 0.8,
            ease: "elastic.out(1, 0.5)",
          },
        )
      }
    }
  }, [optimisticParticipants.length])

  const handleSubmit = async (formData) => {
    const name = formData.get("name")
    const email = formData.get("email")

    // Reset form state
    setFormState({ success: null, error: null, message: null })

    // Optimistically add participant
    addOptimisticParticipant({ name, email, id: Date.now(), pending: true })

    startTransition(async () => {
      const result = await submitRegistration(formState, formData)
      if (result.success) {
        setParticipants((prev) => [...prev, result.participant])
        setFormState({ success: true, message: result.message, error: null })
      } else {
        setFormState({ success: false, error: result.error, message: null })
      }
    })
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <Card
        ref={formRef}
        className="bg-white/10 backdrop-blur-lg border-white/20 transform-gpu"
        style={{
          boxShadow: "0 25px 50px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)",
        }}
      >
        <CardHeader className="pb-4 sm:pb-6">
          <CardTitle className="text-xl sm:text-2xl text-white text-center bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Form Pendaftaran
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form action={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <Input
                name="name"
                placeholder="Full Name"
                className="bg-white/20 border-white/30 text-white placeholder:text-white/70 text-base sm:text-lg py-3 transition-all duration-300 focus:scale-105 transform-gpu"
                style={{
                  boxShadow: "inset 0 2px 10px rgba(0,0,0,0.2)",
                }}
                required
              />
            </div>

            <div>
              <Input
                name="email"
                type="email"
                placeholder="Email Address"
                className="bg-white/20 border-white/30 text-white placeholder:text-white/70 text-base sm:text-lg py-3 transition-all duration-300 focus:scale-105 transform-gpu"
                style={{
                  boxShadow: "inset 0 2px 10px rgba(0,0,0,0.2)",
                }}
                required
              />
            </div>

            <SubmitButton />

            {formState?.error && (
              <div className="text-red-300 text-center p-3 bg-red-500/20 rounded-lg animate-pulse text-sm sm:text-base">
                {formState.error}
              </div>
            )}

            {formState?.success && (
              <div className="text-green-300 text-center p-3 bg-green-500/20 rounded-lg animate-bounce text-sm sm:text-base">
                {formState.message}
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {optimisticParticipants.length > 0 && (
        <Card
          className="bg-white/10 backdrop-blur-lg border-white/20"
          style={{
            boxShadow: "0 25px 50px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)",
          }}
        >
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl text-white bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Registered Participants ({optimisticParticipants.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div ref={participantsRef} className="space-y-3 max-h-60 sm:max-h-80 overflow-y-auto">
              {optimisticParticipants.map((participant) => (
                <div
                  key={participant.id}
                  className={`p-3 sm:p-4 rounded-lg bg-white/20 flex flex-col sm:flex-row justify-between items-start sm:items-center transform-gpu transition-all duration-300 hover:scale-105 hover:bg-white/30 ${
                    participant.pending ? "opacity-50" : ""
                  }`}
                  style={{
                    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                  }}
                >
                  <div className="mb-2 sm:mb-0">
                    <div className="text-white font-medium text-sm sm:text-base">{participant.name}</div>
                    <div className="text-white/70 text-xs sm:text-sm">{participant.email}</div>
                  </div>
                  {participant.pending && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mt-2 sm:mt-0"></div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
