pipeline {
    agent any
    stages {
        stage('Test Matrix') {
            matrix {
                axes {
                    axis {
                        name 'SHARD_INDEX'
                        values '1', '2'
                    }
                }
                stages {
                    stage('Cleanup Git Lock') {
                        steps {
                            bat 'del /f /q .git\\index.lock'
                        }
                    }
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
                            script {
                                def workspaceUnix = "${env.WORKSPACE}".replaceAll('\\\\', '/').replaceAll('^([A-Za-z]):', '/$1')
                                bat """
                                docker run --rm -v ${workspaceUnix}:${workspaceUnix} -w ${workspaceUnix} mcr.microsoft.com/playwright:v1.55.0 npx playwright test --shard=${SHARD_INDEX}/2 --config=playwright.actions.config.ts
                                """
                            }
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