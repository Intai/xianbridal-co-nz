import { CodeDeployClient, PutLifecycleEventHookExecutionStatusCommand } from '@aws-sdk/client-codedeploy'
import { CloudFrontClient, CreateInvalidationCommand } from '@aws-sdk/client-cloudfront'
const codedeploy = new CodeDeployClient({})
const cloudfront = new CloudFrontClient({})

export const handler = async (event, context) => {
  let errCdn
  try {
    console.log('create invalidation', event)
    const invalidationResult = await cloudfront.send(
      new CreateInvalidationCommand({
        DistributionId: 'E2PEUF278GG617',
        InvalidationBatch: {
          CallerReference: event.DeploymentId,
          Paths: {
            Quantity: 1,
            Items: [
              '/*',
            ],
          },
        },
      }),
    )
    console.log('finish creating invalidation', invalidationResult)
  } catch (err) {
    console.log('failed to create invalidation', err)
    errCdn = err
  }

  try {
    console.log('put lifecycle event hook')
    const lifecycleStatusOutput = await codedeploy.send(
      new PutLifecycleEventHookExecutionStatusCommand({
        deploymentId: event.DeploymentId,
        lifecycleEventHookExecutionId: event.LifecycleEventHookExecutionId,
        status: errCdn ? 'Failed' : 'Succeeded',
      }),
    )
    console.log('finish putting lifecycle event hook', lifecycleStatusOutput)
  } catch (err) {
    console.log('failed to put lifecycle event hook', err)
    throw err
  }

  return context.logStreamName
}
