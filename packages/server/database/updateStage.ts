import getRethink from './rethinkDriver'
import rMapIf from './rMapIf'

// this is a uesful function for updating a stage inside a meeting object
// it is superior to mutating the `phases` object in JS and then pushing the whole object
// because it eliminates the chance of a race

const updateStage = async (
  meetingId: string,
  stageId: string,
  phaseType: string,
  updater: (stage: any) => any
) => {
  const r = await getRethink()
  const mapIf = rMapIf(r)
  return r
    .table('NewMeeting')
    .get(meetingId)
    .update((meeting: any) => ({
      phases: mapIf(
        meeting('phases'),
        (phase: any) => phase('phaseType').eq(phaseType),
        (estimatePhase: any) =>
          estimatePhase.merge({
            stages: mapIf(estimatePhase('stages'), (stage: any) => stage('id').eq(stageId), updater)
          })
      )
    }))
    .run()
}

export default updateStage
