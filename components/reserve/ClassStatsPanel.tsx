'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { PBIcon } from '@/components/ui/PBIcon'
import type { PaintballClass } from '@/data/classes'
import type { IconKey } from '@/icons'
import { useI18n } from '@/lib/i18n'
import { sounds } from '@/lib/sounds'

export type StatRow = {
  k: 'reserve.stat.power' | 'reserve.stat.speed' | 'reserve.stat.endurance' | 'reserve.stat.accuracy'
  v: number
  icon: IconKey
}

type ClassStatsPanelProps = {
  cls: PaintballClass
  tierColor: string
  tierH: string
  stats: StatRow[]
  optionIndex: number
  setOptionIndex: (i: number) => void
  callsignValue: string
  onCallsignChange: (value: string) => void
  onSelectClass: () => void
}

export function ClassStatsPanel({
  cls,
  tierColor,
  tierH,
  stats,
  optionIndex,
  setOptionIndex,
  callsignValue,
  onCallsignChange,
  onSelectClass,
}: ClassStatsPanelProps) {
  const { t } = useI18n()
  const [callsignFocused, setCallsignFocused] = useState(false)

  const opt = cls.options[optionIndex] ?? cls.options[0]!

  return (
    <div
      className="relative z-10 mx-auto mt-0 flex w-full min-w-0 max-w-full flex-col sm:max-w-xl lg:mx-0 lg:mt-0 lg:w-full lg:min-w-[min(100%,420px)] lg:max-w-md lg:shrink-0"
      style={{
        backgroundColor: '#090810',
        backgroundImage: 'none',
        opacity: 1,
        isolation: 'isolate',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
        mixBlendMode: 'normal',
        border: '1px solid #1a1626',
        borderTop: `3px solid ${tierH}`,
        borderRadius: '20px',
        padding: 'clamp(18px, 4vw, 26px) clamp(16px, 4vw, 22px)',
        boxShadow: '0 16px 40px #000000',
      }}
    >
      <div className="order-first mb-4 w-full shrink-0 lg:order-last lg:mb-0 lg:mt-4">
        <motion.button
          type="button"
          className="flex w-full items-center justify-center rounded-md font-display uppercase tracking-[0.08em]"
          style={{
            height: 'clamp(52px, 14vw, 60px)',
            fontSize: 'clamp(17px, 4.5vw, 22px)',
            background: tierH,
            color: cls.tier === 'commander' ? '#111111' : '#FFFFFF',
          }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            sounds.select()
            onSelectClass()
          }}
        >
          {t('reserve.squad.selectClass')} ▶
        </motion.button>
      </div>
      <h3
        className="font-display uppercase break-words"
        style={{ color: tierColor, fontSize: 'clamp(28px, 9vw, 54px)' }}
      >
        {t(cls.nameKey)}
      </h3>
      <p className="mt-2 font-body" style={{ color: '#C8C4D4', fontSize: '17px', fontWeight: 500 }}>
        {t(cls.taglineKey)}
      </p>
      <div className="mt-4 flex flex-col gap-4">
        {stats.map((s, idx) => (
          <div key={s.k} className="flex items-center gap-3">
            <PBIcon name={s.icon} className="text-lg" style={{ color: '#8B8498' }} />
            <div
              className="flex-1 font-body uppercase"
              style={{
                color: '#E8E4F0',
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '0.18em',
              }}
            >
              {t(s.k)}
            </div>
            <div className="flex shrink-0 items-baseline gap-0.5 font-data">
              <span style={{ color: tierColor, fontSize: '17px' }}>{s.v}</span>
              <span style={{ color: '#6B6578', fontSize: '13px' }}>/100</span>
            </div>
            <div className="h-2 w-[45%] max-w-[200px] overflow-hidden rounded-[4px] bg-[#161222]">
              <motion.div
                className="h-full rounded-[4px]"
                style={{ background: tierH }}
                initial={{ width: 0 }}
                animate={{ width: `${s.v}%` }}
                transition={{ delay: idx * 0.08, duration: 0.45, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-6 font-data">
        <div className="flex min-w-[5.5rem] flex-col gap-0.5">
          <span
            className="font-body uppercase"
            style={{
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.12em',
              color: '#8B8498',
            }}
          >
            {t('reserve.squad.chipBalls')}
          </span>
          <span style={{ fontSize: '20px', color: tierColor }}>🎯 {opt.balls}</span>
        </div>
        <div className="flex min-w-[5.5rem] flex-col gap-0.5">
          <span
            className="font-body uppercase"
            style={{
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.12em',
              color: '#8B8498',
            }}
          >
            {t('reserve.squad.chipDuration')}
          </span>
          <span style={{ fontSize: '20px', color: tierColor }}>⏱ {opt.duration}</span>
        </div>
        <div className="flex min-w-[5.5rem] flex-col gap-0.5">
          <span
            className="font-body uppercase"
            style={{
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.12em',
              color: '#8B8498',
            }}
          >
            {t('reserve.squad.chipPrice')}
          </span>
          <span style={{ fontSize: '20px', color: tierColor }}>💰 {opt.price} DT</span>
        </div>
      </div>
      <div
        className="mt-4 font-body uppercase"
        style={{
          color: '#C8C4D4',
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.2em',
        }}
      >
        {t('reserve.squad.chooseAmmo')}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {cls.options.map((o, i) => {
          const selected = optionIndex === i
          const pillText = selected
            ? cls.tier === 'commander'
              ? '#111111'
              : '#FFFFFF'
            : '#D4D0E0'
          return (
            <button
              key={`${o.balls}-${o.price}`}
              type="button"
              onClick={() => setOptionIndex(i)}
              className="inline-flex items-center justify-center rounded-full font-body font-semibold"
              style={{
                height: '44px',
                fontSize: '15px',
                padding: '0 20px',
                color: pillText,
                background: selected ? tierH : '#12101a',
                border: selected ? `1px solid ${tierH}` : '1px solid #2a2535',
              }}
            >
              {o.balls} balles · {o.price} DT
            </button>
          )
        })}
      </div>
      <div className="mt-4 font-body" style={{ color: '#C8C4D4', fontSize: '13px', fontWeight: 600 }}>
        {t('reserve.squad.callsignLabel')}
      </div>
      <input
        className="mt-2 box-border w-full rounded-[var(--radius-md)] px-4 font-body outline-none placeholder:text-[#6B6578]"
        style={{
          height: '52px',
          fontSize: '15px',
          backgroundColor: '#12101a',
          border: callsignFocused ? `1px solid ${tierH}` : '1px solid #2a2535',
          color: '#F2F0F5',
          boxShadow: callsignFocused ? `0 0 0 2px #0a0810, 0 0 0 4px ${tierH}` : undefined,
        }}
        placeholder={t('reserve.squad.callsignPlaceholder')}
        value={callsignValue}
        onChange={(e) => onCallsignChange(e.target.value)}
        onFocus={() => setCallsignFocused(true)}
        onBlur={() => setCallsignFocused(false)}
      />
    </div>
  )
}
