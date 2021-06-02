FROM node:13-alpine
LABEL maintainer="glitchylabs@gmail.com"
WORKDIR "/mnt"
RUN apk --update add git
ADD [ "package.json", "." ]
RUN npm install --no-package-lock
ADD [ "src", "src/" ]
ADD [ "tsconfig.json", "." ]
ADD [ ".eslintrc.json", "."]
RUN chown -R 65534:65534 /mnt
USER 65534:65534
RUN npm run build
EXPOSE 31337
ENTRYPOINT [ "npm", "run", "start" ]
# ENTRYPOINT ["tail", "-f", "/dev/null"] # Use for Debugging