# UDP API with Network Load Balancer and ECS

This project creates an ECS task using AWS SAM that returns a "Hello World" message. The task runs in Fargate and includes CloudWatch logging. The task is called via UDP by using a Network Load Balancer.

## Prerequisites

- AWS SAM CLI installed and configured
- Docker installed (for building and deploying the application)
- AWS Account and configured credentials

## Stacks

The project is separate into separate stacks responsible for different things.
* ECR Stack deploys the container repository that will be used by ECS to pull the image for the Task.
* Network Stack deploys all the required networking components needed to deploy this application. This includes the VPCs, Subnets, the Network Load Balancer that will be used as the UDP entry point for the API.
* ECS Stack deploys the ECS cluster, ECS Service and creates the task definition

You first need to get the core components (Network and ECR) deployed. With these resources in place we can build and publish our container image to ECR. Once we have a published image we can deploy the ECS resources, we need to follow this order since the Task Definitions for ECS reference the image from ECR.

## Deployment

Each stack can be deployed two different ways:
* Using the SAM CLI from your local terminal.
* Using the provided GitHub workflows.

### ECR Stack

```bash
# Build the ECR stack
sam build --config-file samconfig.yaml --config-env ecr --template template-ecr.yaml   
```

```bash
# Deploy the ECR stack
sam deploy --config-file samconfig.yaml --config-env ecr --template template-ecr.yaml
```

### Networking Stack

```bash
# Build the Network Stack
sam build --config-file samconfig.yaml --config-env network --template template-network.yaml
```

```bash
# Deploy the Network stack
sam deploy --config-file samconfig.yaml --config-env network --template template-network.yaml
```

### Build and Publish Container Image

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin {ACCOUNT_ID}].dkr.ecr.us-east-1.amazonaws.com

# Build the Docker image
docker build --platform linux/amd64 -t hello-world-app-udp ./hello-world-app-udp

# Tag the image
docker tag hello-world-app-udp:{TAG} {ECR_REGISTRY}/{ECR_REPOSITORY}:{TAG}

# Push the image to ECR
docker push {ECR_REGISTRY}/{ECR_REPOSITORY}:{TAG}
```

### ECS Stack

```bash
# Build the ECS Stack
sam build --config-file samconfig.yaml --config-env ecs --template template-ecs.yaml
```

```bash
# Deploy the ECS stack
sam deploy --config-file samconfig.yaml --config-env ecs --template template-ecs.yaml
```

## Testing 

```bash
echo "Hello" | nc -u -w1 hello-world-udp-nlb-a52d3d855052d6d1.elb.us-east-1.amazonaws.com 53
```

## Components

- ECR Repository for Docker image
- ECS Cluster running on Fargate
- Task Definition with custom container
- ECS Service
- VPC with public subnet
- Security Group
- CloudWatch Log Group
- IAM Role for task execution




# TODO
* Added manual permissions to pipeline execution for this to work with ECR.