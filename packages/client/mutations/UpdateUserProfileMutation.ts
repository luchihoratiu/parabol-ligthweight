import {commitMutation} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'

graphql`
  fragment UpdateUserProfileMutation_team on UpdateUserProfilePayload {
    teamMembers {
      preferredName
      picture
      user {
        picture
        preferredName
      }
    }
  }
`

const mutation = graphql`
  mutation UpdateUserProfileMutation($updatedUser: UpdateUserProfileInput!) {
    updateUserProfile(updatedUser: $updatedUser) {
      error {
        message
      }
      ...UpdateUserProfileMutation_team @relay(mask: false)
    }
  }
`

const UpdateUserProfileMutation = (environment, updatedUser, {onError, onCompleted}) => {
  const {viewerId} = environment
  return commitMutation(environment, {
    mutation,
    variables: {updatedUser},
    optimisticUpdater: (store) => {
      const viewer = store.get(viewerId)
      if (!viewer) return
      const {picture, preferredName} = updatedUser
      if (viewer) {
        if (preferredName) {
          viewer.setValue(preferredName, 'preferredName')
        }
      }
    },
    onCompleted,
    onError
  })
}

export default UpdateUserProfileMutation
