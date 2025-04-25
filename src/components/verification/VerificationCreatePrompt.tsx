import {useCallback, useState} from 'react'
import {View} from 'react-native'
import {msg, Trans} from '@lingui/macro'
import {useLingui} from '@lingui/react'

import {logger} from '#/logger'
import {useModerationOpts} from '#/state/preferences/moderation-opts'
import {useVerificationCreateMutation} from '#/state/queries/verification/useVerificationCreateMutation'
import * as Toast from '#/view/com/util/Toast'
import {atoms as a, useBreakpoints} from '#/alf'
import {Admonition} from '#/components/Admonition'
import {Button, ButtonIcon, ButtonText} from '#/components/Button'
import {type DialogControlProps} from '#/components/Dialog'
import * as Dialog from '#/components/Dialog'
import {VerifiedCheck} from '#/components/icons/VerifiedCheck'
import {FounderCheck} from '#/components/icons/FounderCheck'
import {Loader} from '#/components/Loader'
import * as ProfileCard from '#/components/ProfileCard'
import * as Prompt from '#/components/Prompt'
import type * as bsky from '#/types/bsky'

export function VerificationCreatePrompt({
  control,
  profile,
  isFounder = false,
}: {
  control: DialogControlProps
  profile: bsky.profile.AnyProfileView
  isFounder?: boolean
}) {
  const {_} = useLingui()
  const {gtMobile} = useBreakpoints()
  const moderationOpts = useModerationOpts()
  const {mutateAsync: create, isPending} = useVerificationCreateMutation()
  const [error, setError] = useState(``)
  const onConfirm = useCallback(async () => {
    try {
      if (isFounder) {
        await create({
          profile,
          role: 'founder',
        })
        Toast.show(_(msg`Successfully set as founder`))
      } else {
        await create({profile})
        Toast.show(_(msg`Successfully verified`))
      }
      control.close()
    } catch (e) {
      setError(_(msg`Verification failed, please try again.`))
      logger.error('Failed to create a verification', {
        safeMessage: e,
      })
    }
  }, [_, profile, create, control, isFounder])

  return (
    <Prompt.Outer control={control}>
      <View style={[a.flex_row, a.align_center, a.gap_sm, a.pb_sm]}>
        {isFounder ? (
          <FounderCheck width={18} />
        ) : (
          <VerifiedCheck width={18} />
        )}
        <Prompt.TitleText style={[a.pb_0]}>
          {isFounder 
            ? _(msg`Set as founder?`)
            : _(msg`Verify this account?`)}
        </Prompt.TitleText>
      </View>
      <Prompt.DescriptionText>
        {_(msg`This action can be undone at any time.`)}
      </Prompt.DescriptionText>

      {moderationOpts ? (
        <ProfileCard.Header>
          <ProfileCard.Avatar
            profile={profile}
            moderationOpts={moderationOpts}
          />
          <ProfileCard.NameAndHandle
            profile={profile}
            moderationOpts={moderationOpts}
          />
        </ProfileCard.Header>
      ) : null}

      {error && (
        <View style={[a.pt_lg]}>
          <Admonition type="error">{error}</Admonition>
        </View>
      )}

      <View style={[a.pt_xl]}>
        {profile.displayName ? (
          <Prompt.Actions>
            <Button
              variant="solid"
              color="primary"
              size={gtMobile ? 'small' : 'large'}
              label={isFounder ? _(msg`Set as founder`) : _(msg`Verify account`)}
              onPress={onConfirm}>
              <ButtonText>
                {isFounder ? _(msg`Set as founder`) : _(msg`Verify account`)}
              </ButtonText>
              {isPending && <ButtonIcon icon={Loader} />}
            </Button>
            <Prompt.Cancel />
          </Prompt.Actions>
        ) : (
          <Admonition type="warning">
            <Trans>
              This user does not have a display name, and therefore cannot be
              verified.
            </Trans>
          </Admonition>
        )}
      </View>

      <Dialog.Close />
    </Prompt.Outer>
  )
}
