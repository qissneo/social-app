import {type Props} from '#/components/icons/common'
import {VerifiedCheck} from '#/components/icons/VerifiedCheck'
import {VerifierCheck} from '#/components/icons/VerifierCheck'
// You'll need to create this icon component
import {FounderCheck} from '#/components/icons/FounderCheck'

export function VerificationCheck({
  verifier,
  founder,
  ...rest
}: Props & {
  verifier?: boolean
  founder?: boolean
}) {
  if (founder) {
    return <FounderCheck {...rest} />
  }
  return verifier ? <VerifierCheck {...rest} /> : <VerifiedCheck {...rest} />
}
