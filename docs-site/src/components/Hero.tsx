'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/Button'
import { BlurFade } from '@/components/ui/blur-fade'
import { BorderBeam } from '@/components/ui/border-beam'
import { FlickeringGrid } from '@/components/ui/flickering-grid'

// --- Types ---
interface TermLine {
  text: string
  className: string
}

// --- Helpers ---
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function charDelay(char: string, base: number): number {
  if (char === ' ') return base * 1.5
  if (char === '"' || char === "'") return base * 1.8
  if (char === '/') return base * 0.7
  return base + Math.random() * base * 0.4
}

// --- Animated Terminal ---
function AnimatedTerminal() {
  const [lines, setLines] = useState<TermLine[]>([])
  const [typing, setTyping] = useState<TermLine | null>(null)
  const [progressLine, setProgressLine] = useState<TermLine | null>(null)
  const cancelRef = useRef(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  // Auto-scroll
  useEffect(() => {
    const el = bodyRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines, typing, progressLine])

  useEffect(() => {
    cancelRef.current = false
    const dead = () => cancelRef.current

    const emit = (text: string, className: string = '') => {
      if (!dead()) setLines((p) => [...p, { text, className }])
    }

    const typeCmd = async (text: string, speed = 45) => {
      for (let i = 0; i <= text.length; i++) {
        if (dead()) return
        setTyping({ text: text.slice(0, i), className: 'text-white' })
        await sleep(charDelay(text[i] || '', speed))
      }
      if (dead()) return
      setTyping(null)
      emit(text, 'text-white')
    }

    const out = async (text: string, cls: string, ms = 120) => {
      if (dead()) return
      await sleep(ms)
      emit(text, cls)
    }

    const bar = async (label: string) => {
      const pad = label.padEnd(9)
      for (let i = 0; i <= 10; i++) {
        if (dead()) return
        const filled = '█'.repeat(i)
        const empty = '░'.repeat(10 - i)
        setProgressLine({
          text: `    ${pad} ${filled}${empty}`,
          className: 'text-neutral-600',
        })
        await sleep(40 + Math.random() * 20)
      }
      if (dead()) return
      setProgressLine(null)
      emit(`    ${pad} ██████████ done`, 'text-lime-400')
    }

    async function loop() {
      while (!dead()) {
        setLines([])
        setTyping(null)
        setProgressLine(null)
        await sleep(600)

        // ─── Act 1: Install ───
        await typeCmd('$ tstack install')
        await out('  ✓ plugin registered', 'text-lime-400', 280)
        await out(
          '  ✓ 24 commands · 6 agents · 18 skills',
          'text-lime-400',
          180,
        )
        await sleep(500)
        emit('', '')

        // ─── Act 2: Task (sonnet) ───
        await typeCmd('$ /task "add dark mode toggle"', 32)
        await out('  → sonnet analyzing scope...', 'text-neutral-500', 380)
        await sleep(650)
        await out('  ✓ 2 files modified', 'text-lime-400', 140)
        await out('  ✓ lint · build · test passing', 'text-lime-400', 180)
        await out(
          '  ✓ committed: feat(ui): dark mode toggle',
          'text-lime-400',
          180,
        )
        await sleep(500)
        emit('', '')

        // ─── Act 3: Feature (agent team) ───
        await typeCmd('$ /feature "user authentication"', 28)
        await out(
          '  → opus planning architecture...',
          'text-neutral-500',
          450,
        )
        await sleep(420)
        await out('  → dispatching agent team:', 'text-neutral-500', 280)
        await sleep(180)

        await bar('schema')
        await bar('backend')
        await bar('frontend')
        await bar('tests')

        await out(
          '  ✓ PR #42 created → ready for review',
          'text-lime-400',
          350,
        )
        await sleep(500)
        emit('', '')

        // ─── Act 4: Ship ───
        await typeCmd('$ /ship', 55)
        await out('  ✓ quality gates passed', 'text-lime-400', 350)
        await out('  ✓ pushed to main', 'text-lime-400', 220)
        await out('  ✓ deployed', 'text-lime-400', 220)

        await sleep(5000)
      }
    }

    loop()
    return () => {
      cancelRef.current = true
    }
  }, [])

  return (
    <div className="relative">
      {/* Outer glow */}
      <div className="absolute -inset-px bg-lime-400/[0.04]" />
      <div className="absolute -inset-[2px] border-2 border-lime-400/20" />
      <div
        className="pointer-events-none absolute -inset-6 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(163,230,53,0.12) 0%, transparent 65%)',
        }}
      />

      {/* Terminal */}
      <div className="relative overflow-hidden border-2 border-neutral-800 bg-[#0a0a0a]">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-neutral-800 px-4 py-2.5">
          <div className="flex gap-1.5">
            <div className="h-[9px] w-[9px] bg-[#ff5f57]" />
            <div className="h-[9px] w-[9px] bg-[#febc2e]" />
            <div className="h-[9px] w-[9px] bg-[#28c840]" />
          </div>
          <span className="ml-2 font-mono text-[11px] tracking-wider text-neutral-600 select-none">
            tstack — ~/myproject
          </span>
        </div>

        {/* Body */}
        <div
          ref={bodyRef}
          className="h-[380px] overflow-hidden px-5 py-4 font-mono text-[13px] leading-[1.75]"
        >
          {lines.map((line, i) => (
            <div key={i} className={line.className || 'h-[1.75em]'}>
              {line.text || '\u00A0'}
            </div>
          ))}

          {/* Active progress bar */}
          {progressLine && (
            <div className={progressLine.className}>{progressLine.text}</div>
          )}

          {/* Typing line with cursor */}
          {typing ? (
            <div className={typing.className}>
              {typing.text}
              <span className="ml-px inline-block h-[1.05em] w-[0.55em] translate-y-[2px] animate-pulse bg-lime-400" />
            </div>
          ) : (
            !progressLine && (
              <div>
                <span className="inline-block h-[1.05em] w-[0.55em] translate-y-[2px] animate-pulse bg-lime-400" />
              </div>
            )
          )}
        </div>

        {/* Scanline texture */}
        <div
          className="pointer-events-none absolute inset-0 mix-blend-overlay"
          style={{
            opacity: 0.02,
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.06) 2px, rgba(255,255,255,0.06) 4px)',
          }}
        />

        {/* Top vignette */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-20"
          style={{
            background:
              'linear-gradient(to bottom, rgba(163,230,53,0.02) 0%, transparent 100%)',
          }}
        />
      </div>
    </div>
  )
}

