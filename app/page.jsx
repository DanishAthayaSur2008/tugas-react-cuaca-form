"use client"

import { useState, useEffect, useRef } from "react"
import RegistrationForm from "../components/RegistrationForm"
import WeatherApp from "../components/WeatherApp"
import AnimatedBackground from "../components/AnimatedBackground"
import { Button } from "../components/ui/button"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { TextPlugin } from "gsap/TextPlugin"
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin"

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin, MorphSVGPlugin)

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("registration")
  const headerRef = useRef(null)
  const subtitleRef = useRef(null)
  const buttonsRef = useRef(null)
  const contentRef = useRef(null)
  const particlesRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline()

    // Animated background particles
    gsap.set(".particle", {
      x: () => Math.random() * window.innerWidth,
      y: () => Math.random() * window.innerHeight,
      scale: () => Math.random() * 0.5 + 0.5,
      opacity: 0.1,
    })

    gsap.to(".particle", {
      duration: 20,
      x: "+=100",
      y: "+=50",
      rotation: 360,
      repeat: -1,
      yoyo: true,
      ease: "none",
      stagger: 0.5,
    })

    // Main title animation with split text effect
    tl.fromTo(
      headerRef.current,
      {
        scale: 0.5,
        opacity: 0,
        rotationY: 180,
      },
      {
        scale: 1,
        opacity: 1,
        rotationY: 0,
        duration: 2,
        ease: "elastic.out(1, 0.5)",
      },
    )
      .fromTo(
        subtitleRef.current,
        {
          y: 100,
          opacity: 0,
          skewX: 45,
        },
        {
          y: 0,
          opacity: 1,
          skewX: 0,
          duration: 1.5,
          ease: "back.out(1.7)",
        },
        "-=1",
      )
      .fromTo(
        buttonsRef.current.children,
        {
          scale: 0,
          rotation: 180,
          opacity: 0,
        },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 1,
          ease: "bounce.out",
          stagger: 0.2,
        },
        "-=0.5",
      )

    // Content fade in
    gsap.fromTo(
      contentRef.current,
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: 2,
        ease: "power2.out",
      },
    )

    // Floating animation for header
    gsap.to(headerRef.current, {
      y: -10,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    })

    return () => {
      tl.kill()
    }
  }, [])

  const handleTabChange = (tab) => {
    gsap.to(contentRef.current, {
      scale: 0.95,
      opacity: 0.3,
      duration: 0.3,
      ease: "power2.out",
      onComplete: () => {
        setActiveTab(tab)
        gsap.to(contentRef.current, {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
        })
      },
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <AnimatedBackground />

      <div ref={particlesRef} className="absolute inset-0 pointer-events-none z-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-2 h-2 bg-white rounded-full opacity-20"
            style={{
              background: `linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57)`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-20">
        <header className="text-center mb-8">
          <h1
            ref={headerRef}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent px-4"
            style={{
              textShadow: "0 0 30px rgba(255,255,255,0.5)",
            }}
          >
            React Hooks Danish Athaya
          </h1>
          <p
            ref={subtitleRef}
            className="text-lg sm:text-xl md:text-2xl text-purple-200 font-medium px-4 max-w-4xl mx-auto"
            style={{
              textShadow: "0 0 20px rgba(147, 51, 234, 0.5)",
            }}
          >
            Formulir Pendaftaran + Aplikasi Cuaca
          </p>
        </header>

        <div
          ref={buttonsRef}
          className="flex flex-col sm:flex-row justify-center items-center mb-8 space-y-4 sm:space-y-0 sm:space-x-4 px-4"
        >
          <Button
            onClick={() => handleTabChange("registration")}
            variant={activeTab === "registration" ? "default" : "outline"}
            className="w-full sm:w-auto px-6 md:px-8 py-3 text-base md:text-lg transition-all duration-300 hover:scale-110 hover:rotate-2 transform-gpu"
            style={{
              background: activeTab === "registration" ? "linear-gradient(45deg, #ff6b6b, #ee5a24)" : "transparent",
              boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            }}
          >
            Registration Form
          </Button>
          <Button
            onClick={() => handleTabChange("weather")}
            variant={activeTab === "weather" ? "default" : "outline"}
            className="w-full sm:w-auto px-6 md:px-8 py-3 text-base md:text-lg transition-all duration-300 hover:scale-110 hover:rotate-2 transform-gpu"
            style={{
              background: activeTab === "weather" ? "linear-gradient(45deg, #4ecdc4, #44a08d)" : "transparent",
              boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            }}
          >
            Weather App
          </Button>
        </div>

        <div ref={contentRef} className="max-w-4xl mx-auto px-4">
          {activeTab === "registration" && <RegistrationForm />}
          {activeTab === "weather" && <WeatherApp />}
        </div>
      </div>

      <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-12 sm:w-20 h-12 sm:h-20 border-2 border-pink-400 rounded-full animate-spin opacity-30"></div>
      <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-10 sm:w-16 h-10 sm:h-16 bg-gradient-to-r from-purple-400 to-pink-400 transform rotate-45 animate-pulse opacity-40"></div>
      <div className="absolute top-1/2 left-2 sm:left-5 w-8 sm:w-12 h-8 sm:h-12 border-2 border-blue-400 transform rotate-12 animate-bounce opacity-30"></div>
      <div className="absolute top-1/4 right-5 sm:right-20 w-6 sm:w-10 h-6 sm:h-10 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full animate-ping opacity-25"></div>
    </div>
  )
}
