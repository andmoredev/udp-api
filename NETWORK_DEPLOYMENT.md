# Network Infrastructure Deployment Guide

This guide describes how to deploy the network infrastructure stack for the Hello World UDP application.

## Prerequisites

- AWS SAM CLI installed and configured
- AWS credentials configured
- Docker installed (for building and deploying the application)

## Deployment Steps

1. First, deploy the network infrastructure stack:

```bash
sam deploy -t template-network.yaml --stack-name hello-world-network --capabilities CAPABILITY_IAM
```

This will create:
- VPC with necessary DNS support
- Public subnets across 2 availability zones
- Internet Gateway with route table configuration
- Security Group configured for UDP/TCP ports 53 and HTTP port 80
- Network Load Balancer with UDP listener
- Target Group for UDP traffic on port 53

2. After the network stack is deployed, you can deploy the application stack:

```bash
sam deploy -t template.yaml --stack-name hello-world-app --capabilities CAPABILITY_IAM
```

The application stack will automatically import the networking resources (VPC, subnets, security groups, and load balancer) from the network stack.

## Resource Details

The network stack exports the following resources that are used by the application stack:
- VPC ID
- Security Group ID
- Public Subnet IDs (2 subnets)
- Load Balancer DNS name
- Target Group ARN

These exports use the format: `${AWS::StackName}-network-*` where * is the resource identifier.

## Verification

After both stacks are deployed:
1. Get the UDP load balancer DNS name from the network stack outputs
2. Test the UDP service using a DNS client (e.g., dig) pointing to the load balancer DNS name
3. The service should respond on port 53 UDP

## Clean Up

To remove the infrastructure:
1. First delete the application stack:
```bash
sam delete --stack-name hello-world-app
```

2. Then delete the network stack:
```bash
sam delete --stack-name hello-world-network
```

Note: Make sure to delete the stacks in this order because the application stack depends on the network stack.