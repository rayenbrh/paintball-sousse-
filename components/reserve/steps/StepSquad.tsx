'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { tierColors, tierHex } from '@/data/packages'
import { paintballClasses, type ClassId } from '@/data/classes'
import { CharacterCarousel } from '@/components/reserve/CharacterCarousel'
import { ClassStatsPanel } from '@/components/reserve/ClassStatsPanel'
import { GameModeSelector } from '@/components/reserve/GameModeSelector'
import { SquadSizeSelector } from '@/components/reserve/SquadSizeSelector'
import { useReservationStore } from '@/store/reservationStore'
import { useI18n } from '@/lib/i18n'

export function StepSquad() {
  const { t } = useI18n()
  const squadPhase = useReservationStore((s) => s.squadPhase)
  const setSquadPhase = useReservationStore((s) => s.setSquadPhase)
  const players = useReservationStore((s) => s.players)
  const currentPlayerIndex = useReservationStore((s) => s.currentPlayerIndex)
  const setPlayerClass = useReservationStore((s) => s.setPlayerClass)
  const setPlayerName = useReservationStore((s) => s.setPlayerName)
  const nextPlayer = useReservationStore((s) => s.nextPlayer)
  const preset = useReservationStore((s) => s.preset)

  const [classIndex, setClassIndex] = useState(0)
  const [optionIndex, setOptionIndex] = useState(0)

  const cls = paintballClasses[classIndex]!

  useEffect(() => {
    setOptionIndex(0)
  }, [classIndex])

  useEffect(() => {
    setClassIndex(0)
    setOptionIndex(0)
  }, [currentPlayerIndex])

  useEffect(() => {
    if (squadPhase !== 'character') return
    if (currentPlayerIndex !== 0) return
    if (!preset) return
    const idx = paintballClasses.findIndex((c) => c.id === preset.tier)
    if (idx >= 0) {
      setClassIndex(idx)
      const options = paintballClasses[idx]!.options
      const oi =
        preset.balls > 0 ? options.findIndex((o) => o.balls === preset.balls) : 0
      setOptionIndex(oi >= 0 ? oi : 0)
    }
  }, [squadPhase, currentPlayerIndex, preset])

  if (squadPhase === 'size') {
    return <SquadSizeSelector />
  }

  if (squadPhase === 'mode') {
    return <GameModeSelector />
  }

  const tierColor = tierColors[cls.tier]
  const tierH = tierHex[cls.tier]

  const stats = [
    { k: 'reserve.stat.power' as const, v: cls.stats.power, icon: 'firepower' as const },
    { k: 'reserve.stat.speed' as const, v: cls.stats.speed, icon: 'speed' as const },
    { k: 'reserve.stat.endurance' as const, v: cls.stats.endurance, icon: 'endurance' as const },
    { k: 'reserve.stat.accuracy' as const, v: cls.stats.accuracy, icon: 'accuracy' as const },
  ]

  const currentTeam = (players[currentPlayerIndex]?.team as 'red' | 'blue' | undefined) ?? 'red'

  return (
    <div className="container-pb flex max-w-5xl min-h-0 w-full min-w-0 flex-1 flex-col justify-center overflow-x-visible overflow-y-visible px-3 py-2 sm:px-4 lg:px-6">
      <div className="shrink-0 text-center">
        <p className="font-body text-[15px] text-[var(--text-muted)] lg:text-[14px]">
          {t('reserve.squad.charTitle')} {currentPlayerIndex + 1} {t('reserve.squad.of')} {players.length}
        </p>
        <div className="mt-2 flex items-center justify-center gap-2.5">
          {players.map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full ${i === currentPlayerIndex ? 'bg-[var(--red)]' : 'bg-[var(--border)]'}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-3 flex min-h-0 w-full min-w-0 flex-1 flex-col gap-4 overflow-x-visible overflow-y-visible sm:gap-5 lg:mt-2 lg:flex-row lg:items-center lg:justify-center lg:gap-8 lg:gap-x-10">
        {/* Empêche les slides floutées (translateX) de se peindre par-dessus la colonne stats */}
        <div className="min-h-0 min-w-0 flex-1 overflow-x-clip overflow-y-visible lg:min-w-0">
          <CharacterCarousel
            classIndex={classIndex}
            setClassIndex={setClassIndex}
            currentTeam={currentTeam}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={cls.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="relative z-30 min-h-0 w-full min-w-0 shrink-0 lg:w-auto"
          >
            <ClassStatsPanel
              cls={cls}
              tierColor={tierColor}
              tierH={tierH}
              stats={stats}
              optionIndex={optionIndex}
              setOptionIndex={setOptionIndex}
              callsignValue={players[currentPlayerIndex]?.name ?? ''}
              onCallsignChange={(value) => setPlayerName(currentPlayerIndex, value)}
              onSelectClass={() => {
                setPlayerClass(currentPlayerIndex, cls.id as ClassId, optionIndex)
                nextPlayer()
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
