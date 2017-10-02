FROM node:boron
RUN mkdir /app
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
COPY . /public
COPY . /cert
CMD ["npm", "run", "prod"]