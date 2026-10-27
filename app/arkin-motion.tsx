"use client"

import { useEffect } from "react"

export function ArkinMotion() {
  useEffect(() => {
    const root = document.documentElement
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let frame = 0

    const updateScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        const distance = document.documentElement.scrollHeight - window.innerHeight
        const progress = distance > 0 ? window.scrollY / distance : 0
        root.style.setProperty("--arkin-scroll", `${Math.min(progress, 1)}`)
        root.style.setProperty("--arkin-scroll-y", `${window.scrollY}px`)
        frame = 0
      })
    }

    const updatePointer = (event: PointerEvent) => {
      if (reduceMotion) return
      const x = event.clientX / window.innerWidth
      const y = event.clientY / window.innerHeight
      root.style.setProperty("--arkin-pointer-x", `${event.clientX}px`)
      root.style.setProperty("--arkin-pointer-y", `${event.clientY}px`)
      root.style.setProperty("--arkin-shift-x", `${(x - 0.5) * 16}px`)
      root.style.setProperty("--arkin-shift-y", `${(y - 0.5) * 12}px`)
    }

    const reveals = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -8%" },
    )

    reveals.forEach((element, index) => {
      element.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 80}ms`)
      observer.observe(element)
    })

    const tiltCards = Array.from(document.querySelectorAll<HTMLElement>("[data-tilt]"))
    const cleanups = tiltCards.map((card) => {
      const move = (event: PointerEvent) => {
        if (reduceMotion || event.pointerType === "touch") return
        const rect = card.getBoundingClientRect()
        const x = (event.clientX - rect.left) / rect.width - 0.5
        const y = (event.clientY - rect.top) / rect.height - 0.5
        card.style.setProperty("--tilt-x", `${-y * 4}deg`)
        card.style.setProperty("--tilt-y", `${x * 5}deg`)
        card.style.setProperty("--glow-x", `${(x + 0.5) * 100}%`)
        card.style.setProperty("--glow-y", `${(y + 0.5) * 100}%`)
      }
      const reset = () => {
        card.style.setProperty("--tilt-x", "0deg")
        card.style.setProperty("--tilt-y", "0deg")
      }
      card.addEventListener("pointermove", move)
      card.addEventListener("pointerleave", reset)
      return () => {
        card.removeEventListener("pointermove", move)
        card.removeEventListener("pointerleave", reset)
      }
    })

    window.addEventListener("scroll", updateScroll, { passive: true })
    window.addEventListener("pointermove", updatePointer, { passive: true })
    updateScroll()

    return () => {
      observer.disconnect()
      cleanups.forEach((cleanup) => cleanup())
      window.removeEventListener("scroll", updateScroll)
      window.removeEventListener("pointermove", updatePointer)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <>
      <div aria-hidden="true" className="arkin-scroll-progress" />
      <div aria-hidden="true" className="arkin-pointer-glow" />
    </>
  )
}
