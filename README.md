# ECS Hello World Task

This project creates an ECS task using AWS SAM that returns a "Hello World" message. The task runs in Fargate and includes CloudWatch logging.

## Prerequisites

- AWS SAM CLI
- Docker
- AWS Account and configured credentials

## Deployment

### 1. Build & Deploy the ECR repository:
```bash
# Build the ECR stack
sam build --config-file samconfig.yaml --config-env ecr --template template-ecr.yaml   
```

```bash
# Deploy the ECR stack
sam deploy --config-file samconfig.yaml --config-env ecr --template template-ecr.yaml
```

Copy output value for ECRRepositoryUrl for next step

### 2. Build and push the Docker image:
```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 965116670064.dkr.ecr.us-east-1.amazonaws.com

# Build the Docker image
docker build --platform linux/amd64 -t hello-world-app-udp ./hello-world-app-udp

# Tag the image
docker tag hello-world-app-udp:latest {ECRRepositoryUrl}:latest
docker tag hello-world-app-udp:latest 965116670064.dkr.ecr.us-east-1.amazonaws.com/andmoredev-test-repo:latest

# Push the image to ECR
docker push {ECRRepositoryUrl}:latest
docker push 965116670064.dkr.ecr.us-east-1.amazonaws.com/andmoredev-test-repo:latest
```
### 3. Build & Deploy Networking Components
```bash
# Build the Network Stack
sam build --config-file samconfig.yaml --config-env network --template template-network.yaml
```

```bash
# Deploy the Network stack
sam deploy --config-file samconfig.yaml --config-env network --template template-network.yaml
```

### 4. Deploy ECS Stack:
```bash
# Build the ECS Stack
sam build --config-file samconfig.yaml --config-env ecs --template template-ecs.yaml
```

```bash
# Deploy the ECS stack
sam deploy --config-file samconfig.yaml --config-env ecs --template template-ecs.yaml
```

### 5. After deployment, you can access the service using the URL provided in the stack outputs.

echo "Hello" | nc -u -w1 hello-world-udp-nlb-a52d3d855052d6d1.elb.us-east-1.amazonaws.com 53


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