// --- Hero ---
export function Hero() {
  return (
    <div className="relative overflow-hidden bg-[#0a0a0a] dark:-mt-19 dark:-mb-32 dark:pt-19 dark:pb-32">
      {/* Flickering grid background */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          maskImage:
            'linear-gradient(to bottom, black 0%, black 55%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, black 0%, black 55%, transparent 100%)',
        }}
      >
        <FlickeringGrid
          color="rgb(163, 230, 53)"
          flickerChance={0.15}
          maxOpacity={0.08}
          squareSize={3}
          gridGap={8}
          className="h-full w-full"
        />
      </div>

      {/* Bottom fade to content */}
      <div
        className="pointer-events-none absolute right-0 bottom-0 left-0 z-[1] h-40"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, rgb(10, 10, 10) 100%)',
        }}
        aria-hidden
      />

      <div className="relative z-10 py-16 sm:px-2 lg:relative lg:px-0 lg:py-24">
        <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-12 gap-y-16 px-4 lg:max-w-8xl lg:grid-cols-2 lg:px-8 xl:gap-x-16 xl:px-12">
          {/* Left: copy */}
          <div className="relative z-10 md:text-center lg:text-left">
            <div className="relative">
              <BlurFade delay={0} direction="up">
                <p className="font-display text-5xl font-bold tracking-tighter text-white uppercase sm:text-6xl lg:text-7xl">
                  Stop prompting.
                  <br />
                  <span className="text-lime-400">Start shipping.</span>
                </p>
              </BlurFade>
              <BlurFade delay={0.1} direction="up">
                <p className="mt-5 font-sans text-lg tracking-tight text-neutral-400 sm:text-xl">
                  Three tiers. Quality gates. Agent teams.
                  <br />A structured dev workflow for Claude Code.
                </p>
              </BlurFade>
              <BlurFade delay={0.2} direction="up">
                <div className="mt-10 flex gap-4 md:justify-center lg:justify-start">
                  <div className="relative flex">
                    <BorderBeam
                      size={80}
                      duration={4}
                      colorFrom="#a3e635"
                      colorTo="#65a30d"
                      borderWidth={2}
                      pathRound={0}
                    />
                    <Button href="/">
                      <span className="font-mono text-sm font-bold tracking-wider uppercase">
                        Get started →
                      </span>
                    </Button>
                  </div>
                  <Button
                    href="https://github.com/taylorsafeclaw/tstack"
                    variant="secondary"
                  >
                    <span className="font-mono text-sm font-bold tracking-wider uppercase">
                      GitHub ↗
                    </span>
                  </Button>
                </div>
              </BlurFade>
            </div>
          </div>

          {/* Right: terminal */}
          <BlurFade
            delay={0.15}
            direction="left"
            className="relative lg:static xl:pl-10"
          >
            <AnimatedTerminal />
          </BlurFade>
        </div>
      </div>
    </div>
  )
}
