Architecture Diagram of application.


<img width="642" alt="image" src="https://github.com/user-attachments/assets/5b66622a-abb1-4f05-9626-a0c0d57deb1f" />

Detailed explanation of the steps executed in your CI/CD pipeline.


Name: Deploy Lambda Function
    
    This GitHub Actions workflow is named "Deploy Lambda Function". It is designed to deploy an AWS Lambda function and 
    API Gateway automatically when changes are made to the main branch or when a pull request is opened against it.

Trigger: on
    The workflow triggers when certain events occur on the repository:

Push event on main branch:

    The workflow will run when changes are pushed to the main branch. This is typically used to trigger deployments 
    whenever new code is merged into the main branch.

Pull request event targeting main branch:

    The workflow will also run when a pull request (PR) is created or updated, and it targets the main branch. This 
    ensures that the deployment process is triggered when PRs are merged into main.
  
Jobs: deploy
     The deploy job defines the series of steps that will be executed in a virtual environment to deploy the Lambda 
     function and the API Gateway.

     The deploy job runs on the latest version of Ubuntu (specified by runs-on: ubuntu-latest), meaning it will execute 
    on a fresh Ubuntu environment each time the workflow runs.

Steps in the deploy job:
     Checkout code

    - name: Checkout code
      uses: actions/checkout@v2

    This step uses the actions/checkout GitHub Action to fetch the latest code from the repository. This is required to 
    access the files in the repository and work with them in subsequent steps. The v2 of the action is used here.
    Set up AWS credentials


- name: Set up AWS credentials
  
  uses: aws-actions/configure-aws-credentials@v1
  with:
  
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
  
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
  
    aws-region: us-east-1
  
   This step uses the aws-actions/configure-aws-credentials GitHub Action to set up the AWS credentials required to 

  interact with AWS services (like Lambda and API Gateway).

  It pulls the AWS Access Key ID and Secret Access Key from GitHub repository secrets (AWS_ACCESS_KEY_ID and
   AWS_SECRET_ACCESS_KEY),

  which should have been previously configured to store sensitive information securely.
  It sets the AWS region as us-east-1, which specifies the AWS region where your Lambda function and API Gateway are
  deployed.

  Install zip (if not already installed)

- name: Install zip (if not already installed)

   run: sudo apt-get install -y zip

  This step installs the zip utility on the Ubuntu runner. It's needed to create a zip file of the Lambda function code, 
   which is a requirement for deploying to AWS Lambda.

   The command
    sudo apt-get install -y zip is run to ensure that the zip tool is available for the following steps.

   Create deployment package

- name: Create deployment package
  run: |
    zip -r function.zip .  # Zip the contents of the repository (adjust if needed)

  This step creates a deployment package for the Lambda function. It zips all files in the repository (or specific 
  files, 
  depending on your configuration) into a file named function.zip.
  
  The zip -r function.zip . command recursively includes all files in the current directory (.) and creates a zip file 
  called function.zip. This zip file is needed for updating the Lambda function.

Deploy to AWS Lambda


- name: Deploy to AWS Lambda
  run: |
    aws lambda update-function-code \
      --function-name helloworldfunction \
      --zip-file fileb://function.zip \
      --region us-east-1  # Ensure you use the correct region

This step deploys the zipped Lambda function code to AWS Lambda using the AWS CLI.

It calls the aws lambda update-function-code command to update the Lambda function with the new code. The --function-

name specifies the name of the Lambda function to be updated (helloworldfunction), and --zip-file points to the zip file 

(function.zip) created earlier.

The AWS region (us-east-1) is specified to ensure the correct AWS region is used for deployment.

Deploy API Gateway


- name: Deploy API Gateway
  run: |
    aws apigatewayv2 create-deployment --api-id 4jjrp06d1j --stage-name DEV

This step deploys the API Gateway associated with the Lambda function.

It uses the AWS CLI command aws apigatewayv2 create-deployment to create a new deployment for the API Gateway with a given api-id (in this case, 4jjrp06d1j) and assigns it to a stage named DEV.

The api-id should be replaced with the actual ID of your API Gateway, and you can adjust the stage name based on your deployment requirements.






Instructions on how to test and verify the application.


1) Make changes in the workflow and commit changes
2) It trigger the workflow in the action
3) After deployment is successful
4) check with this  URL

    https://us-east-1tu0wiuvwa.auth.us-east-1.amazoncognito.com/login? 
    client_id=2d56p1jgu4hnojm3n9bgbqgjqd&redirect_uri=https://4jjrp06d1j.execute-api.us-east- 
    1.amazonaws.com/DEV/helloworldfunction&response_type=code&scope=email+openid+phone

   Steps to singin
      >Create new account
      >Enter mail ID and passaword
      >Enter the verification code which is send to mail
                     you will successfully login "Hello world"

   5)Make changes in the sourcecode in the "Hello world" line
   6)Replace the name with "MY-HELLO-WORLD"
   7)commit the changes, workflow will trigger after deployment is successful  again check with the above URL it will 
     display  "MY-HELLO-WORLD"  
    
