pipeline {
    agent any

    options {
        timestamps()
        skipDefaultCheckout(false)
    }

    environment {
        // 배포 경로
        DEPLOY_ROOT      = 'C:\\deploy\\forum'
        DEPLOY_BACKEND   = 'C:\\deploy\\forum\\backend'
        DEPLOY_FRONTEND  = 'C:\\deploy\\forum\\frontend'

        // NSSM 절대경로 (중요)
        NSSM = 'C:\\nssm\\nssm.exe'

        // Next telemetry off
        NEXT_TELEMETRY_DISABLED = '1'
    }

    stages {

        stage('Checkout') {
            steps {
                echo '📦 Git Checkout'
                checkout scm
            }
        }

        stage('Frontend Build') {
            steps {
                dir('forum_front') {
                    bat '''
                        echo ===== Frontend Build =====
                        node -v
                        npm -v
                        npm ci
                        npm run build
                    '''
                }
            }
        }

        stage('Backend Build') {
            steps {
                dir('forum_server') {
                    bat '''
                        echo ===== Backend Build =====
                        gradlew.bat clean build -x test
                    '''
                }
            }
        }

        stage('Copy Artifacts') {
            steps {
                bat '''
                    echo ===== Copy Artifacts =====

                    if not exist "%DEPLOY_BACKEND%"  mkdir "%DEPLOY_BACKEND%"
                    if not exist "%DEPLOY_FRONTEND%" mkdir "%DEPLOY_FRONTEND%"

                    echo --- Backend JAR ---
                    for %%f in (forum_server\\build\\libs\\*-SNAPSHOT.jar) do (
                        copy /Y "%%f" "%DEPLOY_BACKEND%\\app.jar"
                    )

                    echo --- Frontend (.next) ---
                    if exist forum_front\\.next (
                        xcopy /E /I /Y forum_front\\.next "%DEPLOY_FRONTEND%\\.next"
                    )

                    echo --- Frontend (public) ---
                    if exist forum_front\\public (
                        xcopy /E /I /Y forum_front\\public "%DEPLOY_FRONTEND%\\public"
                    )

                    echo --- Frontend config ---
                    copy /Y forum_front\\package.json "%DEPLOY_FRONTEND%\\package.json"
                    if exist forum_front\\next.config.js (
                        copy /Y forum_front\\next.config.js "%DEPLOY_FRONTEND%\\next.config.js"
                    )

                    echo Copy Done
                '''
            }
        }

        stage('Restart Services (NSSM)') {
            steps {
                bat '''
                    echo ===== Restart NSSM Services =====

                    "%NSSM%" restart forum-backend
                    "%NSSM%" restart forum-frontend

                    timeout /t 5 /nobreak
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Build & Service Restart SUCCESS'
        }
        failure {
            echo '❌ Build FAILED'
        }
        cleanup {
            cleanWs()
        }
    }
}
