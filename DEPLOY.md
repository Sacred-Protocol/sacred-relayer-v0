# Deployment for Sacred Relayer

This is based off the Tornado cash relay deploy. We use docker-compose to keep the deployment consistent across environments. The service is deployed to an existing VPS (currently on AWS) via SSH.

The `docker-compose-*.yml` files contain the deployment configurations. It builds services for each network, and provides an HTTPS terminated NGINX proxy using LetsEncrypt or Self signed certificates.

For v0 Secrets are stored in github build environment and written to the VPS environment on deploy

For v1 the secrets will be stored in the provider secret store

## Environment

Required Environment Variables

- KOVAN_PK
- RINKEBY_PK
- MAINNET_PK
- {othernetwork}_PK (these will come as needed)
- ALCHEMY_KEY

Github Specific

- AWS_REGION
- AWS_ACCOUNT_ID
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY

## Deploy / Startup Commands

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

- Set the hostnames for the networks in `docker-compose.yml`
- Add DNS entries for the urls pointing to the VPS (can be A or CNAME)
- Build the images

        docker-compose -f docker-compose.yml build

- Start the stack

        docker-compose -f docker-compose.yml up -d

- Stop the stack

        docker-compose -f docker-compose.yml down

**Load-Balanced Server Pool**

For a load balancing service such as Cloudflare, AWS load balancers, etc that need an https origin but the public https termination is handled by the load balancer.

- Set the hostname for the networks in `docker-compose-env-lb.yml` to the DNS name provided by the VPS provider. You will need one for each origin server
- Build the images

        docker-compose -f docker-compose-env-lb.yml build

- Start the stack

        docker-compose -f docker-compose-env-lb.yml up -d

- Stop the stack

        docker-compose -f docker-compose-env-lb.yml down

## VPS Configuration

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

        ssh-keygen -t ed25519 -C "dev@sacred.finance"

- Append the public key to ~/.ssh/authorized_keys on the VPS
- Add the private key to Github settings in the repository
- Install the aws cli

        curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
        unzip awscliv2.zip
        sudo ./aws/install

