pipeline {
  agent any

  options {
    timestamps()
    skipDefaultCheckout(true)
  }

  environment {
    DEPLOY_ROOT        = 'C:\\deploy\\forum'
    DEPLOY_BACKEND_DIR = 'C:\\deploy\\forum\\backend'
    DEPLOY_FRONT_DIR   = 'C:\\deploy\\forum\\frontend'
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    /* =========================
       Frontend Build
       ========================= */
    stage('Frontend Build') {
      steps {
        dir('forum_front') {
          bat '''
            echo ===== Frontend Build =====
            npm ci
            npm run build
          '''
        }
      }
    }

    /* =========================
       Backend Build
       ========================= */
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

    /* =========================
       Artifact Copy
       ========================= */
    stage('Copy Artifacts') {
      steps {
        bat """
          echo ===== Copy Artifacts =====

          if not exist "${DEPLOY_BACKEND_DIR}" mkdir "${DEPLOY_BACKEND_DIR}"
          if not exist "${DEPLOY_FRONT_DIR}" mkdir "${DEPLOY_FRONT_DIR}"

          REM backend jar
          copy /Y forum_server\\build\\libs\\*.jar "${DEPLOY_BACKEND_DIR}\\app.jar"

          REM frontend build
          xcopy /E /I /Y forum_front\\.next "${DEPLOY_FRONT_DIR}\\.next"
          xcopy /E /I /Y forum_front\\public "${DEPLOY_FRONT_DIR}\\public"
          copy /Y forum_front\\package.json "${DEPLOY_FRONT_DIR}\\package.json"
        """
      }
    }

    /* =========================
       Restart Services (NSSM)
       ========================= */
    stage('Restart Services') {
      steps {
        bat '''
          echo ===== Restart NSSM Services =====

          nssm restart forum-backend
          nssm restart forum-frontend

          timeout /t 5 /nobreak
        '''
      }
    }
  }

  post {
    success {
      echo '✅ Build 완료 + 서비스 재시작 성공'
    }
    failure {
      echo '❌ Build 실패'
    }
    cleanup {
      cleanWs()
    }
  }
}
