# UDP API with Network Load Balancer and ECS

This project creates an ECS task using AWS SAM that returns a "Hello World" message. The task runs in Fargate and includes CloudWatch logging. The task is called via UDP by using a Network Load Balancer.

## Prerequisites

- AWS SAM CLI installed and configured
- Docker (for building and deploying the application)

## Stacks

The project is separated into separate stacks that are responsible for different parts of the architecture.

### ECR Stack
Sets up the repository where the container image will be deployed.

### Networking Stack
Deploys all the required networking components to be able to run the API. This includes:
- VPC
- Public subnets across 2 availability zones
- Internet Gateway with route table configuration
- Security Group configured for UDP/TCP ports 53 and HTTP port 80
- Network Load Balancer with UDP listener
- Target Group for UDP traffic on port 53

### ECS Stack
Contains all the resources to run Elastic Container Service with Fargate. This includes:
- ECS Cluster
- ECS Service
- ECS Task Definition

## Deployment

Each stack is dependent on the other deploying resources higher in the stack. The order is the following:  

1. Networking Stack
1. ECR Stack
1. Publish Container Image
1. ECS Stack

Each of these steps can be done in two different ways:
* Using SAM CLI from your local terminal.
* Using the provided GitHub workflows.

### Deploying using GitHub Workflows

In my opinion this is the simpler route as everything is already setup to work, all that is needed is to setup the proper trust relationship between GitHub and AWS and setting up the proper secrets.

#### Clone/fork the repository
Clone or fork this repository and push it to your own GitHub account.

#### Setup GitHub environment
 Add your Pipeline Execution Role (PIPELINE_EXECUTION_ROLE), CloudFormation Execution Role (CLOUDFORMATION_EXECUTION_ROLE) and a target S3 bucket name for the artifacts (ARTIFACTS_BUCKET_NAME) as repository secrets. Here is an explanation by [Chris Ebert](https://twitter.com/realchrisebert) on how to set this up. Since the workflows publish the container image to ECR, the Pipeline Execution Role requires these permissions:
 * ecr:GetAuthorizationToken
 * ecr:InitiateLayerUpload
 * ecr:InitiateLayerUpload
 * ecr:UploadLayerPart
 * ecr:CompleteLayerUpload
 * ecr:BatchCheckLayerAvailability
 * ecr:PutImage

 #### Run the Workflow
 Now all that is needed is to run the provided `Deployment` GitHub Workflow. This will take care of deploying all of the CloudFormation stacks and publish the container image.

## Testing 

To test that it's working, grab the URL from the output of the ECS deployment and replace it in the command below.

```bash
echo "Hello" | nc -u -w1 {NLB_URL} 53
```
