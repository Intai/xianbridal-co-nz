const AWS = require('aws-sdk')
const codedeploy = new AWS.CodeDeploy({ apiVersion: '2014-10-06' })
const cloudfront = new AWS.CloudFront({ apiVersion: '2020-05-31' })

exports.handler = (event, context, callback) => {
  cloudfront.createInvalidation({
    DistributionId: 'E2PEUF278GG617',
    InvalidationBatch: {
      CallerReference: event.DeploymentId,
      Paths: {
        Quantity: 1,
        Items: ['*'],
      },
    },
  }, errCdn => {
    codedeploy.putLifecycleEventHookExecutionStatus({
      deploymentId: event.DeploymentId,
      lifecycleEventHookExecutionId: event.LifecycleEventHookExecutionId,
      status: errCdn ? 'Failed' : 'Succeeded',
    }, errDeploy => {
      if (errDeploy) {
        callback('Validation test failed')
      } else {
        callback(null, 'Validation test succeeded')
      }
    })
  })
}
