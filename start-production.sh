# Build the docker image
docker build -t quiz-master-web .

# Run the docker container
docker run -p 3000:3000 quiz-master-web
