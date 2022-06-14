# Deployment for Sacred Relayer

Deploy relayer stack to EC2.

This is based off the Tornado cash relay deploy.

docker-compose is used to keep the deployment consistent across environments. The service is deployed to an existing EC2 instance (currently on AWS) via SSH. 

The `docker-compose-*.yml` files contain the deployment configurations. It builds services for each network, a redis instance for the environment, and provides an HTTPS terminated NGINX proxy using LetsEncrypt or Self signed certificates.

For v0 Secrets are stored in github build environment and written to the VPS environment on deploy

The `certs` folder is used for the proxy-companion setup when using the `-dev-lb` and `-local`. These should not be used in production

## Environment

Configuration and Secrets are stored in github build environments (development/production) for deploy. 
These are written to the VPS environment on deploy and are then available to the instances started by docker compose.

**Environment Secrets**

- KOVAN_PK
- RINKEBY_PK
- MAINNET_PK
- {othernetwork}_PK (these will come as needed)
- KOVAN_URL
- RINKEBY_URL
- MAINNET_URL
- {othernetwork}_URL (these will come as needed)
- ALCHEMY_KEY
- AWS_REGION
- AWS_LOGS_REGION
- AWS_LOGS_GROUP
- DISCORD_WEBHOOK
- AWS_PK (ssh key)
- AWS_USER (ssh user)
- HOSTS

**Repository Secrets**

- AWS_ACCOUNT_ID
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_LOGGER_ACCESS_KEY_ID
- AWS_LOGGER_SECRET_ACCESS_KEY
- ECR_REPOSITORY

## Deploy 

Requires an existing EC2 VPS, access to ECR and a repository. 

## Startup Commands

**Local Dev**

- Set the environment variables
- Add domains to your local machine (e.g /etc/hosts) 
    
        127.0.0.1 localhost kovan.localhost rinkeby.localhost mainnet.localhost

- Build the images

        docker-compose -f docker-compose-local.yml build

- Start the stack

        docker-compose -f docker-compose-local.yml up -d

- Stop the stack

        docker-compose -f docker-compose-local.yml down

**Single Server**

- Set the hostnames for the networks in `docker-compose-[env].yml`
- Add DNS entries for the urls pointing to the VPS (can be A or CNAME)
- Build the images

        docker-compose -f docker-compose-[env].yml build

- Start the stack

        docker-compose -f docker-compose-[env].yml up -d

- Stop the stack

        docker-compose -f docker-compose-[env].yml down

**Load-Balanced Server Pool**

For a load balancing service such as Cloudflare, AWS load balancers, etc that need an https origin but the public https termination is handled by the load balancer.

- Set the hostname for the networks in `docker-compose-[env]-lb.yml` to the DNS name provided by the VPS provider. You will need one for each origin server
- Build the images

        docker-compose -f docker-compose-[env]-lb.yml build

- Start the stack

        docker-compose -f docker-compose-[env]-lb.yml up -d

- Stop the stack

        docker-compose -f docker-compose-[env]-lb.yml down

## AWS Setup 

- IAM
  - Create a programmatic access only user for the deploy
  - Create an access key/secret pair
  - Attach the `AmazonEC2ContainerRegistryPowerUser` policy
  - Download the .csv and add the credentials to the repository secrets `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`

- CloudWatch
  - Ensure that cloudwatch is enabled
  - Create am AWS access role with the following permissions:
    - CloudWatchActionsEC2Access
    - CloudWatchLogsReadOnlyAccess
    - CloudWatchLogsFullAccess
    - Custom Policy
      ```
      {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": [
                    "logs:CreateLogGroup",
                    "logs:CreateLogStream",
                    "logs:PutLogEvents",
                    "logs:DescribeLogStreams"
                ],
                "Resource": [
                    "*"
                ]
            }
        ]
      }
      ```

- ECR
  - create `relayer` repository  
  - recommend setting a repository lifecycle policy to clean up old builds

- EC2
  - Create an elastic IP
  - Create VPS on Ubuntu 20.04 (or latest LTS)
    - Install Docker

          sudo apt update
          sudo apt install apt-transport-https ca-certificates curl unzip software-properties-common
          curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
          sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
          sudo apt install docker-ce
          sudo usermod -aG docker ${USER}

    - Install docker-compose cli

          mkdir -p ~/.docker/cli-plugins/
          curl -SL https://github.com/docker/compose/releases/download/v2.2.3/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose
          chmod +x ~/.docker/cli-plugins/docker-compose
          sudo chown $USER /var/run/docker.sock

    - Create SSH key locally

          ssh-keygen -t ed25519 -C "relayer@my.org"

    - Append the public key to `~/.ssh/authorized_keys` on the VPS
    - Add the private key to Github settings in the repository (AWS_PK)
    - Install the aws cli

          curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
          unzip awscliv2.zip
          sudo ./aws/install

    - create aws credentials file
    
          /root/.aws/credentials

    - restrict access to creds

          sudo chmod 0400 /root/.aws/credentials

    - install aws cloudwatch agent

          sudo apt-get -y install python2.7
          curl https://s3.amazonaws.com/aws-cloudwatch/downloads/latest/awslogs-agent-setup.py -O
          python2.7 ./awslogs-agent-setup.py --region [your region]

  - Add the elastic IP to the VPS
  - Add the logging IAM role to the VPS (Actions -> Security -> Modify IAM Role)
## Accessing Containers

- log into the machine via ssh

- list the containers and get the name 

        docker ps

- connect to the container 

        docker exec -it <container_name> /bin/bash
