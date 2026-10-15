import { Link, type LinkProps } from 'react-router-dom'
import { useI18n } from '../i18n'
import { localizePath } from '../i18n/paths'

type LocalLinkProps = Omit<LinkProps, 'to'> & {
  /** Language-neutral path such as `/blog` or `/#tool`. */
  to: string
}

/**
 * A `Link` that keeps the reader in the language they are already reading —
 * so no internal link can silently drop someone back into English.
 */
export function LocalLink({ to, ...props }: LocalLinkProps) {
  const { lang } = useI18n()
  return <Link to={localizePath(to, lang)} {...props} />
}
