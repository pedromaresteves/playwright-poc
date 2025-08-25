pipeline {
    agent none
    stages {
        stage('Test Matrix') {
            matrix {
                axes {
                    axis {
                        name: 'SHARD_INDEX'
                        values: '1 2'
                    }
                }
                agent { 
                    label "${SHARD_INDEX == '1' ? 'Built-In Node' : 'docker_pw'}"
                 }
                stages {
                    stage('Checkout') {
                        steps {
                            checkout scm
                        }
                    }
                    stage('Setup Node.js') {
                        steps {
                            // Make sure Node.js is installed on the Windows VM or use nvm/nvs
                            bat 'node -v'
                        }
                    }
                    stage('Install dependencies') {
                        steps {
                            bat 'npm ci'
                        }
                    }
                    stage('Install Playwright Browsers') {
                        steps {
                            bat 'npx playwright install --with-deps'
                        }
                    }
                    stage('Run the Playwright tests') {
                        steps {
                            bat "npx playwright test --shard=${SHARD_INDEX}/2 --config=playwright.actions.config.ts"
                        }
                    }
                    stage('Archive blob report') {
                        steps {
                            archiveArtifacts artifacts: 'blob-report/**', allowEmptyArchive: true
                        }
                    }
                }
            }
        }
    }
}