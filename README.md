Переделаны все докерфайлы nginx




Тут уже настроено на то, чтобы он обновлял файлы
Я делал так, что он жёстко переписывает файлы на сервере
    - name: SSH into remote Windows server and deploy with Docker Compose
      run: |
        ssh -o StrictHostKeyChecking=no -i ~/.ssh/id_rsa imbydata@20.107.247.116 << 'EOF'
        cd C:/Users/imbydata/Desktop/Visualizer                                              #Переходим в папку где я запускал визуализатор
        powershell
        git fetch origin  
        git reset --hard origin/main                                       # Загружаем изменения(можно заменить на git clone по ssh  если захочешь сам
        docker-compose -f docker-compose.stage.yml up --build
        EOF
    env:
      SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
