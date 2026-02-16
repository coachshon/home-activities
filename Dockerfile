# Specify the base image
FROM node:20.11.1-alpine

# Set the working directory
WORKDIR /src/app

# Copy the necessary files
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm install


# Copy the rest of the application code
COPY . .

# Build the applicationFROM node:20.11.1-alpine
RUN npm run build

# Start the application
CMD ["npm", "start"]