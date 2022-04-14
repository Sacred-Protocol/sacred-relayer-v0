# AWS Config and Deploy

All instructions are for Linux systems. OSX should be similar

## Install AWS CLI

(https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

```
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

Get current identity

`aws sts get-caller-identity`

## Access Profile Configuration

(https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html)

- Create an access keypair for your account and download the csv
- configure a profile

    `aws configure --profile sacred`

- set the current profile (optional)

    `export AWS_PROFILE=sacred`

## ECR configuration

Create a new repository for the each image

```
aws ecr create-repository \
    --repository-name sacred-relay/kovan \
    --region us-east-2
```

```
aws ecr create-repository \
    --repository-name sacred-relay/rinkeby \
    --region us-east-2
```

```
aws ecr create-repository \
    --repository-name sacred-relay/mainnet \
    --region us-east-2
```

## Docker Configuration

Create an ECS context

`docker context create ecs sacred-relay-ecs`

List contexts

`docker context ls`

Use the new context

`docker context use sacred-relay-ecs`

Set Region and Account ID

`export AWS_REGION=us-east-2`

Make sure to remove the dashes from the account id

`export AWS_ACCOUNT_ID=020804786333`

Log docker into context

`aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com`

## Build Relay

Use the local context

`docker context use default`

Build the relayer images

`docker-compose build`

Log docker into context

`aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com`

Push the images

`docker push 020804786333.dkr.ecr.us-east-2.amazonaws.com/sacred-relay:latest`

Use ECS context

`docker context use sacred-relay-ecs`

