def bucket = 'your-deployment-bucket'
def functionName = 'your-lambda-function-name'

pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
                sh """
                    zip -r function.zip . \
                    -x "*.git*" \
                    -x "node_modules/aws-sdk/*" \
                    -x "test/*"
                """
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        
        stage('Deploy') {
            when {
                branch 'master'
            }
            steps {
                sh "aws s3 cp function.zip s3://${bucket}/function-${BUILD_NUMBER}.zip"
                
                lambdaUpdate(
                    awsRegion: 'your-region',
                    functionName: functionName,
                    artifactLocation: "function.zip",
                    runtime: 'nodejs18.x',
                    handler: 'app.handler',
                    memorySize: '128',
                    timeout: '30',
                    useInstanceCredentials: true
                )
            }
        }
    }
}
