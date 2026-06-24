import type { CostEstimate } from '../lib/pricing'
import styles from './CostChart.module.css'

interface CostChartProps {
  estimates: CostEstimate[]
  label: string
}

export function CostChart({ estimates, label }: CostChartProps) {
  if (estimates.length === 0) return null

  const maxCost = Math.max(...estimates.map((e) => e.inputCostUsd), 0.000001)

  return (
    <div className={styles.chart}>
      <h4 className={styles.chartLabel}>{label}</h4>
      <div className={styles.bars}>
        {estimates.map((est) => {
          const width = Math.max((est.inputCostUsd / maxCost) * 100, 2)
          return (
            <div key={est.model.id} className={styles.row}>
              <span className={styles.name}>{est.model.name}</span>
              <div className={styles.track}>
                <div className={styles.bar} style={{ width: `${width}%` }} />
              </div>
              <span className={styles.value}>{est.formatted}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}