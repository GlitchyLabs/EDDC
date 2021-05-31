FROM node:13-alpine
LABEL maintainer="glitchylabs@gmail.com"
WORKDIR "/mnt"
ADD [ "package.json", "." ]
RUN npm install --no-package-lock
ADD [ "src", "src/" ]
ADD [ "tsconfig.json", "." ]
ADD [ ".eslintrc.json", "."]
RUN npm run build
EXPOSE 31337
USER 65534:65534
ENTRYPOINT [ "npm", "run", "start" ]