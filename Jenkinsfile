pipeline {
    agent any

    stages {
        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/olmayo/checkedhub.git'
            }
        }
        stage('Configure') {
            steps {
                dir("${workspace}") {
                    // sh 'cd api; ./configure.sh ../prod/.env'
                    sh 'cd web; ./configure.sh ../prod/.env'
                }
            }
        }
        stage('Build') {
            steps {
                script {
                    api = docker.build('checkedhub/api:latest', './api')
                    web = docker.build('checkedhub/web:latest', './web')
                }
            }
        }
        stage('Push') {
            steps {
                script {
                    docker.withRegistry('https://localhost:5001') {
                        api.push('latest')
                        web.push('latest')
                    }
                }
            }
        }
    }
}
