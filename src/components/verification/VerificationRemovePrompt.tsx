import {useCallback} from 'react'
import {type AppBskyActorDefs} from '@atproto/api'
import {msg} from '@lingui/macro'
import {useLingui} from '@lingui/react'

import {logger} from '#/logger'
import {useVerificationsRemoveMutation} from '#/state/queries/verification/useVerificationsRemoveMutation'
import * as Toast from '#/view/com/util/Toast'
import {type DialogControlProps} from '#/components/Dialog'
import * as Prompt from '#/components/Prompt'
import type * as bsky from '#/types/bsky'

export {useDialogControl as usePromptControl} from '#/components/Dialog'

export function VerificationRemovePrompt({
  control,
  profile,
  verifications,
  onConfirm: onConfirmInner,
  isFounder = false, // Add founder prop
}: {
  control: DialogControlProps
  profile: bsky.profile.AnyProfileView
  verifications: AppBskyActorDefs.VerificationView[]
  onConfirm?: () => void
  isFounder?: boolean
}) {
  const {_} = useLingui()
  const {mutateAsync: remove} = useVerificationsRemoveMutation()
  
  const onConfirm = useCallback(async () => {
    onConfirmInner?.()
    try {
      await remove({profile, verifications})
      Toast.show(
        isFounder 
          ? _(msg`Removed founder status`) 
          : _(msg`Removed verification`)
      )
    } catch (e) {
      Toast.show(
        isFounder 
          ? _(msg`Failed to remove founder status`) 
          : _(msg`Failed to remove verification`), 
        'xmark'
      )
      logger.error(
        isFounder 
          ? 'Failed to remove founder status' 
          : 'Failed to remove verification',
        {safeMessage: e}
      )
    }
  }, [_, profile, verifications, remove, onConfirmInner, isFounder])

  return (
    <Prompt.Basic
      control={control}
      title={
        isFounder
          ? _(msg`Remove founder status for this account?`)
          : _(msg`Remove your verification for this account?`)
      }
      onConfirm={onConfirm}
      confirmButtonCta={
        isFounder 
          ? _(msg`Remove founder status`) 
          : _(msg`Remove verification`)
      }
      confirmButtonColor="negative"
    />
  )
}
