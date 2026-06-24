import { colorForToken, type TokenSpan } from '../lib/tokenizer'
import styles from './TokenHighlight.module.css'

interface TokenHighlightProps {
  spans: TokenSpan[]
}

export function TokenHighlight({ spans }: TokenHighlightProps) {
  if (spans.length === 0) return null

  return (
    <div className={styles.wrap}>
      {spans.map((span, i) => (
        <span
          key={`${span.tokenIndex}-${i}`}
          className={styles.token}
          style={{
            backgroundColor: `${colorForToken(span.tokenIndex)}22`,
            borderColor: `${colorForToken(span.tokenIndex)}55`,
            color: colorForToken(span.tokenIndex),
          }}
          title={`Token #${span.tokenIndex + 1}`}
        >
          {span.text}
        </span>
      ))}
    </div>
  )
}