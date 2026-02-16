# Specify the base image
FROM node:20.2.0-alpine

# Set the working directory
WORKDIR /src/app

# Copy the necessary files
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm install


# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Start the application
CMD ["npm", "start"]