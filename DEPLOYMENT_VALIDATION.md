# Deployment Validation Guide

Before deploying the ECS stack, please ensure:

1. The network stack has been deployed successfully first:
```bash
sam deploy -t template-network.yaml --stack-name ${STACK_NAME}-network
```

2. Verify the following resources exist and are properly created:
   - Target Group (check AWS Console -> EC2 -> Target Groups)
   - Network Load Balancer
   - VPC, Subnets, and Security Groups

3. Ensure the Target Group ARN export exists:
```bash
aws cloudformation describe-stacks \
  --stack-name ${STACK_NAME}-network \
  --query 'Stacks[0].Outputs[?OutputKey==`TargetGroupArn`].OutputValue' \
  --output text
```

4. Then deploy the ECS stack:
```bash
sam deploy -t template-ecs.yaml --stack-name ${STACK_NAME}-ecs \
  --parameter-overrides NetworkStackName=${STACK_NAME}-network
```

If the error persists after validating these prerequisites, please check CloudWatch Logs for the ECS service for additional error details.