import {GraphQLEnumType} from 'graphql'

export type UserFeatureFlagEnum = 'azureDevOps' | 'msTeams'

const UserFlagEnum = new GraphQLEnumType({
  name: 'UserFlagEnum',
  description: 'A flag to give an individual user super powers',
  values: {
    azureDevOps: {},
    msTeams: {},
    recurrence: {}
  }
})

export default UserFlagEnum
